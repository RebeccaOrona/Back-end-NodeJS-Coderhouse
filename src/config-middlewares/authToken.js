import jwt from 'jsonwebtoken';

export default authToken = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({error:"Not authenticated"})

    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY,(error,credentials) => {
        if(error) return res.status(403).send({error:"Not authorizated"})
        req.user = credentials.user;
        next();
    })
}