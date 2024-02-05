const Analytic = require('../models/Analytic');
const KeywordGroup = require('../models/KeywordGroup');
const News = require('../models/News');
const tokenizeNews = require('../services/news');

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

}

module.exports = AnalyticByKewordGroupController
