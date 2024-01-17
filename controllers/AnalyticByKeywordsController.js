const AnalyticByKeywords = require('../models/AnalyticByKeywords');
const User = require('../models/User');

class AnalyticByKeywordsController {

    index(req, res) {
        
        res.render('analyticByKeywords/index')
    }

    search(req, res){
        
        fetch(`http://127.0.0.1:5001/api/analyticsByKeyword/${req.body.keyword}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Erro ao chamar a API:', error);
        });
    }

}

module.exports = AnalyticByKeywordsController
