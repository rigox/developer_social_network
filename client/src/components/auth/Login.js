import React , {Fragment, useState} from 'react'
import {Link  , Redirect} from 'react-router-dom';
import {logIn}  from '../../actions/auth';
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import axios from 'axios';

const Login = ({logIn,isAuthenticated}) => {
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
        logIn(email,password);
    }
    //Redirect Loged In
    if(isAuthenticated){
       return <Redirect to="/dashboard" />
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

Login.propTypes  ={
  login:PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
   isAuthenticated:state.auth.isAuthenticated
})

export default connect(mapStateToProps,{logIn})(Login);
