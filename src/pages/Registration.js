import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Registration = () => {

  const navigate = useNavigate()
  const [Loading, setLoading] = useState(false)

  const [UserName, setUserName] = useState('')
  const [Password, setPassword] = useState('')
  const [Role, setRole] = useState('staff')

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

        fetch("https://salty-brook-05753.herokuapp.com/registration", requestOptions)
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

  const registration = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("email", UserName);
    urlencoded.append("password", Password);
    urlencoded.append("role", Role);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch("http://localhost:5000/registration", requestOptions)
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => console.log('error', error))
  }

  return (
    <div>
      {Loading ?
        <div>
          <div className='mb-6 pt-3 rounded bg-gray-200'>
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" name="email">Email</label>
            <input className='bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 pb-3' type="email" name='email' onChange={e => setUserName(e.target.value)} />
          </div>
          <div className='mb-6 pt-3 rounded bg-gray-200'>
            <label className="block text-gray-700 text-sm font-bold mb-2 ml-3" name="password">Password</label>
            <input className='bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-blue-600 transition duration-500 px-3 pb-3' type="password" name='password' onChange={e => setPassword(e.target.value)} />
          </div>
          <div>
            <label>Role User:</label>
            <select value={Role} onChange={e => setRole(e.target.value)}>
              <option value='staff'>Staff</option>
              <option value='qa-manager'>QA Manager</option>
              <option value='admin'>Admin</option>
            </select>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200 w-32" type="submit" onClick={registration}>Dang ki</button>
        </div> :
        <div>loading...</div>}
    </div>
  )
}

export default Registration