
require('dotenv').config()

const express=require('express')
const cors=require('cors')
const bodyParser=require('body-parser')
const path=require('path')
const fs=require('fs')



const db=require('./database')
const userRoutes=require('./Routes/user')




app=express()




app.use(cors())
app.use(bodyParser.json({extends:false}))



app.use('/User',userRoutes)




app.use((req, res) => {
    
    res.sendFile(path.join(__dirname, `public/${req.url}`));
})

db.sync({alter:true})
.then(()=>{
    
app.listen(process.env.APP_PORT)
})
.catch(err=>console.log(err))