import React, { useEffect, useState } from 'react'
import "../styles/Statistics.css"
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    BarElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';
import Apis, { endpoints } from '../configs/Apis';
import { useSelector } from 'react-redux';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

const Statistics = () => {
    const tokens = useSelector(state => state.authTokens)
    const [data, setData] = useState({})
    const [year, setyear] = useState()
    useEffect(() => {
        const callStatistics = async () => {
            const res = await Apis.get(endpoints['statistics'], {
                headers: {
                    "Authorization": `Bearer ${tokens.access}`
                }
            })
            setData(res.data)
            setyear(Object.keys(res.data.bar_chart).reverse()[0])
        }
        callStatistics()
    }, [tokens])


    const dataLine = {
        labels: data.line_chart && Object.keys(data.line_chart),
        datasets: [
            {
                data: data.line_chart && Object.values(data.line_chart),
                borderColor: ['rgb(255, 99, 132)'],

            },
        ],
    };

    const optionsLine = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            yAxes: {
                title: {
                    display: true,
                    text: "Quantity",
                    font: {
                        size: 14
                    }
                },
            },
            xAxes: {
                title: {
                    display: true,
                    text: "Day",
                    font: {
                        size: 14
                    }
                }
            }
        },
    };

    const dataBar = {
        labels: data.bar_chart && data.bar_chart[year] && Object.keys(data.bar_chart[year]),
        datasets: [
            {
                data: data.bar_chart && data.bar_chart[year] && Object.values(data.bar_chart[year]),
                backgroundColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(45, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(64, 205, 86, 1)',
                    'rgba(12, 55, 192, 1)',
                    'rgba(100, 45, 22, 1)',
                    'rgba(45, 44, 5, 1)',

                ],
            },
        ],
    };



    const optionsBar = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        scales: {
            yAxes: {
                title: {
                    display: true,
                    text: "Quantity",
                    font: {
                        size: 14
                    }
                },
            },
            xAxes: {
                title: {
                    display: true,
                    text: "Month",
                    font: {
                        size: 14
                    }
                }
            }
        },
    };



    return (
        <div className='statistics'>

            <div className='container'>
                <div className='statistics__header'>
                    <div className="row">
                        <div className="col-sm-6 col-md-6 col-lg-3">
                            <div className='statistics__header-card card1'>
                                <h5>Number of motorbikes is sending</h5>
                                <p>{data.quantity_true} <i className='fas fa-motorcycle'></i></p>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3">
                            <div className='statistics__header-card card2'>
                                <h5>Number of motorbikes today</h5>
                                <p>{data.quantity_today} <i className='fas fa-motorcycle'></i></p>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3">
                            <div className='statistics__header-card card3'>
                                <h5>Number of motorbikes this month</h5>
                                <p>{data.quantity_month} <i className='fas fa-motorcycle'></i></p>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3">
                            <div className='statistics__header-card card4'>
                                <h5>Number of motorbikes in this year</h5>
                                <p>{data.quantity_year} <i className='fas fa-motorcycle'></i></p>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='statistics__chart'>

                    <div className='row'>
                        <div className='col-md-12 col-lg-6'>
                            <h5>Statistics of motorbikes sent in the past 7 days</h5>
                            <Line
                                data={dataLine}
                                options={optionsLine}
                                height={180}
                            />
                        </div>

                        <div className='col-md-12 col-lg-6'>
                            <h5>Statistics of motorbikes sent monthly in the last 3 years</h5>
                            <div className='selectChart'>
                                <span>Choose year : </span>
                                <select name="" id="" onChange={(e) => setyear(e.target.value)}>

                                    {
                                        data.bar_chart && Object.keys(data.bar_chart).reverse().map((year, index) => <option key={index} value={year}>{year}</option>)
                                    }
                                </select>
                            </div>
                            <Bar
                                data={dataBar}
                                options={optionsBar}
                                height={180}
                            />
                        </div>



                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statistics
