import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const EditCategory = () => {
    const navigate = useNavigate()
    const [title, settitle] = useState('')
    const [endDate, setendDate] = useState('')
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

                fetch(`${apiUrl}` + window.location.pathname, requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            settitle(result.data.title)
                            setendDate(result.data.endDate)
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
        urlencoded.append("endDate", endDate)

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`${apiUrl}` + window.location.pathname, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));

    }

    const a = new Date(endDate).toLocaleString().split('/').join(',').split(', ').join(',').split(':').join(',').split(' ').join(',').split(',')
    if(a[0] < 10) {
        a[0] = `0${a[0]}`
    }
    if(a[1] < 10) {
        a[1] = `0${a[1]}`
    }
    if(a[3] < 10) {
        a[3] = `0${a[3]}`
    }
    if(a[4] < 10) {
        a[4] = `0${a[4]}`
    }
    //html
    let body

    if (Loading) {
        
        body = (
            <div>
                <label>Title</label>
                <input type='text' onChange={e => settitle(e.target.value)} value={title} />
                <label>Ngay het hang: </label>
                <input type='datetime-local' onChange={e => setendDate(e.target.value)} value={`${a[2]}-${a[0]}-${a[1]}T${a[3]}:${a[4]}:${a[5]}`}/>
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