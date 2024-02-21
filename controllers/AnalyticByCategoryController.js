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

    async newsApi(req, res) {
        // #swagger.tags = ['Analytic']
        // #swagger.description = 'Endpoint para obter as noticías de determinado jornal.'
        // #swagger.parameters['id'] = { description: 'ID da analytic.' }

        try {
            const category = await Category.findOne({ _id: req.params.category });
            const categoryKeywords = category.keywords;
            const analytic = await Analytic.findOne({ _id: req.params.analytic });

            const promises = categoryKeywords.map(async (oneCategory) => {
                try {
                    const response = await fetch(`http://127.0.0.1:5001/api/analyticCategory/${oneCategory}/${analytic._id}`);
                    return await response.json();
                } catch (error) {
                    console.error("Erro ao chamar a API:", error);
                    return null;
                }
            });
            const json = await Promise.all(promises);
            console.log(json);
            if (json) {

                /* #swagger.responses[200] = { 
                        schema: { $ref: "#/definitions/newsCategory" },
                        description: 'Notícias do jornal específicado.' 
                } */
                return res.status(200).json({"data": json})
            }
            /* #swagger.responses[404] = { 
            schema:  {
            error: 'News not found'
            },
            description: 'Não encontrado.'  } */
        } catch (error) {
            console.error("Erro no processamento das categorias:", error);
            res.status(500).json({ error: "Erro no processamento das categorias" });
        }
    }

    async tokenize(req, res) {
        console.log(req.params.id);
        return res.render('category_group/tokenize', await tokenizeNews(req.params.id));
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
            return res.status(200).json({data});

        }
    }

    async tokensCharts(req, res) {
        console.log(req.query)
        // #swagger.tags = ['Analytic']
        // #swagger.description = 'Endpoint para obter um frequência de palavras em gráfico por grupo de palavras.'
        // #swagger.parameters['id'] = { description: 'ID do grupo de palavras.' }
        // #swagger.parameters['origin'] = { description: 'Origem das notícias.' }

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
                error: 'Analytic not found!'
                },
                description: 'Não encontrado.'  } */
            res.status(404).json({
                error: 'Analytic not found!'
            });
        }

    }
}

module.exports = AnalyticByCategoryController
