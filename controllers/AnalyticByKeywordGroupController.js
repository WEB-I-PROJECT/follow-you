const Analytic = require('../models/Analytic');
const KeywordGroup = require('../models/KeywordGroup');
const News = require('../models/News');
const tokenizeNews = require('../services/news');
const axios = require('axios');


const sentiment = require('sentiment-ptbr');

// Instanciar o analisador de sentimento para o português


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

  getNews(req, res) {

    const url = `http://localhost:5001/api/analytic/${req.params.type}/${req.params.id}`;
    axios.get(url)
      .then(response => {
        res.render('keyword_group/news', response.data);
      })
      .catch(error => {
        return '';
      });
  }

  async tokensCharts(req, res) {
    console.log(req.body)
    try{
    const group = await KeywordGroup.findOne({ _id: req.body.id })

      News.aggregate([
        {
          $match: {
            keywordGroup: group._id, // Filtro para documentos com keywordGroup específico
            origin: {$in : req.body.origin },
            $or: [
              { content: { $regex: '.*'+ req.body.keyword + '.*' } },
              { title: { $regex: '.*'+ req.body.keyword  + '.*'  } }
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
  
        res.json({
          labels: dateArray,
          data: countArray
        })
      });
    } 

    catch(e){
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
    
            // Analisar o sentimento do conteúdo de cada notícia
             //fazer uma função com isso depois, para ser usada em outra função
            for (const newsItem of news) {
                const { origin, content, keyword } = newsItem;
                const result = sentiment(content);
               
                console.log(result);
                
    
                if (!sentimentAnalysisResults[origin]) {
                    sentimentAnalysisResults[origin] = {};
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
    
                // Incrementar o contador de acordo com o sentimento
                sentimentAnalysisResults[origin][keyword][sentimentLabel]++;
                
                
            }
    
            // Retornar os resultados
            
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
    

  
    
    
  


}

module.exports = AnalyticByKewordGroupController
