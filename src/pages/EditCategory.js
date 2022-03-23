import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { apiUrl } from '../contexts/constants';

const EditCategory = () => {
    const navigate = useNavigate()
    const [title, settitle] = useState('')
    const [endDate, setendDate] = useState('')
    const [lockDate, setlockDate] = useState('')
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
                            //Get Time End 1
                            const d = new Date(result.data.endDate)
                            setendDate(`${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + (d.getDate())).slice(-2)}T${("0" + (d.getHours())).slice(-2)}:${("0" + (d.getMinutes())).slice(-2)}`)
                            //Get Time End 2
                            const dd = new Date(result.data.lockDate)
                            setlockDate(`${dd.getFullYear()}-${("0" + (dd.getMonth() + 1)).slice(-2)}-${("0" + (dd.getDate())).slice(-2)}T${("0" + (dd.getHours())).slice(-2)}:${("0" + (dd.getMinutes())).slice(-2)}`)
                            //Off loading
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
        //Change loc TO GM T
        //End Date time 1
        var d = new Date(endDate)
        var EndTime = d.getUTCFullYear() + '-' + ("0" + (d.getUTCMonth() + 1)).slice(-2) + '-' + ("0" + (d.getUTCDate())).slice(-2) + 'T' + ("0" + (d.getUTCHours())).slice(-2) + ':' + ("0" + (d.getUTCMinutes())).slice(-2)
        //End DDate Time 2
        var dd = new Date(endDate)
        var LockTime = d.getUTCFullYear() + '-' + ("0" + (dd.getUTCMonth() + 1)).slice(-2) + '-' + ("0" + (dd.getUTCDate())).slice(-2) + 'T' + ("0" + (dd.getUTCHours())).slice(-2) + ':' + ("0" + (dd.getUTCMinutes())).slice(-2)
        //fun
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("title", title);
        urlencoded.append("endDate", EndTime)
        urlencoded.append("lockDate", LockTime)

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

    //html
    let body

    if (Loading) {
        const d = new Date()
        const MinTime = `${d.getFullYear()}-${("0" + (d.getMonth() + 1)).slice(-2)}-${("0" + (d.getDate())).slice(-2)}T${("0" + (d.getHours())).slice(-2)}:${("0" + (d.getMinutes())).slice(-2)}`
        body = (
            <div>
                <div>
                    <label>Title</label>
                    <input type='text' onChange={e => settitle(e.target.value)} value={title} />
                </div>
                <div>
                    <label>Ngay het hang: </label>
                    <input type='datetime-local' onChange={e => setendDate(e.target.value)} value={endDate} min={MinTime} />
                </div>
                <div>
                    <label>Ngay khoa bai: </label>
                    <input type='datetime-local' onChange={e => setlockDate(e.target.value)} value={lockDate} min={MinTime} />
                </div>
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