import React, { useEffect, useState } from 'react'
import "../styles/Modal.css"
import { useSelector } from 'react-redux'
import Apis, { endpoints } from '../configs/Apis'


function Modal({ data, onRepair }) {

    const [result, setResult] = useState()
    const [status, setStatus] = useState()

    useEffect(() => {
        setResult(data.result)
        setStatus(data.status)
    }, [data])

    console.log(result, status)

    const tokens = useSelector(state => state.authTokens)

    const handleSubmit = async () => {
        console.log(data.id)
        try {
            console.log("ok")
            const res = await Apis.put(endpoints['update'](data.id), {
                "result": result,
                "status": status
            },
                {
                    headers: {
                        "Authorization": `Bearer ${tokens.access}`
                    }
                })
            if (res.status === 200) {
                onRepair(200)
                document.querySelector(".btn-secondary").click()
            }
        }
        catch {

        }
        // document.querySelector(".btn-secondary").click()
    }

    return (

        <div className="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabIndex="-1"
            aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="staticBackdropLabel">Repair</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <table id="tableRepair" className="table table-bordered">
                            <thead className="thead-dark">
                                <tr className="d-flex abc">
                                    <th className="col-1" scope="col"></th>
                                    <th className="col-2 text-center" scope="col">Image</th>
                                    <th className="col-2 text-center" scope="col">Result</th>
                                    <th className="col-2 text-center" scope="col">Status</th>
                                    <th className="col-2 text-center" scope="col">Confidence</th>
                                    <th className="col-3 text-center" scope="col">Time</th>
                                </tr>
                            </thead>
                            <tbody>


                                <tr className="d-flex">
                                    <td className="col-1">1</td>
                                    <td className="col-2">
                                        <img src={data.image} alt="" />
                                    </td>
                                    <td className="col-2">
                                        <input className='txtResult' type="text" value={result || ""} onChange={(e) => setResult(e.target.value)} />
                                    </td>
                                    <td className="col-2">
                                        <select className="selectStatus" value={status} onChange={(e) => setStatus(e.target.value)}>
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    </td>
                                    <td className="col-2">{data.confidences + " %"}</td>
                                    <td className="col-3">{data.created_date}</td>
                                </tr>



                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">


                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Save</button>

                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal