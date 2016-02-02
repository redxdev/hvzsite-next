module.exports = function (req, res, next) {
    if (!AuthService.hasPermission(req.user, 'superadmin')) {
        return req.forbidden("You do not have permission to access this page.");
    }

    next();
}
