import JWT from 'jsonwebtoken';
import LoginLog from '../models/login_log.js';
import User from '../models/user.js';
import reply from '../helper/reply.js';

const PUBLIC_KEY =  process.env.JWT_SECRET;

export default {
    userAuthenticate: async (req, res, next) => {

        // Is Token
        var token = req.header('Authorization')?.split(' ')[1];
        
        if (token == null) return unAuthError(res); 

        // Verify Token 
        const result = JWT.verify(token, PUBLIC_KEY, function (err, user) { 
            if (err)return 0; 

            return user;
        });
    
        if (result == 0)  return unAuthError(res);
        console.log({result})
 
        // Check Token In Database After Verify
        let is_token = await LoginLog.findOne({where:{token: token, user_id: result.data.user_id}});
        
        if (is_token == null)  return unAuthError(res); 
        let user = await User.findByPk(is_token.user_id);

        if (user == null) return unAuthError(res);
         
        req.user = user;
        next();
    },
    adminAuthenticate: async (req, res, next) => {

        // Is Token
        var token = req.header('Authorization')?.split(' ')[1];
        
        if (token == null) return unAuthError(res); 

        // Verify Token 
        const result = JWT.verify(token, PUBLIC_KEY, function (err, user) { 
            if (err)return 0; 

            return user;
        });
    
        if (result == 0)  return unAuthError(res);
        console.log({result})
 
        // Check Token In Database After Verify
        let is_token = await LoginLog.findOne({where:{token: token, user_id: result.data.user_id}});
        
        if (is_token == null)  return unAuthError(res); 
        let user = await User.findByPk(is_token.user_id);

        if (user == null) return unAuthError(res);
        console.log({user});
        if(user.role!="admin") return unAuthError(res);
         
        req.user = user;
        next();
    }
    
}
function unAuthError(res){
    return res.status(401).json(reply.unauth());
}

