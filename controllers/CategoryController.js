const Category = require('../models/Category');
const User = require('../models/User');
const Slug = require('../services/slug');

class CategoryController {

    index(req, res) {
        Category.find().then(function(categories){
            res.render('category/index', {categories:categories});
        })
    }

    create(req, res){
        Category.create({
            name: req.body.name,
            slug: Slug(req.body.name)
        }).then((category)=>{
            let categoryID = category._id;
            if (req.body && req.body.profile && Array.isArray(req.body.profile)) {
                req.body.profile.forEach(function(oneUsername) {
                    const username = oneUsername
                    try{
                        fetch(`http://127.0.0.1:5001/api/verifyUsername/${username}`)
                        .then(response => response.json())
                            .then(data => {
                                data = JSON.parse(data);
                                console.log(data);
                                Profile.create({
                                    name: data.nome_usuario,
                                    userIdentify: username,
                                    urlImg: data.url_imagem_perfil,
                                    category_id: categoryID,

                                }).catch(function(erro){
                                    res.send('Erro ao cadastrar' + erro);
                                    console.log(erro)
                                })
                            })
                        .catch(error => {
                            console.error('Erro ao chamar a API:', error);
                        });
                    }catch (error) {
                        console.error('Erro durante a execução do script Python:', error);
                    }  
                });
                res.redirect('/categoria/');
            } else {
                console.error('O corpo da requisição ou a propriedade Profile não estão definidos ou não são um array.');
            }
        }).catch(function(erro){
            res.send('Erro ao cadastrar' + erro);
            console.log(erro)
        })
        
    }

    delete(req, res){
        Category.deleteOne({_id: req.params.id }).then(result => {
            if (result.deletedCount > 0) {
                res.redirect('/categoria/');
            } else {
                res.send("Essa postagem não existe");
            }
        }).catch(function(erro){
            res.send(erro);
        });
    }


    details(req, res) {
        Category.findOne({ _id: req.params.id })
        .then(function (category) {
            if (!category) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            Profile.find({ category_id: category._id })
                .then(function (profiles) {
                    console.log({ profiles: profiles, category: category });
                    res.status(200).json({ profiles: profiles, category: category });
                })
                .catch(function (error) {
                    console.error('Erro ao buscar perfis:', error);
                    res.status(500).json({ error: 'Erro interno do servidor' });
                });
        })
        .catch(function (error) {
            console.error('Erro ao buscar categoria:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        });
    }
    

    addProfile(req, res){

        Category.findOne({_id: req.params.id}).then(function(category){
            let categoryID = category._id;

            if (req.body && req.body.profile && Array.isArray(req.body.profile)) {

                req.body.profile.forEach(function(oneUsername) {
                    const username = oneUsername
                    try{
                        fetch(`http://127.0.0.1:5001/api/verifyUsername/${username}`)
                        .then(response => response.json())
                            .then(data => {
                                data = JSON.parse(data);
                                Profile.create({
                                    name: data.nome_usuario,
                                    userIdentify: username,
                                    urlImg: data.url_imagem_perfil,
                                    category_id: categoryID,
                                }).then(function(){
                                    
                                }).catch(function(erro){
                                    res.send('Erro ao cadastrar' + erro);
                                    console.log(erro)
                                })
                            })
                        .catch(error => {
                            console.error('Erro ao chamar a API:', error);
                        });
                    }catch (error) {
                        console.error('Erro durante a execução do script Python:', error);
                    }  
                });
                res.redirect(`/categoria/details/${{categoryID}}`);
            } else {
                console.error('O corpo da requisição ou a propriedade Profile não estão definidos ou não são um array.');
            }
        });
    }

    deleteProfile(req, res){
        console.log(req.params.id);
        Profile.deleteOne({_id: req.params.id }).then(result => {
            if (result.deletedCount > 0) {
                return {message: sucess}
            } else {
                res.send("Essa postagem não existe");
            }
        }).catch(function(erro){
            res.send(erro);
        });
    }

}

module.exports = CategoryController
