import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'

// Create an axios instance
const service = axios.create({
  baseURL: process.env.DATABASE_API, // Api's base_url
  timeout: 50000 // Request timeout
})

// Request timeout
service.interceptors.request.use(config => { 
  return config
}, error => {
  // Do something with request error
  console.log('Error in token:' + error) // for debug
  Promise.reject(error)
})

// respone Interceptor
service.interceptors.response.use(
  response => {
  /**
  * Code is non-20000 is a mistake can be combined with their own business to modify
  */
    const res = response.data
    console.log('Code:' + res.code)
    res.code = 20000
    console.log('Code:' + res.code)
    if (res.code !== 20000) {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'OK logout', {
          confirmButtonText: 'Re-register',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// In order to re-instantiate the vue-router object to avoid bugs
          })
        })
      }
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
