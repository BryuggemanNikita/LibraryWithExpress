import jwt from 'jsonwebtoken';
import env from 'dotenv'

env.config();

export const isAuthentificated = async (req, res, next) => {

    try{
        const token = req.headers.authorization.split(' ')[1];

        if (!token) {
            return res.status(400).json({ message: 'Пользователь не авторизован' });
        }
        
        const secretWord = process.env.SECRET;
        const decodedData = jwt.verify(token, secretWord);

        req.user = decodedData;
        next();
    }catch(e){
        // console.error(e);
        res.status(400).json({message:'Пользователь не авторизован'})
    }
    
};

export const roleMiddleware = (roles) => {
    return function (req, res, next){
        isAuthentificated(req, res, () => {
            const user = req.user;
            const userRoles = user.roles;
            
            let hasRole = false;

            for(let role of roles){
                if(userRoles.includes(role)) hasRole = true;
            }

            if(!hasRole){
                return res.status(400).json({message:'У пользователя недостаточно прав'})
            }
            
            next();
        })
    }    
}

