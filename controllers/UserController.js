const User = require('../models/User');
const bcrypt = require("bcryptjs");
const passport = require('passport');
const express = require('express');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../public/uploads/');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

class UserController {

    index(req, res) {
        res.render("user/index")

    }

    about(req, res) {
        res.render("user/about")

    }


    edit(req, res) {
        try {
            const userId = req.user.id;
            const { name, email, address, cpf, phone, password } = req.body;
            const erros = [];

            console.log(req.body);

            if (!userId) {
                erros.push({ texto: "Usuário não autenticado" });
            }

            if (!name || typeof name === undefined || name === null) {
                erros.push({ texto: "Nome inválido" });
            }
            if (!email || typeof email === undefined || email === null) {
                erros.push({ texto: "E-mail inválido" });
            }

            if (erros.length > 0) {
                res.render("user/index", { erros: erros });
            } else {
                User.findById(userId).then((user) => {
                    if (!user) {
                        res.redirect("user/index");
                    } else {
                        user.name = name;
                        user.email = email;
                        user.address = address;
                        user.cpf = cpf;
                        user.phone = phone;

                        // Verifica se um arquivo de imagem foi enviado
                        console.log("File uploaded:", req.file);

                        if (req.file) {
                            const tempPath = req.file.path; // Define o caminho temporário do arquivo
                            const targetDir = path.join(__dirname, '../public/uploads/');
                            const targetPath = path.join(targetDir, req.file.originalname); // Define o caminho onde a imagem será salva
                            fs.mkdirSync(targetDir, { recursive: true }); // Verifica se o diretório de destino existe; se não, cria o diretório
                            fs.rename(tempPath, targetPath, (err) => { // Move o arquivo temporário para o destino final
                                if (err) {
                                    console.error(err);
                                    req.flash("error_msg", "Erro ao fazer upload da imagem");
                                    return res.redirect("/");
                                }
                                user.profilePicture = '/uploads/' + req.file.originalname; // Salva o caminho da imagem no usuário
                                user.save().then(() => {
                                    req.flash("success_msg", "Usuário atualizado com sucesso!");
                                    res.redirect("/");
                                }).catch((err) => {
                                    req.flash("error_msg", "Houve um erro ao atualizar o usuário, tente novamente!");
                                    console.error(err);
                                    res.render("/");
                                });
                            });
                        } else {
                            user.save().then(() => {
                                req.flash("success_msg", "Usuário atualizado com sucesso!");
                                res.redirect("/");
                            }).catch((err) => {
                                req.flash("error_msg", "Houve um erro ao atualizar o usuário, tente novamente!");
                                console.error(err);
                                res.render("/");
                            });
                        }
                    }
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro interno");
                    console.error(err);
                    res.redirect("user/index");
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }

    list(req, res) {
        User.find().sort({ date: 'desc' }).lean().then((user) => {
            res.render("user/list", { user: user })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar usuarios")
            res.redirect("/")
        })


    }

    listAll(req, res) {
        User.find().sort({ date: 'desc' }).lean().then((user) => {
            res.render("user/listAll", { user: user })
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar usuarios")
            res.redirect("/")

        })


    }

    listUsers(req, res) {
        // #swagger.tags = ['Users']
        // #swagger.description = 'Endpoint para obter todos os usuarios.'
        User.find().sort({ date: 'desc' }).lean().then((user) => {
            /* #swagger.responses[200] = { 
              schema: { $ref: "#/definitions/UserList" },
              description: 'Lista de usuários.' 
      } */
            res.json(user);
        }).catch((err) => {
            /* #swagger.responses[500] = { 
              schema: { error: "There was an error listing users" } ,
              description: 'Erro no servidor.' 
      } */
            res.status(500).json({ error: "Houve um erro ao listar usuários" });

        })


    }
    auth(req, res, next) {
        passport.authenticate('local', {
            successRedirect: "/",
            failureRedirect: "login/",
            failureFlash: true
        })(req, res, next)

    }

    login(req, res) {
        res.render("user/login")

    }

    logout(req, res) {
        req.logout((err) => {
            if (err) {
                console.error(err);
                return res.redirect("/");
            }
            req.flash('success_msg', "Deslogado com sucesso!");
            res.redirect("/");
        });
    }


    viewRegister(req, res) {
        res.render("user/register")

    }

    register(req, res) {
        try {
            const { name, email, address, cpf, phone, password } = req.body;

            const erros = [];

            if (!name || typeof name === undefined || name === null) {
                erros.push({ texto: "Nome inválido" });
            }
            if (!email || typeof email === undefined || email === null) {
                erros.push({ texto: "E-mail inválido" });
            }
            if (!password || typeof password === undefined || password === null) {
                erros.push({ texto: "Senha inválida" });
            }
            if (!(req.body.password && req.body.password.length >= 4)) {
                erros.push({ texto: "Senha muito curta" });
            }

            if (erros.length > 0) {
                res.render("user/register", { erros: erros });
            } else {

                User.findOne({ email: req.body.email }).then((user) => {
                    if (user) {

                        res.render("user/register", { erros: [{ texto: "Já existe uma conta com este e-mail no nosso sistema" }] });
                    } else {
                        const newUser = new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: req.body.password,
                            cpf: req.body.cpf,
                            phone: req.body.phone,
                            address: req.body.address
                        });

                        bcrypt.genSalt(10, (erro, salt) => {
                            bcrypt.hash(newUser.password, salt, (erro, hash) => {
                                if (erro) {
                                    req.flash("error_msg", "Houve um erro durante o salvamento do usuário");
                                    res.render("user/register");
                                }

                                newUser.password = hash
                                newUser.save().then(() => {
                                    req.flash("success_msg", "Usuário criado com sucesso!");
                                    res.redirect("login/");
                                }).catch((err) => {
                                    req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!");
                                    console.log(req.body);

                                    res.render("user/register");
                                });
                            });
                        });
                    }
                }).catch((err) => {
                    req.flash("error_msg", "Houve um erro interno");
                    res.redirect("/");
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }

    async approveUser(req, res) {
        const userId = req.params.userId;

        try {
            const user = await User.findByIdAndUpdate(userId, { approved: true });

            if (!user) {
                req.flash("error_msg", "Usuário não encontrado");
                return res.redirect("/admin");
            }

            req.flash("success_msg", "Usuário ativado com sucesso!");
            res.redirect("/admin");
        } catch (err) {
            console.error("Erro ao aprovar usuário:", err);
            req.flash("error_msg", "Houve um erro ao aprovar o usuário");
            res.redirect("/admin");
        }
    }

    async activateUser(req, res) {
        // #swagger.tags = ['Users']
        // #swagger.description = 'Endpoint para ativar usuário.'


        const userId = req.params.userId;

        try {
            const user = await User.findByIdAndUpdate(userId, { approved: true });

            if (!user) {
                /* #swagger.responses[404] = { 
               schema:    {
                 success: "User not found!"
               },
               description: 'Usuário não encontrado.' } */
                return res.status(404).json({ error: "Usuário não encontrado" });

            }

            /* #swagger.responses[200] = { 
            schema:    {
              success: "User activate successfully!"
            },
            description: 'Usuário ativado com sucesso.' } */

            return res.json({ message: "Usuário ativado com sucesso!" });

        } catch (err) {
            /* #swagger.responses[500] = { 
               schema: { error: "There was an error activating user" } ,
               description: 'Erro no servidor.' 
       } */
            console.error("Erro ao ativar usuário:", err);
            return res.status(500).json({ error: "Houve um erro ao ativar o usuário" });
        }
    }

    async denyUser(req, res) {
        const userId = req.params.userId;

        try {
            const user = await User.findByIdAndUpdate(userId, { approved: false });

            if (!user) {
                req.flash("error_msg", "Usuário não encontrado");
                return res.redirect("/admin");
            }

            req.flash("success_msg", "Usuário desativado com sucesso!");
            res.redirect("/admin");
        } catch (err) {
            console.error("Erro ao negar usuário:", err);
            req.flash("error_msg", "Houve um erro ao desativar o usuário");
            res.redirect("/admin");
        }
    }
    async deactivateUser(req, res) {
        // #swagger.tags = ['Users']
        // #swagger.parameters['id'] = { description: 'ID do usuário.' }
        // #swagger.description = 'Endpoint para desativar usuário.'
        const userId = req.params.userId;

        try {
            const user = await User.findByIdAndUpdate(userId, { approved: false });

            if (!user) {
                /* #swagger.responses[404] = { 
            schema: { error: "User not found" },
            description: 'Usuário não encontrado.' 
    } */
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            /* #swagger.responses[200] = { 
         schema:    {
           success: "User deactivated successfully!"
         },
         description: 'Usuário desativado com sucesso.' } */

            return res.json({ message: "Usuário desativado com sucesso!", user });
        } catch (err) {
            /* #swagger.responses[500] = { 
                 schema: { error: "There was an error deactivating user" } ,
                 description: 'Erro no servidor.' 
         } */
            console.error("Erro ao desativar usuário:", err);
            return res.status(500).json({ error: "Houve um erro ao desativar o usuário" });
        }
    }


    add(req, res) {
        try {
            const { name, email, address, cpf, phone, password } = req.body;
            const errors = [];

            if (!name || !email || !password) {
                errors.push({ texto: "Nome, e-mail e senha são obrigatórios" });
            }

            if (password.length < 4) {
                errors.push({ texto: "A senha deve ter pelo menos 4 caracteres" });
            }

            if (errors.length > 0) {

                res.render("/listar-aprovados", { errors });
            } else {

                User.findOne({ email }).then((user) => {
                    if (user) {

                        errors.push({ texto: "Já existe uma conta com este e-mail no nosso sistema" });
                        res.render("/listar-aprovados", { errors });
                    } else {

                        const newUser = new User({
                            name,
                            email,
                            password,
                            cpf,
                            phone,
                            address,
                            isAdmin: true
                        });

                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if (err) throw err;
                                newUser.password = hash;
                                newUser.save().then(() => {

                                    req.flash("success_msg", "Usuário registrado como administrador com sucesso!");
                                    res.redirect("/listar-aprovados");
                                }).catch((err) => {

                                    req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!");
                                    console.log(err);
                                    res.render("/listar-aprovados");
                                });
                            });
                        });
                    }
                }).catch((err) => {

                    req.flash("error_msg", "Houve um erro interno");
                    res.redirect("/listar-aprovados");
                });
            }
        } catch (error) {

            console.error(error);
            res.status(500).send('Erro interno do servidor');
        }
    }

    async store(req, res) {
        try {
            // #swagger.tags = ['Users']
            // #swagger.description = 'Endpoint para criar usuário.'

            const { name, email, address, cpf, phone, password } = req.body;

            const errors = [];

            if (!name || typeof name === undefined || name === null) {
                errors.push({ message: "Nome inválido" });
            }
            if (!email || typeof email === undefined || email === null) {
                errors.push({ message: "E-mail inválido" });
            }
            if (!password || typeof password === undefined || password === null) {
                errors.push({ message: "Senha inválida" });
            }
            if (!(req.body.password && req.body.password.length >= 4)) {
                errors.push({ message: "Senha muito curta" });
            }

            if (errors.length > 0) {

                return res.status(400).json({ errors });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                /* #swagger.responses[400] = { 
               schema: {
                 error: 'error creating user!'
               },
               description: 'Já existe uma conta com esse e-mail.'
         } */
                return res.status(400).json({ errors: [{ message: "Já existe uma conta com este e-mail no nosso sistema" }] });
            }

            const newUser = new User({
                name,
                email,
                password,
                cpf,
                phone,
                address
            });

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newUser.password, salt);
            newUser.password = hash;

            await newUser.save();

            /* #swagger.responses[201] = { 
       schema: {
         success: 'User created successfully!'
       },
       description: 'Usuário criado com sucesso.'
 } */

            return res.status(201).json({ message: "Usuário criado com sucesso!" });
        } catch (error) {
            /* #swagger.responses[500] = { 
                 schema: { error: "error creating user" } ,
                 description: 'Erro no servidor.' 
         } */
            console.error(error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    update(req, res) {
        try {
            // #swagger.tags = ['Users']
            // #swagger.description = 'Endpoint para editar usuário.'
            // #swagger.parameters['id'] = { description: 'ID do usuário.' }

            const userId = req.user.id;
            const { name, email, address, cpf, phone, password } = req.body;
            const errors = [];

            console.log(req.body);

            if (!userId) {
                errors.push({ message: "Usuário não autenticado" });
            }

            if (!name || typeof name === undefined || name === null) {
                errors.push({ message: "Nome inválido" });
            }
            if (!email || typeof email === undefined || email === null) {
                errors.push({ message: "E-mail inválido" });
            }

            if (errors.length > 0) {
                return res.status(400).json({ errors });
            } else {
                User.findById(userId).then((user) => {
                    if (!user) {
                        /* #swagger.responses[400] = { 
                     schema: {
                     error: 'User not found!'
                         },
                         description: 'Usuario nao encontrado.'
                    } */
                        return res.status(404).json({ error: "Usuário não encontrado" });
                    } else {
                        user.name = name;
                        user.email = email;
                        user.address = address;
                        user.cpf = cpf;
                        user.phone = phone;

                        // Verifica se um arquivo de imagem foi enviado
                        console.log("File uploaded:", req.file);

                        if (req.file) {
                            const tempPath = req.file.path;
                            const targetDir = path.join(__dirname, '../public/uploads/');
                            const targetPath = path.join(targetDir, req.file.originalname);
                            fs.mkdirSync(targetDir, { recursive: true }); // Verifica se o diretório de destino existe; se não, cria o diretório
                            fs.rename(tempPath, targetPath, (err) => { // Move o arquivo temporário para o destino final
                                if (err) {
                                    console.error(err);
                                    return res.status(500).json({ error: "Erro ao fazer upload da imagem" });
                                }
                                user.profilePicture = '/uploads/' + req.file.originalname; // Salva o caminho da imagem no usuário
                                user.save().then(() => {
                                    /* #swagger.responses[201] = { 
                                       schema: {
                                           success: 'User editing successfully!'
                                       },
                                       description: 'Usuário atualizado com sucesso.'
                                   } */
                                    return res.status(200).json({ success: "Usuário atualizado com sucesso!" });
                                }).catch((err) => {
                                    /* #swagger.responses[500] = { 
                 schema: {
                 error: 'Internal Server Error!'
                     },
                     description: 'Erro interno.'
                } */
                                    console.error(err);
                                    return res.status(500).json({ error: "Houve um erro ao atualizar o usuário, tente novamente!" });
                                });
                            });
                        } else {
                            user.save().then(() => {
                                return res.status(200).json({ success: "Usuário atualizado com sucesso!" });
                            }).catch((err) => {
                                console.error(err);
                                return res.status(500).json({ error: "Houve um erro ao atualizar o usuário, tente novamente!" });
                            });
                        }
                    }
                }).catch((err) => {
                    console.error(err);
                    return res.status(500).json({ error: "Houve um erro interno" });
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }


}

module.exports = UserController