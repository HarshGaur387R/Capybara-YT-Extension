export function checkPermission(permissionProperty) {

    return (req, res,next) => {

        try {
            if (req.session.permission) { return res.redirect('/home') }

            if (req.session[permissionProperty] === true) {
                return next();
            }
            return res.redirect('/home');

        } catch (error) {
            console.error('error from checkPermission middleware: ', error);
            return res.redirect('/');
        }
    }
}