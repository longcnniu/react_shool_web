import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Admin = () => {

  const navigate = useNavigate()
  const [Loading, setLoading] = useState(false)
  const [LoadingViewUser, setLoadingViewUser] = useState(false)
  const [ViewUser, setViewUser] = useState('')

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

        return fetch("https://salty-brook-05753.herokuapp.com/admin", requestOptions)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setLoading(true)
              getView(cookieValue)
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

  //hiện danh sách user
  const getView = (cookieValue) => {
    var myHeaders = new Headers();
    myHeaders.append("token", cookieValue);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    return fetch("https://salty-brook-05753.herokuapp.com/all-user", requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data === " ") {
          setViewUser('Not User')
          setLoadingViewUser(true)
        } else {
          setViewUser(data)
          setLoadingViewUser(true)
        }
      })
      .catch(error => console.log('error', error));
  }

  //Chuyển trang sang đăng kí
  const nextPageRegistration = () => {
    navigate('/registration')
  }

  return (
    <div>
      {Loading ?
        <div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded hover:shadow-xl transition duration-200 h-12 w-32 mt-12 ml-12" onClick={nextPageRegistration}>Add Account</button>
          {LoadingViewUser ?
            <div>
              <div>{ViewUser.map(data => (
                <div key={data.email}>
                  <h1>{data.email} </h1>
                  <p>{data.role}</p>
                </div>
              ))}</div>
            </div>
            : <div>Loading user...</div>}
        </div> :
        <div>loading...</div>}
    </div>
  )
}

export default Admin