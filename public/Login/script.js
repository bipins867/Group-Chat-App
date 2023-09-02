const inputEmail=document.getElementById('input-email')
const inputPassword=document.getElementById('input-password')
const labelStatus=document.getElementById('status-label')

const baseUrl='http://localhost:3000/'

document.getElementById('form-login').addEventListener('submit',event=>{
    event.preventDefault();
    obj={
        email:inputEmail.value,
        password:inputPassword.value
    }
    try{
       const result= axios.post(baseUrl+'/User/login',obj)
        console.log(result)
        
    }
    catch(err){
        
        console.log(err)
    }
})