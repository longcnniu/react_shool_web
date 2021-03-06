import '../css/creacteCategory.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const CreacteCategory = () => {

  const navigate = useNavigate()
  const [Category, setCategory] = useState('')
  const [endDate, setendDate] = useState('')
  const [lockDate, setlockDate] = useState('')
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

        return fetch(`${apiUrl}/category`, requestOptions)
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
    //Change loc TO GM T
    var dayNow = new Date()
    var d = new Date(endDate)
    var EndTime = d.getUTCFullYear() + '-' + ("0" + (d.getUTCMonth() + 1)).slice(-2) + '-' + ("0" + (d.getUTCDate())).slice(-2) + 'T' + ("0" + (d.getUTCHours())).slice(-2) + ':' + ("0" + (d.getUTCMinutes())).slice(-2)

    var dd = new Date(lockDate)
    var LockTime = dd.getUTCFullYear() + '-' + ("0" + (dd.getUTCMonth() + 1)).slice(-2) + '-' + ("0" + (dd.getUTCDate())).slice(-2) + 'T' + ("0" + (dd.getUTCHours())).slice(-2) + ':' + ("0" + (dd.getUTCMinutes())).slice(-2)


    if (d.getTime() >= dd.getTime()) {
      alert('Time 1 must be less than time 2')
    } else if (d.getTime() < dayNow.getTime()+15*60*1000) {
      alert('Time 1 must be bigger than now')
    } else {
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        .split('=')[1];
      //fun
      var myHeaders = new Headers();
      myHeaders.append("token", cookieValue);
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("title", Category);
      urlencoded.append("endDate", EndTime);
      urlencoded.append("lockDate", LockTime);

      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      fetch(`${apiUrl}/category`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.success) {
            navigate(-1)
          }
        })
        .catch(error => console.log('error', error));
    }
  }

  //html
  let body

  if (Loading) {
    const d = new Date()
    const MinTime = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + (d.getDate())).slice(-2)}T${("0" + (d.getHours())).slice(-2)}:${("0" + (d.getMinutes())).slice(-2)}`
    body = (
      <div className='CreacteCategory__Main'>
        <div className='CreacteCategory_Container'>
          <div>
            <div className='CreacteCategory__lable_div'>
              <label>Title: </label>
            </div>
            <input id='title' type='text' onChange={e => setCategory(e.target.value)} />
          </div>
          <div>
            <div className='CreacteCategory__lable_div'>
              <label>Expiration date: </label>
            </div>
            <input id='exp-date' type='datetime-local' onChange={e => setendDate(e.target.value)} min={MinTime} />
          </div>
          <div>
            <div className='CreacteCategory__lable_div'>
              <label>Lock Date: </label>
            </div>
            <input id='lock-date' type='datetime-local' onChange={e => setlockDate(e.target.value)} min={MinTime} />
          </div>
          <button className='CreacteCategory-btn' id='Create-category' onClick={creacteCategory}>Confirm</button>
        </div>
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