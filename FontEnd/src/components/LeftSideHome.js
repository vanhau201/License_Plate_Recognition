import React from 'react';
import "../styles/LeftSideHome.css"
import { useState, useRef } from 'react';
import Apis, { endpoints } from '../configs/Apis';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function LeftSideHome({ sendData }) {

    const [checkStatus, setCheckStatus] = useState(true)
    const videoRef = useRef(null)
    const tokens = useSelector(state => state.authTokens)
    const [time, setTime] = useState("daytime")
    const [data, setData] = useState()


    //  Change name button predict
    const handleInput = (e) => {
        setCheckStatus(e.target.value === "checkin" ? true : false)
    }

    // Load video
    const handleLoadVideo = (e) => {
        const video = videoRef.current
        video.src = URL.createObjectURL(e.target.files[0])
    }

    // open webcam
    const handleOpenWebCam = () => {

        navigator.mediaDevices.getUserMedia({
            video:
                true
        }).then(stream => {
            const video = videoRef.current
            video.srcObject = stream;
            video.play();
        }).catch(err => {
            console.error(err)
        })

    }

    // stop video/webcam
    const handleStopWebCam = () => {
        const video = videoRef.current


        if (video.srcObject != null) {
            video.srcObject.getTracks()[0].stop()
            video.srcObject = null;
            video.pause();
        }

    }

    // capture video
    const captureVideo = () => {
        const video = videoRef.current
        // const img = new Image()
        // img.crossOrigin = 'Anonymous'
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        // for drawing the video element on the canvas

        let base64 = canvas.toDataURL();
        base64 = base64.split("base64,")[1]
        return base64
    }




    // hàm predict xe vào và xe ra
    const handlePredict = async () => {

        const base64 = captureVideo()
        if (base64) {
            // xe vào
            if (checkStatus) {
                try {
                    const res = await Apis.post(endpoints['checkIn'], {
                        "base64": base64,
                        "type": time
                    }, {
                        headers: {
                            "Authorization": `Bearer ${tokens.access}`
                        }
                    })
                    if (res.status === 201) {
                        sendData(res.data)
                        setData(res.data)
                        document.getElementById("txtResult").value = res.data.result
                        toast.success("Check in success !")
                    }
                    // 

                } catch (error) {
                    if (error.response.status === 400) {
                        toast.error("Unknown license plate image !")
                    }
                    if (error.response.status === 401) {
                        toast.error("License plate images are available !")
                    }
                }

            }
            // xe ra
            else {
                try {
                    const res = await Apis.post(endpoints['checkOut'], {
                        "base64": base64,
                        "type": time
                    }, {
                        headers: {
                            "Authorization": `Bearer ${tokens.access}`
                        }
                    })
                    if (res.status === 200) {
                        sendData(res.data)
                        document.getElementById("txtResult").value = res.data.result
                        toast.success("Check out success !")
                    }
                    // 

                } catch (error) {
                    if (error.response.status === 404) {
                        setData(error.response.data)
                        document.getElementById("txtResult").value = error.response.data.result
                        toast.error("Not found !")
                    }
                    if (error.response.status === 400) {
                        toast.error("Unknown license plate image !")
                    }
                }
            }


        }

    }

    // update bien so sai
    const handleUpdate = async () => {
        // update checkin
        if (checkStatus) {
            try {
                const result = document.getElementById("txtResult").value
                if (data && result) {
                    const res = await Apis.put(endpoints['updateCheckIn'], {
                        "id": data.id,
                        "result": result
                    }, {
                        headers: {
                            "Authorization": `Bearer ${tokens.access}`
                        }
                    })

                    if (res.status === 200) {
                        sendData(res.data)
                        toast.success("Update check in success !")
                    }
                }

            }
            catch (error) {
                toast.error("Not found !")
            }
        }
        // update checkout
        else {

            try {
                const result = document.getElementById("txtResult").value
                if (data && result) {
                    const res = await Apis.put(endpoints['updateCheckOut'], {
                        "result": result
                    }, {
                        headers: {
                            "Authorization": `Bearer ${tokens.access}`
                        }
                    })

                    if (res.status === 200) {
                        sendData(res.data)
                        toast.success("Update check in success !")
                    }
                }

            }
            catch (error) {
                toast.error("Not found !")
            }

        }

    }

    return (
        <>
            <div className='mb-1'>
                <input id="fileVideo" type="file" onChange={handleLoadVideo} />
                <label id="btnLoadVideo" htmlFor="fileVideo">Load Video</label>
                <button id="btnStartWebCam" onClick={handleOpenWebCam}>Start Webcam</button>
                <button id="btnStopWebCam" onClick={handleStopWebCam}>Stop Webcam</button>
            </div>
            <div className="mb-3">
                <video id="video" ref={videoRef} controls preload="metadata"></video>
            </div>
            <div className='row mb-3'>
                <div className="col-md-5">
                    <img id="imageBienso"
                        src={data ? data.image : "https://kubalubra.is/wp-content/uploads/2017/11/default-thumbnail.jpg"} alt="" />
                    <div className="mt-1">

                        <div className='txtConfidence'>{data ? "Confidence " + data.confidences + "%" : "Confidence 0%"}</div>
                    </div>
                </div>
                <div className="col-md-7">


                    <div className="form-check form-check-inline">
                        <input id="rdoCheckin" className="form-check-input check" type="radio" name="radio"
                            value="checkin" defaultChecked onInput={handleInput}></input>
                        <label className="form-check-label" htmlFor="rdoCheckin">Check in</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input id="rdoCheckout" className="form-check-input check" type="radio" name="radio"
                            value="checkout" onInput={handleInput} />
                        <label className="form-check-label" htmlFor="rdoCheckout">Check out</label>
                    </div>


                    <div className='mt-2 mb-2'>
                        <select id="selectType" onChange={e => setTime(e.target.value)}>
                            <option value="daytime">Daytime</option>
                            <option value="evening">Evening</option>
                        </select>
                    </div>

                    <div className='mb-3'>

                        <input id="txtResult" type="text" />
                        <button id="btnUpdate" onClick={handleUpdate}>Update</button>
                    </div>

                    <button id="btnPredict" onClick={handlePredict}>{checkStatus ? "Check In" : "Check Out"}</button>


                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default LeftSideHome;
