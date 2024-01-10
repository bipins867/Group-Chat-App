const inputEmail=document.getElementById('input-email')
const inputPassword=document.getElementById('input-password')
const labelStatus=document.getElementById('status-label')

const baseUrl='http://13.51.148.220:3001/'

document.getElementById('form-login').addEventListener('submit',async event=>{
    labelStatus.textContent=''
    event.preventDefault();
    obj={
        email:inputEmail.value,
        password:inputPassword.value
    }
    try{
        const result= await axios.post(baseUrl+'User/login',obj)
        
        labelStatus.innerText='Login Successfull!'
        alert("Login Successfull !")
        const token=result.data.token;
        localStorage.setItem('token',token)
        localStorage.setItem('userId',result.data.userId)

        window.location='../Chat/index.html'
            
        
    }
    catch(err){
        
        const status=err.response.status
        labelStatus.style.color='red'

        if(status==401){
            labelStatus.textContent='Invalid Passsword!'

        }
        else if(status==404){
            labelStatus.textContent="User not found!"

        }
        else{
            labelStatus.textContent="Something went wrong!"
        }
    }
})