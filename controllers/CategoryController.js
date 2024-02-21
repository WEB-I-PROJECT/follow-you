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

  indexApi(req, res) {
    // #swagger.tags = ['Categorias']
    // #swagger.description = 'Endpoint para obter as categorias cadastradas.'
    // #swagger.parameters['id'] = { description: 'ID da categoria/category.' }

    Category.find().then(function (categories) {
      /* #swagger.responses[200] = {
              schema: { $ref: "#/definitions/indexCategory" },
              description: 'Todas as categorias.' 
      } */
      return res.status(200).json({categories: categories});

    }).catch((e) => {
      /* #swagger.responses[404] = { 
        schema:  {
        error: 'Category not found'
      },
        description: 'Não encontrado.'  } */
      return res.status(404).json(
        {
          error: 'News not found'
        }
      ).flash("error_msg", "Houve um erro ao listar categorias");
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
    // #swagger.tags = ['Categorias']
    // #swagger.description = 'Endpoint para deletar as categorias.'
    // #swagger.parameters['id'] = { description: 'ID da categoria/category.' }

    Category.deleteOne({ _id: req.params.id })
      .then((result) => {
        if (result.deletedCount > 0) {
          /* #swagger.responses[200] = {
              schema: { $ref: "#/definitions/deleteCategory" },
              description: 'deletar categoria específicada.' 
          } */
          res.status(200).json({"success_msg": "Categoria deletada com sucesso." });
        } else {
          req.flash("error_msg", "categoria não encontrada.");
          res.redirect("/categoria/");
        }
      })
      .catch(function (erro) {
        /* #swagger.responses[404] = {
          schema:  {
          error: 'category not found'
        },
          description: 'Não encontrado.'  } */
        res.status(500).json({ error: "Houve um erro ao deletar a categoria." . erro });
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
    // #swagger.tags = ['Categorias']
    // #swagger.description = 'Endpoint para consultar as categorias.'
    // #swagger.parameters['id'] = { description: 'ID da categoria/category.' }

    Category.findOne({ _id: req.params.id })
      .then(function (category) {
        /* #swagger.responses[200] = {
            schema: { $ref: "#/definitions/detailsCategory" },
            description: 'Categoria específicada.' 
        } */
        res.status(200).json(category);
      })
      .catch(function (error) {
        /* #swagger.responses[404] = {
          schema:  {
          error: 'category not found'
        },
          description: 'Não encontrado.'  } */
        res.status(500).json({ "error_msg": "Houve um erro ao consultar a categoria." });
      });
  }
}

module.exports = CategoryController;
