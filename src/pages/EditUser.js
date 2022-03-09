import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

const EditUser = () => {

    const navigate = useNavigate()
    const [Email, setEmail] = useState('')
    const [Role, setRole] = useState('staff')
    const [RoleAuth, setRoleAuth] = useState('')
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
                            setEmail(result.data.email)
                            setRole(result.data.role)
                            setRoleAuth(result.roleAuth);
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
        //FUn Del
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("email", Email);
        urlencoded.append("role", Role);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch("http://localhost:5000" + window.location.pathname, requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    //html
    let body

    if (Loading) {
        if (RoleAuth === 'admin') {
            body = (
                <div>
                    <input type='email' onChange={e => setEmail(e.target.value)} value={Email} />
                    <div>
                        <label>Role User:</label>
                        <select value={Role} onChange={e => setRole(e.target.value)}>
                            <option value='staff'>Staff</option>
                            <option value='qa-manager'>QA Manager</option>
                            <option value='admin'>Admin</option>
                        </select>
                    </div>
                    <button onClick={updateUser}>Xac Nhan</button>
                </div>
            )
        } else {
            body = (
                <div>
                    <input type='email' onChange={e => setEmail(e.target.value)} value={Email} />
                    <div>
                        <label>Role User:</label>
                        <select value={Role} onChange={e => setRole(e.target.value)}>
                            <option value='staff'>Staff</option>
                        </select>
                    </div>
                    <button onClick={updateUser}>Xac Nhan</button>
                </div>
            )
        }
    } else {
        body = (
            <div>Loading...</div>
        )
    }

    return (body)
}

export default EditUser