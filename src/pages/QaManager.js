import '../css/admin.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const QaManager = () => {

  const navigate = useNavigate()
  const [Loading, setLoading] = useState(false)
  const [LoadingViewUser, setLoadingViewUser] = useState(false)
  const [ViewUser, setViewUser] = useState([])
  const [changedListUser, setchangedListUser] = useState(false)
  const [changedUser, setchangedUser] = useState(false)

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

        return fetch("http://localhost:5000/manager", requestOptions)
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              setLoading(true)
              getView(cookieValue)
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
  }, [navigate, changedListUser, changedUser])

  //hiện danh sách user
  const getView = (cookieValue) => {
    var myHeaders = new Headers();
    myHeaders.append("token", cookieValue);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    return fetch("http://localhost:5000/all-user-qa", requestOptions)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setViewUser(data.dataUsers)
          setLoadingViewUser(true)
        } else {
          // setViewUser('Not User')
          setLoadingViewUser(true)
        }
      })
      .catch(error => console.log('error', error));
  }

  //Chuyển trang sang đăng kí
  const nextPageRegistration = () => {
    navigate('/registration')
  }

  const clickEdit = (data) => {
    return (event) => {
      navigate(`/view-user/${data._id}`)
    }
  }

  function click(data) {
    return (event) => {
      var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };

      fetch("http://localhost:5000/view-user/" + data._id, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            console.log(result.message);
            setchangedUser(!changedUser)
          }
        })
        .catch(error => console.log('error', error));
    }
  }

  const clickRefrc = () => {
    setchangedListUser(!changedListUser)
  }

  let body
  if (Loading) {
    if (LoadingViewUser) {
      if (ViewUser.length !== 0) {
        const listview = ViewUser.map(data => (
          <tr key={data._id}>
            <td>{data.email}</td>
            <td>{`${data.firstName} ${data.lastName}`}</td>
            <td>{data.role}</td>
            <td>
              <button onClick={clickEdit(data)}>Edit</button>
              <button onClick={click(data)}>Xoa</button>
            </td>
          </tr>
        ))
        body = (
          <>
            <button onClick={nextPageRegistration}>Add Account</button>
            <button onClick={clickRefrc}>Lam moi list</button>
            <div>
              <table>
                <tbody>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>...</th>
                  </tr>
                  {listview}
                </tbody>
              </table>
            </div>
          </>
        )
      } else {
        body = (
          <>
          <button onClick={nextPageRegistration}>Add Account</button>
            <button onClick={clickRefrc}>Lam moi list</button>
            <h1>Khong co tai khoan nao</h1>
          </>
        )
      }
    } else {
      body = (
        <div className='loading'>Loading user...</div>
      )
    }
  } else {
    body = (
      <div className='loading'>loading...</div>
    )
  }

  return (body)
}

export default QaManager