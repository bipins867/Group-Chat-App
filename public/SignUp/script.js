const formSignUp=document.getElementById('form-signup')
const inputName=document.getElementById('input-name')
const inputEmail=document.getElementById('input-email')
const inputPhone=document.getElementById('input-phone')
const inputPassword=document.getElementById('input-password')

const labelStatus=document.getElementById('label-status')


const baseUrl='http://localhost:3000/'




formSignUp.onsubmit=async event=>{
    labelStatus.textContent=""
    event.preventDefault();
    try{
        const obj={
            name:inputName.value,
            email:inputEmail.value,
            phone:inputPhone.value,
            password:inputPassword.value,
        }

        const result=await axios.post(baseUrl+'User/signup',obj)
        
        const status=result.status;

        if(status==201){
            labelStatus.textContent="User Already Exists!"
        }
        else if (status ==200){
            labelStatus.textContent="Signup Successfull !"
        }
        else{
            //Not Required
        }

    }
    catch(err){
        labelStatus.textContent="Something went Wrong !"
    }
    
}