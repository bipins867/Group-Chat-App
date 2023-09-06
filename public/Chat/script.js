

const buttonLogout=document.getElementById('button-logout')
const chatList=document.getElementById('chat-container')
const buttonSend=document.getElementById('button-send')
const inputMessage=document.getElementById('input-message')


const groupLists=document.getElementById('list-group')
const inputLink=document.getElementById('inputLink')
const buttonCopyLink=document.getElementById('button-copy-link')
const buttonGlobalChat=document.getElementById('button-global-chat')
const buttonCreateGroup=document.getElementById('button-create-group')
const buttonJoinGroup=document.getElementById('button-join-group')
const labelGroupName=document.getElementById('label-group-name')
const labelStatus=document.getElementById('label-status')
const buttonEditGroup=document.getElementById('button-edit-group')
const inputSelectFile=document.getElementById('fileInput')
const buttonSendFile=document.getElementById('button-send-file')
const labelFileStatus=document.getElementById('file-label-status')

const myMessageClass='message even'
const otherMessageClass='message odd'

const baseUrl='http://13.50.8.165:3000/'
const OBJ={firstTime:false,id2Get:-1}



function getTokenHeaders(){
    const token=localStorage.getItem('token')
    if(token==null)
    {
        window.location='../Login/index.html'
        
    }
    const headers={authorization:token}
    return headers
}

function addChat(chat,userMe=true,isLink=false,sender){

    const div=document.createElement('div')
    
    if(userMe){
        div.className=myMessageClass
    }
    else{
        div.className=otherMessageClass
    }
    if(isLink){
        if(userMe){
            div.innerHTML=`<a href="${chat}">${chat}</a>`
        }
        else{
            div.innerHTML=`${sender}-><a href="${chat}">${chat}</a>`
        }   
    }
    else{
        div.textContent=chat;
    }
    

    chatList.appendChild(div)
    
}

function deleteAllChats(){
    while(chatList.firstChild){
        chatList.removeChild(chatList.firstChild)
    }
}

function fetchLocalChats(){
    let data=localStorage.getItem('localChats')
    //console.log("ShowingDAta",data)
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

async function onPageRefress(groupUID){
    //deleteAllChats();
    socket.emit('leave-group',localStorage.getItem('prevGroupId'))
    const headers=getTokenHeaders()

    if(!headers)
    {
        return;
    } 
    let lastChatIndex=localStorage.getItem('lastChatId')
    if(!lastChatIndex){
        lastChatIndex=-1
    }
    let result;
    if(OBJ.id2Get==-1){
        
        result=await axios.get(baseUrl+`Chat/getChat?lastChatId=${lastChatIndex}`,{headers})
    
    }
    else{
        result=await axios.get(baseUrl+`Group/getChat/${OBJ.id2Get}?lastChatId=${lastChatIndex}`,{headers})
    
    }
    //console.log(result)
    socket.emit('join-group',groupUID)
    localStorage.setItem('prevGroupId',groupUID)
    if(result.data.chat.length==0){
        
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
            if(chat.isFile)
            {
                addChat(chat.chat,true,true)
            }
            else{
                addChat(chat.chat,true)
            }
            
        }
        else{
            if(chat.isFile){
                addChat(chat.chat,true,true,userName)

            }
            else{
                const msg=chat.userName+'->'+chat.chat
                addChat(msg,false)
            }
            
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
            
            const msg=chat.userName+'->'+chat.chat
            addChat(msg,false)
        } 
    }
}


buttonLogout.onclick=event=>{
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    window.location='../Login/index.html'
}


buttonCopyLink.onclick=async event=>{
    try{
        inputLink.select()
        const successful = document.execCommand('copy');
        
        if (successful) {
            console.log('Text copied to clipboard');
        } else {
            console.error('Unable to copy text to clipboard');
        }
    }
    catch(err){
        console.log(err)
    }
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
        
        if(OBJ.id2Get==-1){
            const result=await axios.post(baseUrl+'Chat/postChat',obj,{headers})
        }
        else{
            const result=await axios.post(baseUrl+`Group/postChat/${OBJ.id2Get}`,obj,{headers})
        }
        
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
inputSelectFile.onchange=event=>{
    if(inputSelectFile.value===''){
        labelFileStatus.style.display='none'
        return;
    }
    labelFileStatus.style.display='block'
    labelFileStatus.textContent='File is selected'
    
}

buttonSendFile.onclick=async event=>{
    try{
        if(inputSelectFile.files.length===0)
        {   
            labelFileStatus.style.display='block'
            labelFileStatus.textContent='No file is selected'
            return;
        }
        const headers=getTokenHeaders()
        if(!headers)
        {
            return;
        }   
        headers['Content-Type']= 'multipart/form-data'    
        
        let url;
        if(OBJ.id2Get==-1){
            url=baseUrl+'Chat/postFile'
        }
        else{
            url=baseUrl+`Group/postFile/${OBJ.id2Get}`
        }
        
        
        
        
        
        
        
        
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        const result=await axios.post(url,formData,{headers})
        console.log(result)
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
    inputSelectFile.value='';
}

buttonCreateGroup.onclick=async event=>{
    const headers=getTokenHeaders()
    if(!headers)
    {
        return;
    } 
    
    const groupName=prompt("Enter the group Name")

    if(!groupName){
        return;
    }
    obj={groupName:groupName}
    try{
        const result=await axios.post(baseUrl+'Group/createGroup',obj,{headers})
        
        const groupDetails=result.data
        deleteAllChats();
        onChangeSettings(groupDetails.groupId,groupDetails.groupName,groupDetails.groupUID)
        addGroup2GroupLists(groupDetails)
        onPageRefress(groupDetails.groupUID)
    }
    catch(err){
        console.log(err)
    }

   
}
buttonJoinGroup.onclick=async evnet=>{
    const headers=getTokenHeaders()
    if(!headers)
    {
        return;
    } 
    
    const groupUID=prompt("Enter the group UID")

    if(!groupUID){
        return;
    }
    
    try{
        
        const result=await axios.get(baseUrl+`Group/addGroup/${groupUID}`,{headers})

        
        if(result.status==201){
            labelStatus.textContent="Already the Member of the Group"
            
            return;
        }

        const groupDetails=result.data
        deleteAllChats();
        onChangeSettings(groupDetails.groupId,groupDetails.groupName,groupDetails.groupUID)
        addGroup2GroupLists(groupDetails)
        onPageRefress(groupDetails.groupUID)
    }
    catch(err){
        console.log(err)
    }
}

buttonGlobalChat.onclick=async evnet=>{
    deleteAllChats();
    onChangeSettings(-1,"Global Chat","")
    buttonEditGroup.style.display='none';
    
    onPageRefress('global-chats')
    
}
buttonEditGroup.onclick=async event=>{
    window.location='../Group/index.html'
}
function onChangeSettings(id2Get,groupName,groupUID){
    OBJ.id2Get=id2Get
    OBJ.firstTime=false
        
    labelGroupName.innerHTML=`<b>${groupName}</b>`
    localStorage.removeItem('lastChatId')
    localStorage.removeItem('localChats')
    const url=groupUID

    inputLink.value=url;

}


function addGroup2GroupLists(group){
    
    const button=document.createElement('button')
    button.className='custom-button'


    button.textContent=group.groupName

    button.onclick=event=>{
       buttonEditGroup.style.display='block'
       
       localStorage.setItem('groupId',group.groupId)
       
       

       localStorage.setItem('groupName',group.groupName)
       onChangeSettings(group.id,group.groupName,group.groupUID)
       deleteAllChats();
       onPageRefress(group.groupUID)
       

    }
    groupLists.appendChild(button)

}
async function defaultPageRefress(){
    
    const headers=getTokenHeaders()
    if(!headers)
    {
        return;
    } 

    try{
        const result=await axios.get(baseUrl+'Group/getGroups',{headers})
        
        //onPageRefress();
        for(const group of result.data){
            group.groupId=group.id;
            addGroup2GroupLists(group)
        }
    }
    catch(err){

    }
        

    
        
}
document.addEventListener('DOMContentLoaded',async event=>{
    defaultPageRefress()
    onChangeSettings(-1,"Global","")
    localStorage.setItem('prevGroupId','global-chats')
    onPageRefress('global-chats');
    
    //socket.emit('join-group','global-chats')
    // async function myFunction(){

    //     onPageRefress();

    //     setTimeout(myFunction,1000)


    // }

    // myFunction();
    
})
