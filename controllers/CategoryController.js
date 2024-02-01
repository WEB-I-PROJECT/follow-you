const Category = require("../models/Category");
const User = require("../models/User");
const Slug = require("../services/slug");
const path = require("path");

class CategoryController {
  index(req, res) {
    Category.find().then(function (categories) {
      res.render("category/index", { categories: categories });
    }).catch((e) => {
      req.flash("error_msg", "Houve um erro ao listar categorias");
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
        imgPath: `/category/imgCategory/${req.file.filename}`,
      })
        .then((data) => {
          req.flash("success_msg", "Categoria cadastrada com sucesso.");
          res.redirect("/categoria/");
        })
        .catch(function (erro) {
          req.flash("error_msg", "Não foi possível cadastrar a categoria.");
          res.redirect("/categoria/");
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
          req.flash("success_msg", "Categoria deletada com sucesso.");
          res.redirect("/categoria/");
        } else {
          req.flash("error_msg", "categoria não encontrada.");
          res.redirect("/categoria/");
        }
      })
      .catch(function (erro) {
        req.flash("error_msg", "Houve um erro ao deletar a categoria.");
      });
  }

  edit(req, res) {
    if (req.body.name != "" && req.body.keywords != [""]) {
      Category.findOne({_id: req.body.id}).then((data) => {
          data.name = req.body.name,
          data.slug = Slug(req.body.name),
          data.keywords = req.body.keywords
          if (req.file && req.file.filename) { 
            data.imgPath = `/category/imgCategory/${req.file.filename}`
          }
          data.save().then(() => {
            req.flash("success_msg", "Categoria editada com sucesso.");
            res.redirect("/categoria/");
          }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao editar categoria.");
            res.redirect("/categoria/");
            console.log(erro);
          })
        })
        .catch(function (erro) {
          req.flash("error_msg", "Houve um erro ao editar categoria.");
          res.redirect("/categoria/");
          console.log(erro);
        });
    } else {
      req.flash("error_msg", "Houve um erro ao consultar a categoria.");
      res.redirect("/categoria/");
    }
  }

  details(req, res) {
    Category.findOne({ _id: req.params.id })
      .then(function (category) {
        res.status(200).json(category);
      })
      .catch(function (error) {
        req.flash("error_msg", "Houve um erro ao consultar a categoria.");
        res.redirect("/categoria/");
      });
  }
}

module.exports = CategoryController;
