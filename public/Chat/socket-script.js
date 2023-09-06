const socketUrl='http://13.50.8.165:3030'

const socket=io(socketUrl)

socket.on('connect',()=>{
    console.log(`Connect to Server - ${socketUrl}`)
    
})
socket.on('disconnect',()=>{
    console.log(`Disconnected from the Server - ${socketUrl}`)
})

socket.on('Recieved',(message,groupUID,userId)=>{
    const localUserId=localStorage.getItem('userId')
    //console.log(localUserId,userId)
    if(chatList.children.length>=10 ){
        chatList.removeChild(chatList.children[0])
    }
    if(localUserId==userId){
        addChat(message)
    }
    else{
        addChat(message,false)
    }
    //console.log(`Message recieved from ${groupUID} and message - ${message}`)
})