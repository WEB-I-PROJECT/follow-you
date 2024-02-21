const Analytic = require('../models/Analytic');
const Category = require('../models/Category');
const User = require('../models/User');
const KeywordGroup = require('../models/KeywordGroup');

class AnalyticController {

    index(req, res) {
        const user = res.locals.user;

        Analytic.find({ User: user._id })
            .populate('category')
            .then((analytics) => {
                analytics.forEach((analytic, i) => {
                    let data = new Date(analytic.createdAt);
                    analytics[i].createdAtFormattedDate = `${("0" + data.getDate()).slice(-2)}/${("0" + (data.getMonth() + 1)).slice(-2)}/${data.getFullYear()} ${("0" + data.getHours()).slice(-2)}:${("0" + data.getMinutes()).slice(-2)}`;

                    console.log(`${("0" + data.getDate()).slice(-2)}/${("0" + (data.getMonth() + 1)).slice(-2)}/${data.getFullYear()} ${("0" + data.getHours()).slice(-2)}:${("0" + data.getMinutes()).slice(-2)}`);
                });

                res.render('analytic/index', { analytics: analytics, canAddMore: analytics.length >= 3 ? false : true });
            })
            .catch((err) => {
                console.log(err);
            });

    }

    async indexApi(req, res) {
        // #swagger.tags = ['Analytic']
        // #swagger.description = 'Endpoint para obter analytics vinculado a um usuário.'
        // #swagger.parameters['id'] = { description: 'ID do usuário.' }
        try {
            const userId = req.params.userId; // Assumindo que o ID do usuário é passado como parâmetro na URL
            console.log(userId)

            const analytics = await Analytic.find({});
            const analyticsList = analytics.map(analytic => analytic.toObject());

            console.log(analytics)

            /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/AnalyticUser" },
               description: 'Analytics vinculados a um usuário' 
            } */
            res.status(200).json({ analytics: analytics });
        } catch (err) {
            /* #swagger.responses[500] = { 
     schema: {
       error: 'Internal Server Error'
     },
     description: 'Analytic não encontrado.'  } */
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }




    add(req, res) {
        Category.find().then((categorys) => {
            //console.log(categorys);
            res.render('analytic/add', { categorys: categorys });

        }).catch((err) => {
            console.log("houve um erro ao listar categorias" + err)
        })
    }

    addApi(req, res) {
        Category.find().then((categorys) => {
            //console.log(categorys);
            res.status(200).json({ categorys: categorys });
        })
            .catch((err) => {
                console.log("Houve um erro ao listar categorias: " + err);
                res.status(500).json({ error: 'Internal Server Error' });
            });
    }

    saveAnalytic(req, res) {
        const user = res.locals.user;
        let newGroupKeyWords = [];

        Analytic.countDocuments({ User: user._id })
            .then(count => {
                if (count >= 3) {
                    console.error("usuário já excedeu o total de analytics");
                    req.flash('error_msg', 'Você já possui 3 Analytics!');
                    return res.redirect('/analytic/');
                }

                let savePromises = [];
                // buscando os grupos de palavras-chave
                if (Array.isArray(req.body.listName)) {
                    if (
                        req.body.listName.length === req.body.keywords.length
                    ) {
                        req.body.listName.forEach((element, i) => {
                            if (
                                req.body.keywords[i] !== undefined
                            ) {
                                newGroupKeyWords[i] = {
                                    listName: element,
                                    keywords: req.body.keywords[i].split(',').map(keyword => keyword.trim())
                                };

                                // criando promessa da criação dos grupos de palavras-chave
                                if (req.body.type === 'by-keywords') {
                                    savePromises.push(KeywordGroup.create({
                                        name: newGroupKeyWords[i].listName,
                                        keywords: newGroupKeyWords[i].keywords,
                                        analytic: undefined, // atualizar posteriormente
                                    }));
                                }
                            } else {
                                console.error(`Índice ${i} fora do intervalo`);
                            }
                        });
                    } else {
                        console.error("As arrays não têm o mesmo comprimento");
                    }
                } else {
                    // Save only one group of keywords
                    newGroupKeyWords[0] = {
                        listName: req.body.listName,
                        keywords: req.body.keywords.split(',').map(keyword => keyword.trim())
                    };

                    console.error("Não é um array");

                    if (req.body.type === 'by-keywords') {
                        savePromises.push(KeywordGroup.create({
                            name: newGroupKeyWords[0].listName,
                            keywords: newGroupKeyWords[0].keywords,
                            analytic: undefined, // atualizar posteriormente
                        }));
                    }
                }

                const analytic = new Analytic({
                    name: req.body.name,
                    type: req.body.type,
                    category: req.body.category,
                    User: user._id,
                });

                Promise.all(savePromises)
                    .then(savedKeywordGroups => {

                        savedKeywordGroups.forEach((savedKeywordGroup, index) => {
                            if (req.body.type === 'by-keywords') {
                                newGroupKeyWords[index].analytic = savedKeywordGroup._id;
                            }
                        });

                        if (analytic.type === 'by-keywords') {
                            analytic.category = undefined;

                            analytic.save()
                                .then(savedAnalytic => {
                                    // atualizando id do analytic em KeywordGroup 
                                    return KeywordGroup.updateMany(
                                        { _id: { $in: newGroupKeyWords.map(group => group.analytic) } },
                                        { analytic: savedAnalytic._id }
                                    
                                    );
                                            

                                })
                                .then(() => {

                                    res.redirect('/analytic/');
                                })
                                .catch(error => {
                                    res.status(500).send(error.message);
                                });
                        } else {
                            analytic.save()
                                .then(savedAnalytic => {
                                    res.redirect('/analytic/');
                                })
                                .catch(error => {
                                    res.status(500).send(error.message);
                                });
                        }
                    })
                    .catch(error => {
                        res.status(500).send(error.message);
                    });
            })
            .catch(error => {
                res.status(500).send(error.message);
            });
    }

    async saveAnalyticApi(req, res) {
        try {
            // #swagger.tags = ['Analytic']
            // #swagger.description = 'Endpoint para criar Analytic.'
             /*  #swagger.parameters['body'] = {
            in: 'body',
            description: 'Add new Analytic.',
            schema: { $ref: '#/definitions/AddAnaly' }
    } */
            

            const user = res.locals.user;
            let newGroupKeyWords = [];

            // Verificar se o usuário já excedeu o limite de Analytics
            const count = await Analytic.countDocuments({ User: user._id });
            if (count >= 3) {
                console.error("usuário já excedeu o total de analytics");
                return res.status(403).json({ error: 'Você já possui 3 Analytics!' });
            }

            let savePromises = [];

            // Construir dados para os grupos de palavras-chave
            if (Array.isArray(req.body.listName)) {
                if (req.body.listName.length === req.body.keywords.length) {
                    req.body.listName.forEach((element, i) => {
                        if (req.body.keywords[i] !== undefined) {
                            newGroupKeyWords[i] = {
                                listName: element,
                                keywords: req.body.keywords[i].split(',').map(keyword => keyword.trim())
                            };

                            // Criar promessa para salvar os grupos de palavras-chave
                            if (req.body.type === 'by-keywords') {
                                savePromises.push(KeywordGroup.create({
                                    name: newGroupKeyWords[i].listName,
                                    keywords: newGroupKeyWords[i].keywords,
                                    analytic: undefined // Atualizar posteriormente
                                }));
                            }
                        } else {
                            console.error(`Índice ${i} fora do intervalo`);
                        }
                    });
                } else {
                    console.error("As arrays não têm o mesmo comprimento");
                }
            } else {
                // Salvar apenas um grupo de palavras-chave
                newGroupKeyWords[0] = {
                    listName: req.body.listName,
                    keywords: req.body.keywords.split(',').map(keyword => keyword.trim())
                };

                if (req.body.type === 'by-keywords') {
                    savePromises.push(KeywordGroup.create({
                        name: newGroupKeyWords[0].listName,
                        keywords: newGroupKeyWords[0].keywords,
                        analytic: undefined // Atualizar posteriormente
                    }));
                }
            }

            // Criar um objeto Analytic
            const analytic = new Analytic({
                name: req.body.name,
                type: req.body.type,
                category: req.body.category,
                User: user._id
            });

            // Aguardar a resolução de todas as promessas de salvamento dos grupos de palavras-chave
            const savedKeywordGroups = await Promise.all(savePromises);

            // Atualizar os IDs dos Analytic associados aos grupos de palavras-chave
            savedKeywordGroups.forEach((savedKeywordGroup, index) => {
                if (req.body.type === 'by-keywords') {
                    newGroupKeyWords[index].analytic = savedKeywordGroup._id;
                }
            });

            // Salvar o Analytic e atualizar os IDs dos grupos de palavras-chave, se necessário
            if (analytic.type === 'by-keywords') {
                analytic.category = undefined;

                const savedAnalytic = await analytic.save();
                await KeywordGroup.updateMany(
                    { _id: { $in: newGroupKeyWords.map(group => group.analytic) } },
                    { analytic: savedAnalytic._id }
                );

                return res.status(201).json(savedAnalytic);
            } else {

                /* #swagger.responses[201] = { 
              schema: { $ref: "#/definitions/SaveAnalytic" },
              description: 'Analytic criado com sucesso.' 
               } */
                const savedAnalytic = await analytic.save();
                return res.status(201).json(savedAnalytic);
            }
        } catch (error) {
            console.error(error);
            /* #swagger.responses[500] = { 
            schema: {
           error: 'Internal Server Error'
      },
      description: 'Erro ao slavar o Analytic.'  } */
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }




    async remove(req, res) {
        const analytic = await Analytic.deleteOne({
            _id: req.params.id
        });
        if (analytic) {
            return res.redirect('/analytic');
        }

        return res.status(404).json({
            error: 'Analytic not found'
        })
    }

    async removeApi(req, res) {
        // #swagger.tags = ['Analytic']
        // #swagger.description = 'Endpoint para deletar uma analytic.'
        // #swagger.parameters['id'] = { description: 'ID da analytic.' }
        const analytic = await Analytic.deleteOne({
            _id: req.params.id
        });
        if (analytic) {

            /* #swagger.responses[200] = { 
                    schema: {
                success: 'Analytic deleted with success'
            },
                    description: 'Mensagem de sucesso ao deletar.' 
            } */
            return res.status(200).json({
                success: 'Analytic deleted with success'
            })
        }

        /* #swagger.responses[404] = { 
                   schema: {
                        error: 'Analytic not found'
                    },
                   description: 'Não encontrado.' 
           } */
        return res.status(404).json({
            error: 'Analytic not found'
        })
    }

}

module.exports = AnalyticController
