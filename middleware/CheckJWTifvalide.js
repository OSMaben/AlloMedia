const jwt = require('jsonwebtoken');


const IsTokenValid = async (req, res, next) => {
     try
     {
        const token = req.params.token;
         console.log(token);

         if(!token){
             console.log("Token Not Found");
             return res.status(401).json({msg:"Middel: Token Not Found"});
         }

         const Encoded  = jwt.verify(token, process.env.JWT_SECRET);
         console.log("Is this match ==> " ,Encoded);

         req.user = Encoded;
         next();

     }catch (err)
     {
         console.error('JWT validation error:', err);
         return res.status(401).json({ msg: 'Token is invalid or expired' });
     }

}


module.exports = {
    IsTokenValid
}

