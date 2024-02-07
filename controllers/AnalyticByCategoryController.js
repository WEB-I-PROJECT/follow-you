const Analytic = require('../models/Analytic');
const Category = require('../models/Category');

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
            const category = await Category.findOne({ _id: req.params.id });
            const categoryKeywords = category.keywords;

            const promises = categoryKeywords.map(async (oneCategory) => {
                try {
                    const response = await fetch(`http://127.0.0.1:5001/api/analyticCategory/${oneCategory}`);
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


}

module.exports = AnalyticByCategoryController
