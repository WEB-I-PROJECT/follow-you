const Analytic = require('../models/Analytic');
const KeywordGroup = require('../models/KeywordGroup');
const News = require('../models/News');
const tokenizeNews = require('../services/news');
const axios = require('axios');

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
    // console.log(req.body)
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

  
}

module.exports = AnalyticByKewordGroupController
