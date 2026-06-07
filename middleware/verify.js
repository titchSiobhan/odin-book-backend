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

function optionalVerifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    // No token → treat as logged out
    if (!bearerHeader) {
        req.user = null;
        return next();
    }

    const token = bearerHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            // Invalid token → still treat as logged out
            req.user = null;
            return next();
        }

        req.user = decoded.user; // because your token stores { user: {...} }
        next();
    });
}



export {
     verifyToken, optionalVerifyToken
}