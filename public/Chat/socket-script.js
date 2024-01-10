const socketUrl='http://localhost:3030'

const socket=io(socketUrl)

socket.on('connect',()=>{
    console.log(`Connect to Server - ${socketUrl}`)
    
})
socket.on('disconnect',()=>{
    console.log(`Disconnected from the Server - ${socketUrl}`)
})

socket.on('Recieved',(message,groupUID,userId,userName)=>{
    const localUserId=localStorage.getItem('userId')
    //console.log(localUserId,userId)
    if(chatList.children.length>=10 ){
        chatList.removeChild(chatList.children[0])
    }
    if(localUserId==userId){
        addChat(message)
    }
    else{
        const nmessage=userName+'->'+message
        addChat(nmessage,false)
    }
    //console.log(`Message recieved from ${groupUID} and message - ${message}`)
})

socket.on('RecievedFile',(message,groupUID,userId,userName)=>{
    const localUserId=localStorage.getItem('userId')
    //console.log(localUserId,userId)
    if(chatList.children.length>=10 ){
        chatList.removeChild(chatList.children[0])
    }
    if(localUserId==userId){
        addChat(message,true,true)
    }
    else{
        
        addChat(message,false,true,userName)
    }
    //console.log(`Message recieved from ${groupUID} and message - ${message}`)
})