import axios from 'axios';

import LocalStorageService from "../service/localStorageService";

const instance = axios.create({
    baseURL: "http://localhost:8080",
    // baseURL: process.env.REACT_APP_BACKEND_ENDPOINT,
    headers: {
        "Access-Control-Allow-Origin": "*"
    },
});

instance.interceptors.request.use(
    config => {
        const token = LocalStorageService.getToken();
        if(token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    }, error => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    response => {
        if(response.headers.authorization !== undefined) {
            LocalStorageService.setToken(response.headers.authorization);
        }
        return response
    }, error => {
        if(error.response !== undefined && ((error.response.status === 403 && error.response.config.url !== '/login')
            || error.response.data.exception === 'com.auth0.jwt.exceptions.TokenExpiredException')) {
            LocalStorageService.clearToken();
            LocalStorageService.clearRole();
            LocalStorageService.clearIdentifier();
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default instance;
