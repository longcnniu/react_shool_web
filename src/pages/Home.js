import '../css/home.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [Loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [RoleAuth, setRoleAuth] = useState('')

  //kiểm tra token and đẵ đăng nhập hay chưa
  useEffect(() => {
    const checklogin = () => {
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

        return fetch("http://localhost:5000", requestOptions)
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              setLoading(true)
              document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              navigate("/login")
            } else {
              setLoading(true)
              setRoleAuth(data.role)
            }
          })
          .catch(error => console.log('error', error))
      } else {
        navigate("/login")
      };
    }
    checklogin()
  }, [navigate])

  //click creact new Post
  const CreactPost = () => {
    navigate('/new-post')
  }

  //click creact new Category
  const CreactCategory = () => {
    navigate('/Category')
  }

  let body
  if (Loading) {
    if (RoleAuth === 'admin' || RoleAuth === 'qa-manager') {
      body = (
        <div>
          <button onClick={CreactPost}>Dang bai viet</button>
          <button onClick={CreactCategory}>View Category</button>
        </div>
      )
    } else {
      body = (
        <div>
          <button onClick={CreactPost}>Dang bai viet</button>
        </div>
      )
    }
  } else {
    body = (
      <>
        <div className='loading'>loading...</div>
      </>
    )
  }

  return (body)
}

export default Home