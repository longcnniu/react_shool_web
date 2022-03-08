import '../css/home.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [Loading, setLoading] = useState(false)
  const [LoadingPost, setLoadingPost] = useState(false)
  const navigate = useNavigate()
  const [RoleAuth, setRoleAuth] = useState('')
  const [Posts, setPosts] = useState([])

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
              setRoleAuth(data.role)
              GetAllPost(cookieValue)
              setLoading(true)
            }
          })
          .catch(error => console.log('error', error))
      } else {
        navigate("/login")
      };
    }
    checklogin()
  }, [navigate])

  //Get POST
  const GetAllPost = (cookieValue) => {
    var myHeaders = new Headers();
    myHeaders.append("token", cookieValue);

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    return fetch("http://localhost:5000/all-post", requestOptions)
      .then(res => res.json())
      .then(data => {
        setPosts(data.dataPost)
        setLoadingPost(true)
      })
      .catch(error => console.log('error', error));

  }

  //click creact new Post
  const CreactPost = () => {
    navigate('/new-post')
  }

  //click creact new Category
  const CreactCategory = () => {
    navigate('/Category')
  }

  //HTML 2

  let bodyPost

  if (LoadingPost) {
    const listPost = Posts.map(data => (
      <div className='post' key={data._id}>
        <div>
          <h4>Name: {data.name}</h4>
        </div>
        <div>
          <p>Ngay Dang: {data.dateCreate}</p>
        </div>
        <div>
          <p>Category: {data.category}</p>
        </div>
        <div>
          <h4>Tieu De: {data.title}</h4>
        </div>
        <div>
          <p>Noi Dung: {data.content}</p>
        </div>
        <div>
          <p>Vote: {data.numberVote}</p>
        </div>
      </div>
    ))
    bodyPost = (
      <div>
        {listPost}
      </div>
    )
  } else {
    bodyPost = (
      <div className='loading'>Loading Posts...</div>
    )
  }

  //HTML 1
  let body
  if (Loading) {
    if (RoleAuth === 'admin' || RoleAuth === 'qa-manager') {
      body = (
        <div>
          <button onClick={CreactPost}>Dang bai viet</button>
          <button onClick={CreactCategory}>View Category</button>
          {bodyPost}
        </div>
      )
    } else {
      body = (
        <div>
          <button onClick={CreactPost}>Dang bai viet</button>
          {bodyPost}
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