import { useEffect, useState } from 'react';
import { apiUrl } from '../contexts/constants';

function Dialog({ onDialog, id, title }) {
    console.log(title);

    const [NumberPost, setNumberPost] = useState()

    useEffect(() => {
        //đoc cookie
        const aa = () => {
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

            fetch(`${apiUrl}/Numbercategory?category=${title}`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        setNumberPost(result.data)
                    }
                })
                .catch(error => console.log('error', error));
        }
        aa()
    }, [title])


    const del = () => {
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
        urlencoded.append("category", title);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        fetch(`${apiUrl}/category/` + id, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                if (result.success) {
                    if (result.success) {
                        onDialog(true)
                    } else {
                        alert(result.message)
                    }
                }
            })
            .catch(error => console.log('error', error));
    }

    return (
        <div
            style={{
                position: "fixed",
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                backgroundColor: "rgba(0,0,0,0.5)"
            }}
            onClick={() => onDialog(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px"
                }}
            >
                <h3 stlye={{ color: "blue", fontSize: "24px" }}>Notification</h3>
                <h1 style={{ color: "#111", fontSize: "18px" }}>Currently this category has {NumberPost} pops are you sure you want to delete?</h1>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <button
                        onClick={del}
                        style={{
                            background: "red",
                            color: "white",
                            padding: "10px",
                            marginRight: "4px",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Yes
                    </button>
                    <button
                        onClick={() => onDialog(false)}
                        style={{
                            background: "green",
                            color: "white",
                            padding: "10px",
                            marginLeft: "4px",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        No
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Dialog;
