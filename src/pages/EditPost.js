import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const EditPost = () => {

  const [Loading, setLoading] = useState(false)
  const [AllCategory, setAllCategory] = useState([])
  const navigate = useNavigate()
  const [rememberUser, setRememberUser] = useState(false)
  //Input
  const [Title, setTitle] = useState('')
  const [Content, setContent] = useState('')
  const [Category, setCategory] = useState('')
  const [photo, setPhoto] = useState('');
  const [Img, setImg] = useState('')

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
          method: 'GET', headers: myHeaders, redirect: 'follow'
        };

        return fetch(`${apiUrl}/post`, requestOptions)
          .then(res => res.json())
          .then(data => {
            if (!data.success) {
              setLoading(true)
              document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              navigate("/login")
            } else {
              getAllCategory(cookieValue)
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

  //Get All category
  const getAllCategory = (cookieValue) => {
    var myHeaders = new Headers();
    myHeaders.append("token", cookieValue);

    var requestOptions = {
      method: 'GET', headers: myHeaders, redirect: 'follow'
    };

    return fetch(`${apiUrl}/all-category/exp`, requestOptions)
      .then(res => res.json())
      .then(data => {
        setAllCategory(data.dataCategorys)
      })
      .catch(error => console.log('error', error));
  }

  useEffect(() => {
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

    const id = (window.location.pathname).split('/')
    fetch(`${apiUrl}/post/${id[2]}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          setTitle(result.dataPost.title)
          setContent(result.dataPost.content)
          setCategory(result.dataPost.category)
          setImg(result.dataPost.NameImg)
        }
      })
      .catch(error => console.log('error', error));
  }, [])


  const uploadPost = () => {
    if (rememberUser) {
      //đoc cookie
      const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        .split('=')[1];
      const id = (window.location.pathname).split('/')
      var myHeaders = new Headers();
      myHeaders.append("token", cookieValue);

      if (photo === '') {
        var formdata = new FormData();
        formdata.append("title", Title);
        formdata.append("content", Content);
        formdata.append("category", Category);

        var requestOptions = {
          method: 'PUT',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow'
        };
        fetch(`${apiUrl}/post/${id[2]}`, requestOptions)
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              navigate('/?page=1')
              alert(result.message)
            } else {
              alert(result.message)
            }

          })
          .catch(error => console.log('error', error));
      } else {
        //fun POST
        var formdatas = new FormData();
        formdatas.append("image", photo, photo.name);
        formdatas.append("title", Title);
        formdatas.append("content", Content);
        formdatas.append("category", Category);

        var requestOptionss = {
          method: 'PUT',
          headers: myHeaders,
          body: formdatas,
          redirect: 'follow'
        };
        fetch(`${apiUrl}/post/${id[2]}`, requestOptionss)
          .then(response => response.json())
          .then(result => {
            if (result.success) {
              navigate(-1)
              alert(result.message)
            } else {
              alert(result.message)
            }

          })
          .catch(error => console.log('error', error));
      }
    } else {
      alert('Please agree on the terms')
    }
  }

  //Chick vaof imput img xoa anh cu neu co
  const delImgLow = () => {
    if (Img !== 'null') {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

      var urlencoded = new URLSearchParams();
      urlencoded.append("nameImg", Img);

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
      };

      fetch(apiUrl+"/del-img", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
    }
  }

  let body
  if (Loading) {
    if (AllCategory !== undefined) {
      const listCategory = AllCategory.map(data => (
        <option key={data._id} value={data.title}>{data.title}</option>))
      body = (
        <div className='CreatePost-Main'>
          <div className='CreatePost-container'>
            <h3>Create Post</h3>
            <div className='CreatePost-container-inputAll'>
              <div className='CreatePost-title'>
                <label>Title</label>
              </div>
              <input type='text' name='title' onChange={e => setTitle(e.target.value)} value={Title} />
            </div>
            <div className='CreatePost-container-inputAll'>
              <div className='CreatePost-title'>
                <label>Upload file:</label>
              </div>
              <input type="file" onChange={e => setPhoto(e.target.files[0])} onClick={delImgLow} />
            </div>
            <div className='CreatePost-container-inputAll'>
              <div className='CreatePost-title'>
                <label>Content</label>
              </div>
              <textarea value={Content} className='CreatePost-textarea' onChange={e => setContent(e.target.value)} name="w3review" rows="4" cols="50" />
            </div>
            <div className='CreatePost-container-inputAll'>
              <div className='CreatePost-title'>
                <label>Category</label>
              </div>

              <select onChange={e => setCategory(e.target.value)} value={Category}>
                <option value=''></option>
                {listCategory}
              </select>
            </div>
            <div className='CreatePost-container-inputAll'>
              <label className='CreatePost-title'>Accept </label>
              <input type="checkbox" name="" value="" onChange={() => { setRememberUser(!rememberUser) }} />
            </div>
            <button className='CreatePosts__btn_UpLoad' onClick={uploadPost}>Confirm</button>
          </div>
        </div>
      )
    } else {
      body = (<>
        <div className='loading'>Currently there is no category to create a post</div>
      </>)
    }
  } else {
    body = (<div>Loading...</div>)
  }

  return (body)
}

export default EditPost