import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const CreacteCategory = () => {

  const navigate = useNavigate()
  const [Category, setCategory] = useState('')
  const [endDate, setendDate] = useState('')
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
    var d = new Date(endDate)
    var EndTime = d.getUTCFullYear()+'-'+("0" + (d.getUTCMonth() + 1)).slice(-2)+'-'+("0" + (d.getUTCDate())).slice(-2)+'T'+("0" + (d.getUTCHours())).slice(-2)+':'+("0" + (d.getUTCMinutes())).slice(-2)

    const cookieValue = document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      .split('=')[1];
    var myHeaders = new Headers();
    myHeaders.append("token", cookieValue);
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("title", Category);
    urlencoded.append("endDate", EndTime)

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch(`${apiUrl}/category`, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result.message);
      })
      .catch(error => console.log('error', error));
  }

  //html
  let body

  console.log(endDate);
  console.log(new Date(endDate).getTime());

  if (Loading) {
    body = (
      <div>
        <div>
          <label>Title: </label>
          <input type='text' onChange={e => setCategory(e.target.value)} />
        </div>
        <div>
          <label>Ngay het han: </label>
          <input type='datetime-local' onChange={e => setendDate(e.target.value)} />
        </div>
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