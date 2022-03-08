import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const EditCategory = () => {
    const navigate = useNavigate()
    const [title, settitle] = useState('')
    const [Loading, setLoading] = useState(false)

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
                }

                fetch("http://localhost:5000" + window.location.pathname, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            settitle(result.data.title)
                            setLoading(true)
                        } else {
                            setLoading(true)
                            navigate('/')
                        }
                    })
                    .catch(error => console.log('error', error));
            } else {
                navigate('/login')
            }
        }
        checkAuth()
    }, [navigate])

    const updateUser = () => {
        //đoc cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            .split('=')[1];
        //Gửi req token lên server xác thực
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("title", title);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://localhost:5000/category"+ window.location.pathname, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

    }
    //html
    let body

    if (Loading) {
        body = (
            <div>
                <input type='text' onChange={e => settitle(e.target.value)} value={title} />
                <button onClick={updateUser}>Xac Nhan</button>
            </div>
        )
    } else {
        body = (
            <div>Loading...</div>
        )
    }

    return (body)
}

export default EditCategory