import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Registration = () => {

    const navigate = useNavigate()
    const [Loading, setLoading] = useState(false)
  
    //kiểm tra token and đẵ đăng nhập hay chưa vs cos phải là Admin
    useEffect(() => {
      const checkAuth = () => {
        if (document.cookie.split(';').some((item) => item.trim().startsWith('accessToken='))) {
          //đoc cookie
          const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            .split('=')[1];
          //Gửi req token lên server xác thực
          var myHeaders = new Headers();
          myHeaders.append("token", cookieValue);
  
          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };
  
          fetch("http://localhost:5000/registration", requestOptions)
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                setLoading(true)
              } else {
                navigate('/login')
              }
            })
            .catch(error => console.log('error', error))
        } else {
          navigate('/login')
        }
      }
      checkAuth()
    }, [navigate])

  return (
    <div>
      {Loading ?
        <div>
            <div>Registration</div>
        </div> :
        <div>loading...</div>}
    </div>
  )
}

export default Registration