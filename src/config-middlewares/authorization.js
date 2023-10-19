export const authorization = (allowedRoles) => {
    return async(req,res,next) => {
        const userRole = req.user.user.role;

        if (allowedRoles.includes(userRole)) {
        next();
        } else {
        res.status(403).send({ status: "error", message: "Unauthorized" });
        }
    };    
}