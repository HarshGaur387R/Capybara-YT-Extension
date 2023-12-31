export function allowOnlyVerifiedUsers(req, res, next){
    try {
        if(!req.session) return res.redirect('/');
        if(!req.session.user) return res.redirect('/');
        if(!req.session.user.isEmailVerified) return res.redirect('/signup');
        next();

    } catch (error) {
        return res.redirect('/');
    }
}