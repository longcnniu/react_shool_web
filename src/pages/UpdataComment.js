import React, { useState } from 'react'
import { apiUrl } from '../contexts/constants';
import { useNavigate } from "react-router-dom";

function UpdataComment() {

    const navigate = useNavigate()
    const [Loading, setLoading] = useState(true)
    const [inputComment, setinputComment] = useState('')

    //Updata Comment
    const UpdataComment = () => {
        var myHeaders = new Headers();
        myHeaders.append("token", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MjQ3ZTJiZWIxZWUyODlkOTkwZTdiNjciLCJlbWFpbCI6Imx1dWhvYW5nbG9uZzIxQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJBZG1pbiBMb25nIiwiZGVwYXJ0bWVudCI6IklUIiwiaWF0IjoxNjQ5Njg5MzUwLCJleHAiOjE2NDk3NzU3NTB9.7Z0-0__Kr4Ocn2_KG8EwpgS51heDSYBGVwJLfY6xe7s");
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
                if(result.success){
                    navigate(-1);
                }else{
                    alert(result.message)
                }
            })
            .catch(error => console.log('error', error));
    }

    let body
    if (Loading) {
        body = (
            <div>
                <div>UpData</div>
                <label>Comment</label>
                <input type='text' onChange={e => setinputComment(e.target.value)}></input>
                <button onClick={UpdataComment} >Xac Nhat</button>
            </div>
        )
    } else {
        body = (
            <div>Loading...</div>
        )
    }

    return (body)
}

export default UpdataComment