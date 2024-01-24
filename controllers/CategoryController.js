const Category = require("../models/Category");
const User = require("../models/User");
const Slug = require("../services/slug");
const path = require("path");

class CategoryController {
  index(req, res) {
    Category.find().then(function (categories) {
      res.render("category/index", { categories: categories });
    });
  }

  search(req, res) {
    Category.findOne({ _id: req.params.id }).then((category) => {
      const categoryKeywords = category.keywords;
      let news = [];
      let promises = [];
      categoryKeywords.forEach(function(oneCategory){
        const promise = new Promise((resolve, reject)=>{
          try {
            fetch(`http://127.0.0.1:5001/api/analyticCategory/${oneCategory}`)
              .then((response) => response.json())
              .then((data) => {
                news.push(data)
                resolve();
              })
              .catch((error) => {
                console.error("Erro ao chamar a API:", error);
                reject(error);
              });
          } catch (error) {
            console.error("Erro durante a execução do script Python:", error);
            reject(error);
          }
        });
        promises.push(promise) 
      });
      Promise.all(promises)
        .then(() => {
          res.status(200).json({ news });
        })
        .catch((error) => {
          console.error("Erro no processamento das categorias:", error);
          res.status(500).json({ error: "Erro no processamento das categorias" });
        });   
    });
  }

  create(req, res) {
    if (req.body.name != "" && req.body.keywords != [""]) {
      Category.create({
        name: req.body.name,
        slug: Slug(req.body.name),
        keywords: req.body.keywords,
        imgPath: req.file.path,
      })
        .then((data) => {
          //res.send('cadastrado com sucesso');
          res.redirect("/categoria/");
        })
        .catch(function (erro) {
          res.send("Erro ao cadastrar" + erro);
          console.log(erro);
        });
    } else {
      res.status(400).send("Não há dados válidos para cadastrar.");
    }
  }

  delete(req, res) {
    Category.deleteOne({ _id: req.params.id })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.redirect("/categoria/");
        } else {
          res.send("Essa postagem não existe");
        }
      })
      .catch(function (erro) {
        res.send(erro);
      });
  }

  details(req, res) {
    Category.findOne({ _id: req.params.id })
      .then(function (category) {
        if (!category) {
          return res.status(404).json({ error: "Categoria não encontrada" });
        }

        Profile.find({ category_id: category._id })
          .then(function (profiles) {
            console.log({ profiles: profiles, category: category });
            res.status(200).json({ profiles: profiles, category: category });
          })
          .catch(function (error) {
            console.error("Erro ao buscar perfis:", error);
            res.status(500).json({ error: "Erro interno do servidor" });
          });
      })
      .catch(function (error) {
        console.error("Erro ao buscar categoria:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
      });
  }

  addProfile(req, res) {
    Category.findOne({ _id: req.params.id }).then(function (category) {
      let categoryID = category._id;

      if (req.body && req.body.profile && Array.isArray(req.body.profile)) {
        req.body.profile.forEach(function (oneUsername) {
          const username = oneUsername;
          try {
            fetch(`http://127.0.0.1:5001/api/verifyUsername/${username}`)
              .then((response) => response.json())
              .then((data) => {
                data = JSON.parse(data);
                Profile.create({
                  name: data.nome_usuario,
                  userIdentify: username,
                  urlImg: data.url_imagem_perfil,
                  category_id: categoryID,
                })
                  .then(function () { })
                  .catch(function (erro) {
                    res.send("Erro ao cadastrar" + erro);
                    console.log(erro);
                  });
              })
              .catch((error) => {
                console.error("Erro ao chamar a API:", error);
              });
          } catch (error) {
            console.error("Erro durante a execução do script Python:", error);
          }
        });
        res.redirect(`/categoria/details/${{ categoryID }}`);
      } else {
        console.error(
          "O corpo da requisição ou a propriedade Profile não estão definidos ou não são um array."
        );
      }
    });
  }

  deleteProfile(req, res) {
    Profile.deleteOne({ _id: req.params.id })
      .then((result) => {
        if (result.deletedCount > 0) {
          return { message: sucess };
        } else {
          res.send("Essa postagem não existe");
        }
      })
      .catch(function (erro) {
        res.send(erro);
      });
  }
}

module.exports = CategoryController;
