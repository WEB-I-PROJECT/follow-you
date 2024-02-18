const Analytic = require('../models/Analytic');
const Category = require('../models/Category');
const tokenizeNews = require('../services/news');
const News = require('../models/News');

class AnalyticByCategoryController {

    async index(req, res) {
        try {
            Analytic.findOne({ _id: req.params.id })
                .then(data => {
                    const analytic = data;
                    if (!analytic) {
                        res.send('Analytic não encontrada');
                    } else {
                        Category.findOne({ _id: analytic.category }).
                            then(data => {
                                if (!data) {
                                    res.render('category_group/index', { analytic: analytic });
                                } else {
                                    const category = data;
                                    res.render('category_group/index', { analytic: analytic, category: category });
                                }
                            })
                    }
                });
        } catch (error) {
            res.status(500).send('Internal Server Error')
        }
    }

    async news(req, res) {
        try {
            const category = await Category.findOne({ _id: req.params.category });
            const categoryKeywords = category.keywords;
            const analytic = await Analytic.findOne({_id: req.params.analytic});

            const promises = categoryKeywords.map(async (oneCategory) => {
                try {
                    const response = await fetch(`http://127.0.0.1:5001/api/analyticCategory/${oneCategory}/${analytic._id}`);
                    return await response.json();
                } catch (error) {
                    console.error("Erro ao chamar a API:", error);
                    return null;
                }
            });

            const news = await Promise.all(promises);
            res.render('category_group/news', { news: news });
            //res.status(200).json({ news });
        } catch (error) {
            console.error("Erro no processamento das categorias:", error);
            res.status(500).json({ error: "Erro no processamento das categorias" });
        }
    }

    async tokenize(req, res) {
        console.log(req.params.id);
        return res.render('category_group/tokenize', await tokenizeNews(req.params.id));
    }

    async tokensCharts(req, res) {
        console.log(req.query)
        try {
            const group = await Analytic.findOne({ _id: req.query.id })
            const news = await News.find({analytic: group._id});
            
            News.aggregate([
                {
                    $match: {
                        analytic: group._id, // Filtro para documentos com analytic específico
                        origin: { $in: req.query.origin.split(',') },
                        $or: [
                            { content: { $regex: '.*' + req.query.keyword + '.*' } },
                            { title: { $regex: '.*' + req.query.keyword + '.*' } }
                        ],
                    }
                },
                {
                    $addFields: { // Adiciona um novo campo com o valor convertido para data
                        date: { $toDate: "$date" }
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

        catch (e) {
            console.log(e)
            res.status(404).json({
                error: 'KeywordGroup not found!'
            });
        }

    }
}

module.exports = AnalyticByCategoryController
