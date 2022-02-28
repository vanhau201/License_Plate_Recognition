import React, { useEffect, useState } from 'react';
import "../styles/RightSideHome.css"
import ReactPaginate from 'react-paginate';
import Apis, { endpoints } from '../configs/Apis';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from './Modal';

function RightSideHome({ licensePlate }) {
    const tokens = useSelector(state => state.authTokens)
    const [data, setData] = useState([])
    const [display, setDisplay] = useState("all")
    const [search, setSearch] = useState()
    const [totalPage, setTotalPage] = useState()
    const [page, setPage] = useState()
    const [dataRepair, setDataRepair] = useState()





    const loadData = async () => {
        let params
        if (page) {
            params = `?page=${page}&display=${display}`
        } else {
            params = `?display=${display}`
        }
        if (search) {
            params = `?display=${display}&search=${search}`
        }

        const res = await Apis.get(endpoints['listLicensePlate'] + params, {
            headers: {
                "Authorization": `Bearer ${tokens.access}`
            }
        })
        setData(res.data.results)
        setTotalPage(res.data.total_pages)

    }


    // load data
    useEffect(() => {

        loadData()
    }, [display, search, page, licensePlate])


    const handleSearch = (e) => {
        e.preventDefault()
        setSearch(e.target[0].value)

    }

    const handleClickPaginate = (e) => {
        setPage(e.selected + 1)
    }

    const handleDelete = async (id) => {
        try {
            const res = await Apis.delete(endpoints['delete'](id), {
                headers: {
                    "Authorization": `Bearer ${tokens.access}`
                }
            })
            if (res.status === 200) {
                loadData()
                toast.success("Delete success !")

            }
        }
        catch {
            toast.error("Error !")
        }

    }

    const handleRepair = (status) => {
        if (status === 200) {
            loadData()
            toast.success("Repair success !")
        }
    }
    return (
        <>
            <div className="filter row mb-2">
                <div className='col-md-5'>
                    <label className='mr-1' htmlFor="">Data display: </label>
                    <select id="selectData" onChange={(e) => setDisplay(e.target.value)}>
                        <option value="all">All</option>
                        <option value="today">Today</option>
                    </select>
                </div>
                <div className='col-md-7 search'>
                    <form action="" onSubmit={handleSearch}>
                        <input id="txtSearch" name='search' type="text" placeholder="Enter license plate number ..." />
                        <button id='btnSearch' type='submit'><i className="fas fa-search"></i></button>
                    </form>

                </div>
            </div>

            <div>
                <table className="table table-bordered">
                    <thead className="thead-dark">
                        <tr className="d-flex abc">
                            <th className="col-1" scope="col"></th>
                            <th className="col-2 text-center" scope="col">Image</th>
                            <th className="col-2 text-center" scope="col">Result</th>
                            <th className="col-1 text-center" scope="col">Status</th>
                            <th className="col-4 text-center" scope="col">Time</th>
                            <th className="col-2 text-center" scope="col">Function</th>
                        </tr>
                    </thead>
                    <tbody id="scroll_table">

                        {
                            data.map((d, index) => (
                                <tr className="d-flex" key={d.id}>
                                    <td className="col-1">{index + 1}</td>
                                    <td className="col-2">
                                        <img src={d.image}
                                            alt="Error" />
                                    </td>
                                    <td className="col-2">{d.result}</td>
                                    <td className="col-1">{d.status ? "True" : "False"}</td>
                                    <td className="col-4">{d.created_date}</td>
                                    <td className="col-2">
                                        <button id="btnRepair" data-toggle="modal" data-target="#staticBackdrop" onClick={() => setDataRepair(d)}><i className="fas fa-tools"></i></button>
                                        <button id="btnRemove" onClick={() => handleDelete(d.id)}><i className="far fa-trash-alt"></i></button>
                                    </td>
                                </tr>
                            ))
                        }



                    </tbody>
                </table>


            </div>

            <div className='pagination'>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="&raquo;"
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}

                    pageCount={totalPage}
                    previousLabel="&laquo;"
                    containerClassName="pagination"
                    pageClassName="page-item mr-2"
                    pageLinkClassName="page-link"
                    previousClassName="page-item mr-2"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakClassName="page-item mr-2"
                    breakLinkClassName="page-link"
                    activeClassName="active"
                    onPageChange={handleClickPaginate}
                />
            </div>

            {dataRepair ? <Modal data={dataRepair} onRepair={handleRepair} /> : ""}



            <ToastContainer />
        </>
    )

}

export default RightSideHome;
