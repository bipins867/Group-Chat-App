const jwt=require('jsonwebtoken')
const User=require('../Models/User')
const UserGroup=require('../Models/UserGroup')
const Group=require('../Models/Group')


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

exports.userTypeAuthenticate=async(req,res,next)=>{
    const groupId=req.params.groupId;
    const userId=req.params.userId;
    try{
        const userGroupAdmin=await UserGroup.findOne({where:{
            UserId:req.user.id,
            GroupId:groupId,
            memberType:'admin'
        }})
        console.log(userGroupAdmin)
        if(!userGroupAdmin){
            return res.status(201).json({message:"You are not admin of the group"})
        }
        const superAdminUser=await Group.findByPk(groupId)

        if(superAdminUser.createdBy!=req.user.id){

            if(userId==superAdminUser.createdBy){
                return res.status(202).json({message:"You can't edit Super Admin User"})
            }
            
        }

        if(superAdminUser.createdBy==userId){
            return res.status(203).json({message:"You are the Super Admin you can't edit yourself"})
        }
        next();
    }
    catch(err)
    {
        console.log(err)
        res.status(403).json({error:"Something went wrong with user type"})
    }
}