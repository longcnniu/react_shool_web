import React, { useState } from 'react'
import { apiUrl } from '../contexts/constants';
import { useNavigate } from "react-router-dom";

function UpdataComment() {

    const navigate = useNavigate()
    const [inputComment, setinputComment] = useState('')

    //Updata Comment
    const UpdataComment = () => {
        //đoc cookie
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('accessToken='))
            .split('=')[1];
        var myHeaders = new Headers();
        myHeaders.append("token", cookieValue);
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("comment", inputComment);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        const id = (window.location.pathname).split('/')
        fetch(`${apiUrl}/updata-comment/${id[2]}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    navigate(-1);
                } else {
                    alert(result.message)
                }
            })
            .catch(error => console.log('error', error));
    }

    let body
    body = (
        <div>
            <div>Edit Comment</div>
            <label>Comment</label>
            <input type='text' onChange={e => setinputComment(e.target.value)}></input>
            <button onClick={UpdataComment} >Confirm</button>
        </div>
    )

    return (body)
}

export default UpdataComment