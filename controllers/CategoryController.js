const Category = require('../models/Category');
const Profile = require('../models/Profile');
const User = require('../models/User');
const Slug = require('../services/slug');
const { spawnSync } = require('child_process');


class CategoryController {

    index(req, res) {
        Category.find().then(function(categories){
            res.render('category/index', {categories:categories});
        })
    }

    add(req, res){

        res.render('category/add');
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
                        const path = require('path');
                        const scriptPath = path.join(__dirname, '..', 'crawlers', 'analytics', 'analytic.py');
                        const resultVerifyUsername = spawnSync('python', [scriptPath, username]);
                        const stdOutput = resultVerifyUsername.stdout.toString();
                        
                        if (stdOutput.trim() !== ''){
                            const data = JSON.parse(stdOutput)
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
                        }
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
        console.log(req.params.id)
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

}

module.exports = CategoryController
