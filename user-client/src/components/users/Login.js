import React from 'react'
import axios from 'axios'

class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            
            email:'',
            password:''
        }
    }

    handleChange = (e) => {
        e.persist()
        this.setState(() => ({
            [e.target.name] : e.target.value
        }))
    }

    handleSubmit = (e) => {
        e.preventDefault()
        const formData = {
         
            email : this.state.email,
            password : this.state.password
        }
        //console.log(formData)
       
        axios.post('http://localhost:3001/users/login',formData)
        .then(response => {
            console.log(response.data)
            if(response.data.errors){
                alert(response.data.errors)
            }else{
                const token = response.data.token
                localStorage.setItem('userAuthToken', token)
                this.props.handleAuth(true)
                this.props.history.push('/users/account')
          }
        })
    }



    render(){
        return(
            <div>
                <h2>Login</h2>
             
                    <form onSubmit={this.handleSubmit}>
                        

                        <label>
                            Email
                            <input type="text" value={this.state.email} name="email" onChange={this.handleChange}/>
                        </label><br/><br/>

                        <label>
                            Password
                            <input type="password" value={this.state.password} name="password" onChange={this.handleChange}/>
                        </label><br/><br/>
                        <input type="submit"/>


                    </form>
               
            </div>
        )
    }


}

export default Login