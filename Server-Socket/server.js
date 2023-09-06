const io=require('socket.io')(3030,{
    cors:{
        origin:"*"
    }
})


io.on('connection',socket=>{
    console.log(`Client ${socket.id} is connected`)

    socket.on('disconnecting',()=>{
        console.log(`Client ${socket.id} is disconnected`)
    })

    socket.on('message',(message,room)=>{
        socket.to(room).emit('Recieved',message)
    })

    socket.on('join-group',groupUID=>{
        console.log("JOINING THE GROUP",groupUID)
        socket.join(groupUID)
        
    })
    socket.on('leave-group',groupUID=>{
        console.log("Leaving the group",groupUID)
        socket.leave(groupUID)
    })
})

exports.io=io;
