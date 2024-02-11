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
    var data = {};
    axios.get(url)
      .then(response => {
        res.render('keyword_group/news', response.data);
      })
      .catch(error => {
        return '';
      });
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
