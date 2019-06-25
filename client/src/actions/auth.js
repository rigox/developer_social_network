import axios from 'axios';
import {REGISTER_FAIL,REGISTER_SUCCESS,USER_LOADED,AUTH_ERROR,LOGIN_FAIL,LOGIN_SUCCESS,LOGOUT} from './types';
import {setAlert} from './alert';
import setAuthToken from '../utils/setAuthToken'
// Load User 
export const  loadUser = () => async dispacth=>{

 if(localStorage.token){
        setAuthToken(localStorage.token)

 }

 try {
     const  res  = await axios.get('/api/auth');
     dispacth({
          type:USER_LOADED,
          payload:res.data
     })
 } catch (err) {
      dispacth({
           type:AUTH_ERROR
      })
 }
    

}






//Registers user
export const Register = ({name,email,password}) => async dispacth =>{
     
    const config  ={
          headers:{
               'Content-Type':'application/json'
          }
     }

     const body  =  JSON.stringify({name,email,password})

     try{   

         const res = await axios.post('/api/users',body,config)
         dispacth({
              type:REGISTER_SUCCESS,
              payload:res.data
         })
         dispacth(loadUser())

     }catch(err){
            const errors =  err.response.errors
            if(errors){
                 errors.forEach(error=> dispacth(
                     setAlert(error.msg,'danger')
                 ))
            }

        dispacth({
                 type:REGISTER_FAIL
            })
     }

}

//Login User

export const logIn = (email,password) => async dispacth =>{
     
    const config  ={
          headers:{
               'Content-Type':'application/json'
          }
     }

     const body  =  JSON.stringify({email,password})

     try{   

         const res = await axios.post('/api/auth',body,config)
         dispacth({
              type:LOGIN_SUCCESS,
              payload:res.data
         })
         dispacth(loadUser())
     }catch(err){
            const errors =  err.response.errors
            if(errors){
                 errors.forEach(error=> dispacth(
                     setAlert(error.msg,'danger')
                 ))
            }

        dispacth({
                 type:LOGIN_FAIL
            })
     }

}


//logout / clear profiles

export const logout = () => dispacth =>{
    dispacth({
         type:LOGOUT
    })
}