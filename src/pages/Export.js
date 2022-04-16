import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { apiUrl } from '../contexts/constants';
import { useNavigate } from "react-router-dom";

const Export = () => {

    const [Loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [Data, setData] = useState([])
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

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`${apiUrl}/post-category?category=${Category}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    for (let index = 0; index < result.data.length; index++) {
                        result.data[index].NameImg = `${apiUrl}/get-img?nameImg=${result.data[index].NameImg}`
                        setData(result.data)
                    }
                }
            })
            .catch(error => console.log('error', error));
    }, [Category])

    const ex = () => {
        var wb = XLSX.utils.book_new(),
            ws = XLSX.utils.json_to_sheet(Data)

        XLSX.utils.book_append_sheet(wb, ws, 'MySheet1')

        XLSX.writeFile(wb, 'MyExcel.xlsx');
    }

    let body
    const listCategory = AllCategory.map(data => (
        <option key={data._id} value={data.title}>{data.title}</option>))
    if (Loading) {
        body = (
            <>
                <div>Export</div>
                <div>
                    <label>Category</label>
                    <select onChange={e => setCategory(e.target.value)}>
                        <option value=''></option>
                        {listCategory}
                    </select>
                </div>
                <button onClick={ex}>Export File</button>
            </>
        )
    } else {
        body = (<>
            <div className='loading'>Currently there is no category to create a post</div>
        </>)
    }

    return (body)
}

export default Export