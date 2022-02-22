import React, { useEffect } from 'react'

const Admin = () => {

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

        fetch("http://localhost:5000/admin", requestOptions)
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              console.log(data.message);
            } else {
              console.log(data.message);
            }
          })
          .catch(error => console.log('error', error))
      }
    }
    checkAuth()
  }, [])


  return (
    <div>Admin</div>
  )
}

export default Admin