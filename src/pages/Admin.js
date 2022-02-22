import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Admin = () => {

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

        fetch("https://salty-brook-05753.herokuapp.com/admin", requestOptions)
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              console.log(data.message);
            } else {
              console.log(data.message);
            }
          })
          .catch(error => console.log('error', error))
      }else{
        navigate('/login')
      }
    }
    checkAuth()
  }, [navigate])

  return (
    <div>
      {Loading ? <div>Home</div> : <div>loading...</div>}
    </div>
  )
}
//Test
export default Admin