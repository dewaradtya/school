import axios from "axios";
import toast from "react-hot-toast";

const AxiosClient = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true,
    withXSRFToken: true,
})

AxiosClient.interceptors.response.use(function (response) {
    return response
}, function (error) {
    if (error.response.status === 500) {
        toast.error(error.response.statusText)
    } else if (error.response.status === 401) {
        toast.error(error.response.data.message)
        toast.loading('Redirecting...')
        setTimeout(() => {
            toast.dismiss()
            window.location.href = '/auth/signin'
        }, 3000);
    } else {
        toast.error(error.response.data.message)
    }
    return Promise.reject(error)
})

export default AxiosClient