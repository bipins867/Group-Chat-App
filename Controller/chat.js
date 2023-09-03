


exports.postAddChat=async(req,res,next)=>{
    const chat=req.body.chat;
    try{
        const result=await req.user.createChat({chat:chat})

        res.json(result)
    }
    catch(err){
        console.log(err)
        res.status(404).json({error:"Something went wrong"})
    }
    
}

exports.getChats=async(req,res,next)=>{

}