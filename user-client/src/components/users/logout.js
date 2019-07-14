import React from 'react'
import axios from 'axios'

class Logout extends React.Component{

    componentDidMount(){
       
            axios.delete('http://localhost:3001/users/logout',{
            headers:{
                'x-auth' : localStorage.getItem('userAuthToken')
            }
        })
        .then(response => {
            console.log(response.data)
            localStorage.removeItem('userAuthToken')
            this.props.handleAuth(false)
            this.props.history.push('/users/login')
        })

    }

    render(){
        return(
            <p>logging out...</p>
        )
    }
}
export default Logout