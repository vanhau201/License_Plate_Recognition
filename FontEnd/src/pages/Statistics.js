import React from 'react'
import "../styles/Statistics.css"
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    BarElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

const dataLine = {
    labels: ['20/11', '21/11', '22/11', '23/11', '24/11', '25/11', '26/11'],
    datasets: [
        {
            data: [1, 2, 7, 5, 2, 7, 10],
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
    labels: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    datasets: [
        {
            label: 'Dataset 1',
            data: [1, 2, 5, 5, 4, 5, 6, 8, 9, 10, 11, 12],
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





const Statistics = () => {

    return (
        <div className='statistics'>

            <div className='container'>
                <div className='statistics__header'>
                    <div className="row">
                        <div className="col-sm-6 col-md-6 col-lg-3">
                            <div className='statistics__header-card card1'>
                                <h5>Number of motorbikes is sending</h5>
                                <p> 2 <i className='fas fa-motorcycle'></i></p>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3">
                            <div className='statistics__header-card card2'>
                                <h5>Number of motorbikes today</h5>
                                <p> 2 <i className='fas fa-motorcycle'></i></p>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3">
                            <div className='statistics__header-card card3'>
                                <h5>Number of motorbikes this month</h5>
                                <p> 2 <i className='fas fa-motorcycle'></i></p>
                            </div>
                        </div>
                        <div className="col-sm-6 col-md-6 col-lg-3">
                            <div className='statistics__header-card card4'>
                                <h5>Number of motorbikes in this year</h5>
                                <p> 2 <i className='fas fa-motorcycle'></i></p>
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
                                <select name="" id="">
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
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
