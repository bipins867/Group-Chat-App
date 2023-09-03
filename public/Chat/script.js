

const buttonLogout=document.getElementById('button-logout')
const chatList=document.getElementById('chat-container')
const buttonSend=document.getElementById('button-send')
const inputMessage=document.getElementById('input-message')

const myMessageClass='message even'
const otherMessageClass='message odd'

const baseUrl='http://localhost:3000/'

function getTokenHeaders(){
    const token=localStorage.getItem('token')
    if(token==null)
    {
        window.location='../Login/index.html'
        
    }
    const headers={authorization:token}
    return headers
}

function addChat(chat,userMe=true){

    const div=document.createElement('div')
    
    if(userMe){
        div.className=myMessageClass
    }
    else{
        div.className=otherMessageClass
    }

    div.textContent=chat;

    chatList.appendChild(div)
    
}


buttonLogout.onclick=event=>{
    localStorage.removeItem('token')
    window.location='../Login/index.html'
}



buttonSend.onclick=async event=>{
    try{
        if(inputMessage.value=='')
        return;
        const obj={chat:inputMessage.value}
        
        const headers=getTokenHeaders()
        if(!headers)
        {
            return;
        }    
        
        const result=await axios.post(baseUrl+'Chat/postChat',obj,{headers})
        //console.log(result.data.chat)
        addChat(result.data.chat)

    }catch(err){
        if(err.response)
        {
            console.log(err.response)
        }
        else{
            console.log(err)
        }
            
    } 

    inputMessage.value=''
}

document.addEventListener('DOMContentLoaded',async event=>{
    const headers=getTokenHeaders()
    if(!headers)
    {
        return;
    } 
    const result=await axios.get(baseUrl+'Chat/getChat',{headers})
    console.log(result)
    const userId=result.data.userId;
    for(const chat of result.data.chat){
        if(chat.userId==userId){
            addChat(chat.chat)
        }
        else{
            
            const msg=chat.name+'->'+chat.chat
            addChat(msg,false)
        }
    }
})