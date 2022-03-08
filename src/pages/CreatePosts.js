import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const CreatePosts = () => {

    const [Loading, setLoading] = useState(false)
    const navigate = useNavigate()
    //Input
    const [Title, setTitle] = useState('')
    const [Content, setContent] = useState('')
    const [Category, setCategory] = useState('')
    const [AllCategory, setAllCategory] = useState([])

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

                return fetch("https://salty-brook-05753.herokuapp.com/post", requestOptions)
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
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        return fetch("https://salty-brook-05753.herokuapp.com/all-category", requestOptions)
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
        //fun POST
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("title", Title);
        urlencoded.append("content", Content);
        urlencoded.append("category", Category);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("https://salty-brook-05753.herokuapp.com/post", requestOptions)
            .then(response => response.json())
            .then(result => console.log(result.message))
            .catch(error => console.log('error', error));
    }

    //html
    let body

    if (Loading) {
        const listCategory = AllCategory.map(data => (
            <option key={data._id} value={data.title}>{data.title}</option>
        ))
        body = (
            <div>
                <h3>POST Bai Viet</h3>
                <div>
                    <label>Title</label>
                    <input type='text' name='title' onChange={e => setTitle(e.target.value)} />
                </div>
                <div>
                    <label>Content</label>
                    <textarea onChange={e => setContent(e.target.value)} name="w3review" rows="4" cols="50" />
                </div>
                <div>
                    <label>Category</label>
                    <select value={Category} onChange={e => setCategory(e.target.value)}>
                        {listCategory}
                    </select>
                </div>
                <div>
                    <label>Dong y dieu khoan</label>
                    <input type="checkbox" name="vehicle1" value="Bike" />
                </div>
                <button onClick={uploadPost}>Xac Nhan</button>
            </div>
        )
    } else {
        body = (
            <div>Loading...</div>
        )
    }

    return (body)
}

export default CreatePosts