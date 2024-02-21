const Analytic = require('../models/Analytic');
const KeywordGroup = require('../models/KeywordGroup');
const News = require('../models/News');
const tokenizeNews = require('../services/news');
const axios = require('axios');
const sentiment = require('sentiment-ptbr');


const types = {
  'cnn': 'CNN',
  'cidade-verde': 'Cidade Verde',
  'brasil-de-fato': 'Brasil de Fato'
};


class AnalyticByKewordGroupController {

  async index(req, res) {
    try {
      const analytic = await Analytic.findOne({ _id: req.params.id });

      if (!analytic) {
        return res.redirect('/analytic');
      }

      const keywordGroups = await KeywordGroup.find({ analytic: analytic });



      const promises = keywordGroups.map(async (group) => {
        group.keywords = await Promise.all(
          group.keywords.map(async (keyword) => {
            return {
              name: keyword,
              quantity: await News.countDocuments({
                keywordGroup: group,
                $or: [
                  { content: { $regex: '.*' + keyword + '.*' } },
                  { title: { $regex: '.*' + keyword + '.*' } }
                ]
              })
            };
          })
        );
      });

      await Promise.all(promises);

      return res.render('keyword_group/index', {
        analytic: analytic,
        keywordGroups: keywordGroups,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
    }
  }

  async tokenize(req, res) {
    return res.render('keyword_group/tokenize', await tokenizeNews(req.params.id));
  }

  async tokenizeApi(req, res) {
    // #swagger.tags = ['Analytic']
    // #swagger.description = 'Endpoint para obter um frequência de palavras de uma analytic.'
    // #swagger.parameters['id'] = { description: 'ID da analytic.' }

    const analytic = await Analytic.findOne({
      _id: req.params.id
    })

    if (analytic) {
      const data = await tokenizeNews(req.params.id)
      console.log(data);


      /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/WordsFrequency" },
              description: 'Frequências de palavras.' 
      } */
      return res.status(200).json({ ...data });

    }

    
    return res.status(404).json({
      error: 'Analytic id not found!'
    });
  }

  async getNewsTemplate(req, res) {
    const json = await getNews(req, res);
    if (json) {
      return res.render('keyword_group/news', { ...json, type: types[req.params.type] })
    }

      /* #swagger.responses[404] = { 
      schema:    {
        error: 'News not found'
      },
      description: 'Não encontrado.' } */
    return res.status(404).json(
      {
        error: 'News not found'
      }
    )
  }

  async getNewsApi(req, res) {

    // #swagger.tags = ['Analytic']
    // #swagger.description = 'Endpoint para obter as noticías de determinado jornal.'
    // #swagger.parameters['id'] = { description: 'ID da analytic.' }
    // #swagger.parameters['type'] = { description: 'Jornal de origem das notícias.' }

    const json = await getNews(req, res);
    console.log(json);
    if (json) {

      /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/NewsKeyword" },
              description: 'Notícias do jornal específicado.' 
      } */
      return res.status(200).json({ ...json, type: types[req.params.type] })
    }
    /* #swagger.responses[404] = { 
      schema:  {
      error: 'News not found'
    },
      description: 'Não encontrado.'  } */
    return res.status(404).json(
      {
        error: 'News not found'
      }
    )
  }



  async tokensCharts(req, res) {
    console.log(req.query)
    // #swagger.tags = ['Analytic']
    // #swagger.description = 'Endpoint para obter um frequência de palavras em gráfico por grupo de palavras.'
    // #swagger.parameters['id'] = { description: 'ID do grupo de palavras.' }
    // #swagger.parameters['origin'] = { description: 'Origem das notícias.' }
    // #swagger.parameters['keyword'] = { description: 'Palavra-chave para do grupo de palavras.' }

    try {
      const group = await KeywordGroup.findOne({ _id: req.query.id })

      News.aggregate([
        {
          $match: {
            keywordGroup: group._id, // Filtro para documentos com keywordGroup específico
            origin: { $in: req.query.origin.split(',') },
            $or: [
              { content: { $regex: '.*' + req.query.keyword + '.*' } },
              { title: { $regex: '.*' + req.query.keyword + '.*' } }
            ]
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$date" },
              month: { $month: "$date" },
              day: { $dayOfMonth: "$date" }
            },
            count: { $sum: 1 } // Conta os logs para cada grupo de data,
          }
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
            "_id.day": 1
          }
        }
      ]).then((data) => {
        const countArray = [];
        const dateArray = [];

        data.forEach(result => {
          const count = result.count;
          const year = result._id.year;
          const month = result._id.month;
          const day = result._id.day;

          const formattedDate = `${day}-${month}-${year}`;

          countArray.push(count);
          dateArray.push(formattedDate);
        });

        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/WordsCharts" },
               description: 'Frequências de palavras formatadas para gráfico.' 
       } */
        res.json({
          labels: dateArray,
          data: countArray
        })
      });
    }

    catch (e) {
        /* #swagger.responses[404] = { 
      schema: {
        error: 'KeywordGroup not found!'
      },
      description: 'Não encontrado.'  } */
      res.status(404).json({
        error: 'KeywordGroup not found!'
      });
    }

  }



  async sentimentAnalysis(req, res) {
    try {
      const groupId = req.params.id;
      const keywordGroup = await KeywordGroup.findOne({ _id: groupId });

      if (!keywordGroup) {
        return res.status(404).json({ error: 'Grupo de palavras-chave não encontrado.' });
      }

      const news = await News.find({ keywordGroup: groupId });

      const sentimentAnalysisResults = {};

      for (const newsItem of news) {
        const { origin, content, keyword } = newsItem;
        const result = sentiment(content);

        if (!sentimentAnalysisResults[origin]) {
          sentimentAnalysisResults[origin] = {
          };
        }

        if (!sentimentAnalysisResults[origin][keyword]) {
          sentimentAnalysisResults[origin][keyword] = {
            Positivas: 0,
            Negativas: 0,
            Neutras: 0
          };

        }


        let sentimentLabel;
        if (result.score > 0) {
          sentimentLabel = 'Positivas';
        } else if (result.score < 0) {
          sentimentLabel = 'Negativas';
        } else {
          sentimentLabel = 'Neutras';
        }

        sentimentAnalysisResults[origin][keyword][sentimentLabel]++;


      }


      console.log(sentimentAnalysisResults)

      // Passando chave e valor para o template
      return res.render('keyword_group/sentiment_analysis', {
        ValueSentimentOrigin: sentimentAnalysisResults,
      });

    } catch (error) {
      console.error('Ocorreu um erro ao processar o groupId: ', error);
      res.status(500).json({ error: 'Erro ao processar o groupId.' });
    }
  }


  async newsSentiment(req, res) {
    try {
      const analyticId = req.params.id;

      // Retrieve news analytics and populate keyword groups efficiently
      const news_analitic = await News.find({ analytic: analyticId })
        .populate('keywordGroup', 'name')
        .sort({ date: -1 }); // Classifique por data em ordem decrescente

      if (!news_analitic || news_analitic.length === 0) {
        return res.status(404).json({ error: 'Análise não encontrada.' });
      }


      const groupedSentimentResults = {};

      for (const newsItem of news_analitic) {
        const { title, image, origin, tags, keywordGroup, date } = newsItem;

        // Group results by keyword group name
        if (!groupedSentimentResults[keywordGroup.name]) {
          groupedSentimentResults[keywordGroup.name] = [];
        }


        if (groupedSentimentResults[keywordGroup.name].length < 15) {

          const result = sentiment(newsItem.content);

          const uniquePositiveWords = new Set(result.positive);
          const uniqueNegativeWords = new Set(result.negative);

          const positiveWordsArray = Array.from(uniquePositiveWords);
          const negativeWordsArray = Array.from(uniqueNegativeWords);

          const totalPositiveWords = positiveWordsArray.length;
          const totalNegativeWords = negativeWordsArray.length;

          //console.log(negativeWordsArray)
          //console.log(positiveWordsArray)            

          groupedSentimentResults[keywordGroup.name].push({
            image,
            title,
            origin,
            tags,
            totalPositiveWords,
            positiveWords: positiveWordsArray.join(', '), // Join with comma and space
            totalNegativeWords,
            negativeWords: negativeWordsArray.join(', '),
            date
          });
        }
      }


      console.log(groupedSentimentResults);
      return res.render('keyword_group/news_sentiment', {
        newsSentimentGrup: groupedSentimentResults
      });
    } catch (error) {
      console.error('Ocorreu um erro ao buscar as noticias ', error);
      res.status(500).json({ error: 'Erro ao buscar as noticias' });
    }
  }




}


async function getNews(req, res) {

  const url = `http://localhost:5001/api/analytic/${req.params.type}/${req.params.id}`;
  const response = await fetch(url);
  if (response.status == 200) {
    return await response.json();
  }

  return null;

}

module.exports = AnalyticByKewordGroupController
