
require('dotenv').config()

const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const path=require('path')
const fs=require('fs')



const db=require('./database')
const userRoutes=require('./Routes/user')
const chatRoutes=require('./Routes/chat')
const groupRoutes=require('./Routes/group')


const User=require('./Models/User')
const Chat=require('./Models/Chat')
const GroupMessage=require('./Models/GroupMessage')
const UserGroup=require('./Models/UserGroup')
const Group=require('./Models/Group')


const socketServer=require('./Server-Socket/server')







app=express()




app.use(cors({
    origin:'*',
    methods:['GET','POST']
}))
app.use(bodyParser.json({extends:false}))



app.use('/User',userRoutes)
app.use('/Chat',chatRoutes)
app.use('/Group',groupRoutes)


app.use((req, res) => {
    
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})

User.hasMany(Chat)
Chat.belongsTo(User)


User.belongsToMany(Group,{through:UserGroup})
Group.belongsToMany(User,{through:UserGroup})

Group.hasMany(GroupMessage)
GroupMessage.belongsTo(Group)


db.sync()
.then(()=>{
    
app.listen(process.env.APP_PORT)
})
.catch(err=>console.log(err))