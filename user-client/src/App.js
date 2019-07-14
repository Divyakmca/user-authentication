import React from 'react'
import { BrowserRouter, Route, Link, Switch} from 'react-router-dom'

import Register from './components/users/Register'
import Login from './components/users/Login'
import Account from './components/users/Account'
import Logout from './components/users/logout'

class App extends React.Component{
     constructor(props){
       super(props)
       this.state = {
         isAuthenticated: false

       }
     }
    
     //to retain the value even when the page is refreshed.
     componentDidMount(){
       if(localStorage.getItem('userAuthToken')){
          this.setState({ isAuthenticated: true })
       }
     }

     handleAuth = (bool) =>{
         this.setState ({ isAuthenticated: bool })
     }


  render(){
    console.log(this.state)
    return(
      <BrowserRouter>
      <div className="container">

        <ul>
          {this.state.isAuthenticated && (
            <div>
              <li><Link to="/users/account">Account </Link></li>
              <li><Link to="/users/logout">Logout</Link></li>
            </div>
          )}

          {!this.state.isAuthenticated && (
            <div>
              <li><Link to ="/users/register">Register</Link></li>
              <li><Link to="/users/login">Login</Link></li>
            </div>
          )}   

        </ul>

 <Switch> {/* if the first condition is met then only that particular operation is performed and it breaks out of the loop */}
        {/* Logged in routes */}
        {this.state.isAuthenticated && (
          <div>
            <Route path="/users/account" component={Account}/>
            <Route path="/users/logout" render = {(props) => {
            return <Logout {...props} handleAuth={this.handleAuth}/>

        }}/>

          </div>
        )}


        {/* Logged out routes */}
        {!this.state.isAuthenticated && (
          <div>
            <Route path ="/users/register" component={Register}/>

               {/* <Route path="/users/login" component={Login}/>
                 to pass props from one component to other you make use of render
                 render allows to create inline component, for render you can pass function 
                 passing props through route so use render */}

            <Route path="/users/login" render={(props) => {
             console.log(props)
            return <Login {...props} handleAuth={this.handleAuth}/>
          }}/>

          </div>  
        )}
        
        <Route render = {() => {
          return <h2>The page you are looking for doesnot exist</h2>

        }}/>

</Switch>
        

      </div>
      </BrowserRouter>
    )
  }
}


export default App
