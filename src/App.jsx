import React, { useState } from 'react'
import Main from './Components/Main/Main'
import Login from './Components/Login/Login'

const App = () => {

  const [isLogin, setIsLogin] = useState(false);

  const handlelogin =(value)=>{
    setIsLogin(value);
    // console.log(isLogin);
  }
  return (
    <>
    {isLogin ? <Main/> : <Login onLogin={handlelogin}/>}
    </>
  )
}

export default App