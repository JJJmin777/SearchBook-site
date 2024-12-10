

export const storeReturnTo = (req, res, next) => {
    if (req.session.returnto) {
        res.locals.returnto = req.session.returnTo;
    }
    next();
}