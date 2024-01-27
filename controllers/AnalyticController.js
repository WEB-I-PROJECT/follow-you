const Analytic = require('../models/Analytic');
const Category = require('../models/Category');
const User = require('../models/User');
const KeywordGroup = require('../models/KeywordGroup');
class AnalyticController {

    index(req, res) {
        const user = res.locals.user;
    
        console.log(user);
    
        Analytic.find({ User: user._id })
            .populate('category')
            .then((analytics) => {
                analytics.forEach((analytic, i) => {
                    let data = new Date(analytic.createdAt);
                    analytics[i].createdAtFormattedDate = `${("0" + data.getDate()).slice(-2)}/${("0" + (data.getMonth() + 1)).slice(-2)}/${data.getFullYear()} ${("0" + data.getHours()).slice(-2)}:${("0" + data.getMinutes()).slice(-2)}`;
                    console.log(`${("0" + data.getDate()).slice(-2)}/${("0" + (data.getMonth() + 1)).slice(-2)}/${data.getFullYear()} ${("0" + data.getHours()).slice(-2)}:${("0" + data.getMinutes()).slice(-2)}`);
                });

                res.render('analytic/index', { analytics: analytics });
            })
            .catch((err) => {
                console.log(err);
            });

    
       /*  index(req, res) {
            const user = res.locals.user;
        
            Analytic.find({ User: user._id })
                .populate('category')  // Adicione esta linha para popular as informações da categoria
                .then((analytics) => {
                    // Adiciona a propriedade 'type' ao objeto antes de passá-lo para o render
                    res.render('analytic/index', { analytics: analytics });
                })
                .catch((err) => {
                    console.log(err);
                });
        }*/
    }

    add(req, res) {
          Category.find().then((categorys)=>{
           //console.log(categorys);
            res.render('analytic/add', {categorys: categorys});

        }).catch((err)=>{
            console.log("houve um erro ao listar categorias"+err)
        }) 
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
                        req.body.listName.length === req.body.listSlug.length &&
                        req.body.listName.length === req.body.keywords.length
                    ) {
                        req.body.listName.forEach((element, i) => {
                            if (
                                req.body.listSlug[i] !== undefined &&
                                req.body.keywords[i] !== undefined
                            ) {
                                newGroupKeyWords[i] = {
                                    listName: element,
                                    listSlug: req.body.listSlug[i],
                                    keywords: req.body.keywords[i].split(',').map(keyword => keyword.trim())
                                };
    
                                // criando promessa da criação dos grupos de palavras-chave
                                if (req.body.type === 'by-keywords') {
                                    savePromises.push(KeywordGroup.create({
                                        name: newGroupKeyWords[i].listName,
                                        slug: newGroupKeyWords[i].listSlug,
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
                        listSlug: req.body.listSlug,
                        keywords: req.body.keywords.split(',').map(keyword => keyword.trim())
                    };
    
                    console.error("Não é um array");
    
                    if (req.body.type === 'by-keywords') {
                        savePromises.push(KeywordGroup.create({
                            name: newGroupKeyWords[0].listName,
                            slug: newGroupKeyWords[0].listSlug,
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
                                console.log(newGroupKeyWords);
                            }
                        });
    
                        if (analytic.type === 'by-keywords') {
                            analytic.category = undefined;
                            console.log(analytic.type);
    
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
    
    

}

module.exports = AnalyticController
