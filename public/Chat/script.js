

const buttonLogout=document.getElementById('button-logout')
const chatList=document.getElementById('chat-container')
const buttonSend=document.getElementById('button-send')
const inputMessage=document.getElementById('input-message')

const myMessageClass='message even'
const otherMessageClass='message odd'

const baseUrl='http://localhost:3000/'
const OBJ={firstTime:false}



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

function deleteAllChats(){
    while(chatList.firstChild){
        chatList.removeChild(chatList.firstChild)
    }
}

function fetchLocalChats(){
    let data=localStorage.getItem('localChats')

    if(!data){
        data=[]
    }
    else{
        data=JSON.parse(data)
    }
    return data;
}

function saveChat2Local(chats){
    const localChat=fetchLocalChats()
    var x=[localChat,chats]
    
    x=x.flat();
    x=x.splice(x.length-10)

    localStorage.setItem('localChats',JSON.stringify(x))
    const lastChatIndex=x[x.length-1].id
    localStorage.setItem('lastChatId',lastChatIndex)

}

async function onPageRefress(){
    //deleteAllChats();
    const headers=getTokenHeaders()
    if(!headers)
    {
        return;
    } 
    let lastChatIndex=localStorage.getItem('lastChatId')
    if(!lastChatIndex){
        lastChatIndex=-1
    }
    const result=await axios.get(baseUrl+`Chat/getChat?lastChatId=${lastChatIndex}`,{headers})
    
    if(result.length==0){
        return;
    }
    const chatListData=result.data.chat;
    const userId=result.data.userId;

    if(!OBJ.firstTime){
        showChatFromLocal(userId)
        OBJ.firstTime=true;
    }
    
    saveChat2Local(chatListData)
    
    for(const chat of chatListData){
        if(chatList.children.length>=10 ){
            chatList.removeChild(chatList.children[0])
        }
        if(chat.userId==userId){
            addChat(chat.chat)
        }
        else{
            
            const msg=chat.name+'->'+chat.chat
            addChat(msg,false)
        }
    }
}
async function showChatFromLocal(userId){
    const chats=fetchLocalChats();
    for(const chat of chats){
        if(chat.userId==userId){
            addChat(chat.chat)
        }
        else{
            
            const msg=chat.name+'->'+chat.chat
            addChat(msg,false)
        } 
    }
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
        //addChat(result.data.chat)

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
   
    async function myFunction(){

        onPageRefress();

        setTimeout(myFunction,1000)


    }

    myFunction();
    
})
