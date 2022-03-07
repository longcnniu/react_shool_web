import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const CreacteCategory = () => {

  const navigate = useNavigate()
  const [Category, setCategory] = useState('')
  const [Loading, setLoading] = useState(false)

  //kiểm tra token and đẵ đăng nhập hay chưa vs cos phải là Admin or QA
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

        return fetch("http://localhost:5000/category", requestOptions)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setLoading(true)
            } else {
              navigate('/')
            }
          })
          .catch(error => console.log('error', error))
      } else {
        navigate('/login')
      }
    }
    checkAuth()
  }, [navigate])

  const creacteCategory = () => {
    var myHeaders = new Headers();
    myHeaders.append("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjIyY2E4MGNhNmU2MjBjZGFlZGI4ZGMiLCJlbWFpbCI6Imx1dWhvYW5nbG9uZzIxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJMdXUgTG9uZyIsImlhdCI6MTY0NjYzNzgyNywiZXhwIjoxNjQ2NzI0MjI3fQ.RYNQlJ7tDwPz-KIeTv6L02N7kVIcSfC8M7ozffs3ZtQ");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("title", Category);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch("http://localhost:5000/category", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
  }

  //html
  let body

  if (Loading) {
    body = (
      <div>
        <label>Title: </label>
        <input onChange={e => setCategory(e.target.value)} />
        <button onClick={creacteCategory}>Xac Nhan</button>
      </div>
    )
  } else {
    body = (
      <div>Loading...</div>
    )
  }


  return (
    body
  )
}

export default CreacteCategory