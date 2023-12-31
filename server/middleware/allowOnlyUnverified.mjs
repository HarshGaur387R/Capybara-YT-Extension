export function allowOnlyUnverified(req, res, next) {
    try {
        if (req.session.user) { return res.redirect('/home') }
        next()
    } catch (error) {
        console.log('error from allowOnlyUnverified middleware: ', error);
        return res.redirect('/');
    }
}