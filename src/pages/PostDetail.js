import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const PostDetail = () => {
  const navigate = useNavigate()
  const [Loading, setLoading] = useState(false)
  const [Post, setPost] = useState([])

  //kiểm tra token and đẵ đăng nhập hay chưa
  useEffect(() => {
    const checklogin = () => {
      if (document.cookie.split(';').some((item) => item.trim().startsWith('accessToken='))) {
        //đoc cookie
        const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('accessToken='))
          .split('=')[1];
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        fetch(`${apiUrl}/`, requestOptions)
          .then(response => response.json())
          .then(data => {
            if (!data.success) {
              setLoading(true)
            } else {
              getPost(cookieValue)
              setLoading(true)
            }
          })
          .catch(error => console.log('error', error));
      } else {
        navigate("/login")
      };
    }
    checklogin()
  }, [navigate])

  const getPost = (cookie) => {
    var myHeaders = new Headers();
    myHeaders.append("token", cookie);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${apiUrl}` + window.location.pathname, requestOptions, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          setPost(result.dataPost)
        }
      })
      .catch(error => console.log('error', error));
  }

  console.log(Post);

  //HTMl
  let body
  if (Loading) {
    body = (
      <>
        <div>
          <div>Name: {Post.name}</div>
          <div>Category: {Post.category}</div>
          <p>Content: {Post.content}</p>
          <p>View: {Post.numberView}</p>
          <p>Vote: {Post.numberVote}</p>
          <button>Vote</button>
        </div>
      </>
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

export default PostDetail