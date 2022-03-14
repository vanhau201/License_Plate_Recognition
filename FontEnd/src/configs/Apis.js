import axios from "axios";

export let endpoints = {
    "token": "api/token/",
    "register": "api/register/",
    "listLicensePlate": "api/list-license-plate/",
    "checkIn": "api/checkin/",
    "checkOut": "api/checkout/",
    "updateCheckIn": "api/update-checkin/",
    "updateCheckOut": "api/update-checkout/",
    "delete": (id) => `api/delete/${id}/`,
    "update": (id) => `api/update/${id}/`,
    "statistics": "api/statistics/"
}

export default axios.create({
    baseURL: "http://127.0.0.1:8000/"
})