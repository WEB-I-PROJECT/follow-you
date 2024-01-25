module.exports = {
    loggedUser: function(req, res, next) {
        if(req.isAuthenticated() && req.user.approved){
            return next();
        }

        if (req.isAuthenticated() && !req.user.approved) {
            req.flash('error_msg', 'Sua conta ainda não foi aprovada pelo administrador. Aguarde a aprovação.');
            return res.redirect('/login');
        }

        req.flash("error_msg", "Você precisa ser um usuário!" )
        res.redirect("/")
    }
}
