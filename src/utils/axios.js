import axios from 'axios'


axios.defaults.baseURL = process.env.HOST_URL
// axios.defaults.headers.common['Authorization']=AUTH_TOKEN

export default axios