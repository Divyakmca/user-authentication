import React from 'react'
import ReactDOM from 'react-dom'



import App from './App'



const Hello = (props) =>{
    return(
        <div>
        <App />

        </div>
    )
}
ReactDOM.render(<Hello/>, document.getElementById('root'))