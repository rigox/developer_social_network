import React , {Fragment, useState} from 'react'
import {Link } from 'react-router-dom';
import axios from 'axios';
const Login = (props) => {
    const [formData,setFormData]   = useState({
        email:'',
        password:'',
    });

    const {email,password}  =  formData;

    const onChange =(e)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
    }


    const onSubmit = async e =>{
        e.preventDefault();
        console.log("soccess")
    }

    return (
       <Fragment>
            <h1 className="large text-primary">Sign in</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" action="create-profile.html"  onSubmit={e=> onSubmit(e)}>
        <div className="form-group">
          <input type="email" placeholder="Email Address"  value={email} onChange={e=> onChange(e)} name="email" />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={e=> onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Dont Have And Accouunt? <Link to="/register">SignUp</Link>
      </p>
       </Fragment>
    )
}

export default Login;
