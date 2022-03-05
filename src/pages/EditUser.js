import React, { useEffect, useState } from 'react'

const EditUser = () => {

    const [Email, setEmail] = useState('')
    const [Role, setRole] = useState('')

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("http://localhost:5000"+ window.location.pathname, requestOptions)
            .then(response => response.json())
            .then(result => {
                if(result.success){
                    setEmail(result.data.email)
                    setRole(result.data.role)
                }                
            })
            .catch(error => console.log('error', error));
    }, [])


    const updateUser = () => {
        var myHeaders = new Headers();
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

    return (
        <div>
            <input type='email' onChange={e => setEmail(e.target.value)} value={Email} />
            <input type='text' onChange={e => setRole(e.target.value)} value={Role}/>
            <button onClick={updateUser}>Xac Nhan</button>
        </div>
    )
}

export default EditUser