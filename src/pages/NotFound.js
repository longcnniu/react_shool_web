import '../css/not_found.css'
import { useNavigate } from "react-router-dom";
import React from 'react'

function NotFound() {

  const navigate = useNavigate()

  //return home
  const returnHome = () => {
    navigate('/?page=1')
  }

  return (
    <div className='body-error-page'>
      <div className='error-page'>
        <div className='content'>
          <h1 className='title-error-h1'>404</h1>
          <h4 className='title-error-h4'>Opps! Page not found</h4>
          <p className='tag-error-p'>Sorry, the page you are looking for doesn`t exist. If you think something is broken. report a problem.</p>
          <div className='btns-error'>
            <button onClick={returnHome} className='btn-return-home'>return home</button>
            <button className='btn-report-error'>report problem</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound