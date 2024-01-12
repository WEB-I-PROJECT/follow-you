const User = require('../models/User');

class UserController {

    index(req, res) {
        res.render("user/index")

    }
    login(req, res) {
        res.render("user/login")

    }

    register(req, res) {
        res.render("user/register")

    }

}

module.exports = UserController
