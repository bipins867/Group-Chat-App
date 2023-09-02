
const User=require('../Models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')



exports.postSignUp=async (req,res,next)=>{
    const body=req.body;
    const email=body.email;
    const password=body.password;
    const name=body.name;
    const phone=body.phone;
    obj={name:name,email:email,password:password,phone:phone}

    try{
        const user=await User.findOne({where:{email:email}})
        
        if(user){
            
            return res.status(201).json({message:"User already Exsts"})

        }
        else
        {
            bcrypt.hash(obj.password,10,async (err,passw)=>{
                if(err){
                    throw new Error("Something Went Wrong Password...")
                }
                obj.password=passw
                const result=await User.create(obj)
                
                return res.json({message:"SignUp Successfull"})
            })
        }
    }
    catch(err){
        //console.log(err)
        res.status(500).json({error:"Something went wrong"})
    }
   
}
