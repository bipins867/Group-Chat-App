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
            labelStatus.style.color='red'
            alert("User Already Exists! Please Login")
        }
        else if (status ==200){
            labelStatus.textContent="Signup Successfull !"
            alert("Successfully Signed Up")
        }
        else{
            //Not Required
        }

    }
    catch(err){
        labelStatus.style.color='red'
        labelStatus.textContent="Something went Wrong !"
    }
    
}