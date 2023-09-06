const labelGroupName=document.getElementById('group-name')
const memberList=document.getElementById('member-list')
const buttonDassboard=document.getElementById('button-dassboard')
const labelStatus=document.getElementById('label-status')

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

buttonDassboard.onclick=event=>{
    window.location='../Chat/index.html'
}


function addMembersOfType(user,groupId,headers){

    const limember=document.createElement('li')
    
    const spamMemberName=document.createElement('spam')
    const spamMemberType=document.createElement('spam')
    const buttonRoleEdit=document.createElement('button')
    const buttonRemoveMember=document.createElement('button')

    
    spamMemberName.textContent=user.userName;
    spamMemberType.textContent=user.memberType;
    buttonRemoveMember.textContent="Remove From Group"

    

    
    
    limember.className='limember'
    spamMemberName.className='member-name'
    buttonRemoveMember.className='remove-button'


    if(user.memberType==='admin'){
        spamMemberType.className='member-role admin'
        buttonRoleEdit.className='demote-button'
        buttonRoleEdit.textContent='Demote to member'
    }
    else{
        spamMemberType.className='member-role member'
        buttonRoleEdit.className='promote-button'
        buttonRoleEdit.textContent='Promote to Admin'
    }


    limember.appendChild(spamMemberName)
    limember.appendChild(spamMemberType)
    limember.appendChild(buttonRoleEdit)
    limember.appendChild(buttonRemoveMember)
    

    memberList.appendChild(limember)




    buttonRoleEdit.onclick=async event=>{
        let url;
        if(buttonRoleEdit.className=='promote-button'){
            url=baseUrl+`Group/updateMemberType/${groupId}/${user.userId}/admin`
        }
        else{
            
            url=baseUrl+`Group/updateMemberType/${groupId}/${user.userId}/member`
        }

        try{
            const result=await axios(url,{headers})
            const status=result.status;
            if(status==200){
                location.reload();
            }
            else{
                showLabelStatus(status)
            }
        }
        catch(err){
            console.log(err)
        }
    }

    buttonRemoveMember.onclick=async evnet=>{
        try{
            const result=await axios.get(baseUrl+`Group/removeGroupMember/${groupId}/${user.userId}`,{headers})
            const status=result.status;
            //labelStatus.textContent=''
            if(status==200){
                memberList.removeChild(limember)
            }
            
            else{
                showLabelStatus(status)
            }
        }
        catch(err){
            console.log(err)
        }
    }
}

function showLabelStatus(status){
    if(status==201){
        labelStatus.textContent='You are not admin of the Group'
    }
    else if(status==202){
        labelStatus.textContent="You can't edit Super Admin User"
    }
    else if(status==203){
        labelStatus.textContent="You are the Super Admin of this group- You can't edit youself"
    }
    else{
        labelStatus.textContent="Showing status"
    }
}


async function onPageRefress(){
    const headers=getTokenHeaders()
    const groupId=localStorage.getItem('groupId')
    const groupName=localStorage.getItem('groupName')
    if(!headers)
    {
        return;
    }

    try{
        const result=await axios.get(baseUrl+`Group/getGroupMembers/${groupId}`,{headers})
        labelGroupName.textContent=groupName
        for(const user of result.data.users){
            addMembersOfType(user,result.data.groupId,headers)
        }
    }
    catch(err)
    {
        console.log(err)
    }
}




document.addEventListener('DOMContentLoaded',async event=>{
    onPageRefress();
})