
require('dotenv').config()

const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const path=require('path')
const fs=require('fs')



const db=require('./database')
const userRoutes=require('./Routes/user')
const chatRoutes=require('./Routes/chat')


const User=require('./Models/User')
const Chat=require('./Models/Chat')




app=express()




app.use(cors({
    origin:'*',
    methods:['GET','POST']
}))
app.use(bodyParser.json({extends:false}))



app.use('/User',userRoutes)
app.use('/Chat',chatRoutes)



app.use((req, res) => {
    
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})

User.hasMany(Chat)
Chat.belongsTo(User)

db.sync()
.then(()=>{
    
app.listen(process.env.APP_PORT)
})
.catch(err=>console.log(err))