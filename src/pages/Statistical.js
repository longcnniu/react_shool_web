import '../css/statistical.css'
import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { apiUrl } from '../contexts/constants';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

/// Long ngu
const Statistical = () => {

    const [DataDe_id, setDataDe_id] = useState([])
    const [tyChart, settyChart] = useState('0')
    
   //SSSS

    useEffect(() => {
        const tagChart = ['ideas', 'Percent', 'comment']
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(`${apiUrl}/statistical/${tagChart[tyChart]}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    setDataDe_id(result);
                }
            })
            .catch(error => console.log('error', error));
    }, [tyChart])


    const [chartData, setChartData] = useState({
        datasets: [],
    });

    const [chartOptions, setChartOptions] = useState({});

    useEffect(() => {
        const titleChart = ['Ideas theo Department','% ideas theo Department','số người đang content theo Department']
        setChartData({
            labels: ["IT", "Business", "Design", "Marketing"],
            datasets: [
                {
                    label: titleChart[tyChart],
                    data: [DataDe_id.dataIT, DataDe_id.dataBU, DataDe_id.dataDe, DataDe_id.dataMa],
                    borderColor: [
                        'rgba(54, 162, 235, 1)',
                    ],
                    backgroundColor: [
                        'rgba(54, 162, 235, 0.2)',
                    ]
                },
            ],
        });
        setChartOptions({
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                },
                title: {
                    display: true,
                    text: titleChart[tyChart],
                },
            },
        });
    }, [DataDe_id, tyChart]);

    return (
        <>
            <div className="Statistical-App">
                <div>
                    <label>Sort chart:</label>
                    <select onChange={e => settyChart(e.target.value)}>
                        <option value='0'>Ideas theo Department</option>
                        <option value='1'>% ideas theo Department</option>
                        <option value='2'>số người đang content theo Department</option>
                    </select>
                </div>
                <div className='Statistical-chart'>
                    <Bar options={chartOptions} data={chartData} />
                </div>
            </div>
        </>
    )
}

export default Statistical