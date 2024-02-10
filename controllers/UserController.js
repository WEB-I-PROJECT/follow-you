const User = require('../models/User');
const bcrypt = require("bcryptjs");
const passport = require('passport');
const express = require('express');




class UserController {

    index(req, res) {
        res.render("user/index")

    }

    list(req, res) {
        User.find().sort({date:'desc'}).lean().then((user) => {
             res.render("user/list", {user: user})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar usuarios")
            res.redirect("/")
        }) 
        

    }

    listAll(req, res) {
        User.find().sort({date:'desc'}).lean().then((user) => {
            res.render("user/listAll", {user: user})
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro ao listar usuarios")
            res.redirect("/")

        }) 
        

    }

    listUsers(req, res) {
        User.find().sort({date:'desc'}).lean().then((user) => {
             res.json(user);
        }).catch((err) => {
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
//para aprovar
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
    const userId = req.params.userId;

    try {
        const user = await User.findByIdAndUpdate(userId, { approved: true });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });

        }

        return res.json({ message: "Usuário ativado com sucesso!", user });

    } catch (err) {
        console.error("Erro ao ativar usuário:", err);
        return res.status(500).json({ error: "Houve um erro ao ativar o usuário" });
    }
}

    // Método para negar um usuário
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
    const userId = req.params.userId;

    try {
        const user = await User.findByIdAndUpdate(userId, { approved: false });

        if (!user) {
            return res.status(404).json({ error: "Usuário não encontrado" });
        }

        return res.json({ message: "Usuário desativado com sucesso!", user });
    } catch (err) {
        console.error("Erro ao desativar usuário:", err);
        return res.status(500).json({ error: "Houve um erro ao desativar o usuário" });
    }
}


add(req, res) {
    try {
        const { name, email, address, cpf, phone, password } = req.body;
        const errors = [];

        // Verifica se os campos obrigatórios foram fornecidos
        if (!name || !email || !password) {
            errors.push({ texto: "Nome, e-mail e senha são obrigatórios" });
        }

        // Verifica se a senha tem pelo menos 4 caracteres
        if (password.length < 4) {
            errors.push({ texto: "A senha deve ter pelo menos 4 caracteres" });
        }

        if (errors.length > 0) {
            // Se houver erros, renderiza a página de registro com os erros
            res.render("/listar-aprovados", { errors });
        } else {
            // Verifica se já existe um usuário com o mesmo e-mail
            User.findOne({ email }).then((user) => {
                if (user) {
                    // Se já existir um usuário com o mesmo e-mail, exibe uma mensagem de erro
                    errors.push({ texto: "Já existe uma conta com este e-mail no nosso sistema" });
                    res.render("/listar-aprovados", { errors });
                } else {
                    // Se não existir um usuário com o mesmo e-mail, cria um novo usuário
                    const newUser = new User({
                        name,
                        email,
                        password,
                        cpf,
                        phone,
                        address,
                        isAdmin: true // Define o atributo isAdmin como true para indicar que é um administrador
                    });

                    // Gera o hash da senha e salva o usuário no banco de dados
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser.save().then(() => {
                                // Redireciona para a página de login após o registro
                                req.flash("success_msg", "Usuário registrado como administrador com sucesso!");
                                res.redirect("/listar-aprovados");
                            }).catch((err) => {
                                // Se ocorrer um erro ao salvar o usuário, exibe uma mensagem de erro
                                req.flash("error_msg", "Houve um erro ao criar o usuário, tente novamente!");
                                console.log(err);
                                res.render("/listar-aprovados");
                            });
                        });
                    });
                }
            }).catch((err) => {
                // Se ocorrer um erro interno, exibe uma mensagem de erro
                req.flash("error_msg", "Houve um erro interno");
                res.redirect("/listar-aprovados");
            });
        }
    } catch (error) {
        // Se ocorrer um erro interno, exibe uma mensagem de erro
        console.error(error);
        res.status(500).send('Erro interno do servidor');
    }
}


    

}

module.exports = UserController