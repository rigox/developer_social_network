import React ,{Fragment } from 'react';
import {BrowserRouter as Router , Switch , Route}  from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import SignUp from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
//Redux
import  {Provider} from 'react-redux';
import store from './store';

import './App.css';

const App=()=> {
  return (
    <Provider store={store}>
    <Router>
     <Fragment>
       <Navbar />
          <Route  exact path="/" component={Landing}  />
          <section className="container">
          <Alert />
          <Switch>
          <Route  exact path="/register" component={SignUp}  />
          <Route  exact path="/login" component={Login}  />
          </Switch>
          </section>
     </Fragment>
  </Router>
  </Provider>
  )
}

export default App;
