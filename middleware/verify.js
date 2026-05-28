import jwt from 'jsonwebtoken'

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (!bearerHeader) {
        return res.status(403).json({error: 'No token'})
    }

    const token =bearerHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({error: 'Invalid token'})
        }
        req.user = decoded.user;

        next()
    })
}


export default verifyToken