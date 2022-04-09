import '../css/CreatePosts.css'
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const CreatePosts = () => {

    const [Loading, setLoading] = useState(false)
    const navigate = useNavigate()
    //Input
    const [Title, setTitle] = useState('')
    const [Content, setContent] = useState('')
    const [Category, setCategory] = useState('')
    const [AllCategory, setAllCategory] = useState([])
    const [photo, setPhoto] = useState('');

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

    //Danwg bai
    const uploadPost = () => {
        //đoc cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            .split('=')[1];
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);
        if (photo === '') {
            var formdata = new FormData();
            formdata.append("title", Title);
            formdata.append("content", Content);
            formdata.append("category", Category);

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: formdata,
                redirect: 'follow'
            };
            fetch(`${apiUrl}/post`, requestOptions)
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
                method: 'POST',
                headers: myHeaders,
                body: formdatas,
                redirect: 'follow'
            }
            fetch(`${apiUrl}/post`, requestOptionss)
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
        }
    }

    //html
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
                            <input type='text' name='title' onChange={e => setTitle(e.target.value)} />
                        </div>
                        <div className='CreatePost-container-inputAll'>
                            <div className='CreatePost-title'>
                                <label>Upload file:</label>
                            </div>
                            <input type="file" onChange={e => setPhoto(e.target.files[0])} />
                        </div>
                        <div className='CreatePost-container-inputAll'>
                            <div className='CreatePost-title'>
                                <label>Content</label>
                            </div>
                            <textarea className='CreatePost-textarea' onChange={e => setContent(e.target.value)} name="w3review" rows="4" cols="50" />
                        </div>
                        <div className='CreatePost-container-inputAll'>
                            <div className='CreatePost-title'>
                                <label>Category</label>
                            </div>

                            <select onChange={e => setCategory(e.target.value)}>
                                <option value=''></option>
                                {listCategory}
                            </select>
                        </div>
                        <div className='CreatePost-container-inputAll'>
                            <label className='CreatePost-title'>Accept </label>
                            <input type="checkbox" name="vehicle1" value="Bike" />
                        </div>
                        <button onClick={uploadPost}>Confirm</button>
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

export default CreatePosts