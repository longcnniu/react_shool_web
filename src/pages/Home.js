import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [Loading, setLoading] = useState(false)
  const navigate = useNavigate()
  
  const cookieValue = document.cookie
  .split('; ')
  .find(row => row.startsWith('accessToken='))
  .split('=')[1];

  useEffect(() => {
    const checklogin = () => {

      var myHeaders = new Headers();
      myHeaders.append("token", cookieValue);

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      return fetch("http://localhost:5000/", requestOptions)
        .then(res => res.json())
        .then(data => {
          if (!data.success) {
            setLoading(true)
            document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            navigate("/login")
          }else{
            setLoading(true)
          }
        })
        .catch(error => console.log('error', error))
    };
    checklogin()
  }, [navigate, cookieValue])

  return (
    <div>
      {Loading ? <div>Home</div> : <div>loading...</div>}
    </div>
  )
}

export default Home