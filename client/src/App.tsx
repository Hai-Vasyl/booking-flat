import React, { useEffect, useState } from "react"
import "./App.scss"
import { useDispatch } from "react-redux"
import { SET_AUTH } from "./redux/auth/authTypes"
import Routes from "./components/Routes"

const App: React.FC = () => {
  const dispatch = useDispatch()
  const [load, setLoad] = useState(true)

  useEffect(() => {
    dispatch({ type: SET_AUTH })
    setTimeout(() => setLoad(false), 2000)
  }, [dispatch])

  return (
    <div className='App'>
      <div className={`background ${!load && "background--close"}`}></div>
      {!load && <Routes />}
    </div>
  )
}

export default App
