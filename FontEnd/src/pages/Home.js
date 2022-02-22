import React, { useState } from 'react';
import "../styles/Home.css"
import LeftSideHome from '../components/LeftSideHome';
import RightSideHome from '../components/RightSideHome';


function Home() {
    const [data, setData] = useState()
    const getData = (data) => {
        setData(data)
    }

    return (
        <div className='main'>
            <div className="row">
                <div className="col-lg-5 col-md-12 col-sm-12">
                    <LeftSideHome sendData={getData} />
                </div>
                <div className="col-lg-7 col-md-12 col-sm-12">
                    <RightSideHome licensePlate={data} />
                </div>
            </div>

        </div>

    )
}

export default Home;
