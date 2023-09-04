const jwt=require('jsonwebtoken')
const User=require('../Models/User')


exports.authenticate=async (req,res,next)=>{
    
    try{
        const token=req.headers.authorization;
        const payload=jwt.verify(token,process.env.JWT_SECRET_KEY)
        const user=await User.findByPk(payload.id)
        
        req.user=user;
        
        next();
        
        
    }
    catch(err){
        return res.status(503).json({error:"Invalid Signature"})
    }
}