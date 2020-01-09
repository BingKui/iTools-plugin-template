// 接口调用封装
import axios from 'axios';
let cancel, promiseArr = {};
const CancelToken = axios.CancelToken;

// 设置基础路径
// axios.defaults.baseURL = '';
// 设置失效时间
axios.defaults.timeout = 10000;
//请求拦截器
axios.interceptors.request.use(config => {
    //发起请求时，取消掉当前正在进行的相同请求
    if (promiseArr[config.url]) {
        promiseArr[config.url]('操作取消');
        promiseArr[config.url] = cancel;
    } else {
        promiseArr[config.url] = cancel;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
    const { code, message } = response.data;
    if (code) {
        console.error('发生错误：', code, message);
        return false;
    }
    return response;
}, err => {
    if (err && err.response) {
        switch (err.response.status) {
        case 400:
            err.message = '错误请求';
            break;
        case 401:
            err.message = '未授权，请重新登录';
            break;
        case 403:
            err.message = '拒绝访问';
            break;
        case 404:
            err.message = '请求错误,未找到该资源';
            break;
        case 405:
            err.message = '请求方法未允许';
            break;
        case 408:
            err.message = '请求超时';
            break;
        case 500:
            err.message = '服务器端出错';
            break;
        case 501:
            err.message = '网络未实现';
            break;
        case 502:
            err.message = '网络错误';
            break;
        case 503:
            err.message = '服务不可用';
            break;
        case 504:
            err.message = '网络超时';
            break;
        case 505:
            err.message = 'http版本不支持该请求';
            break;
        default:
            err.message = `连接错误${err.response.status}`;
        }
        console.error(err.message);
    } else if (!cancel) {
        err.message = '连接到服务器失败';
        console.error(err.message);
    }
    return Promise.reject(err);
});

const ajaxRequest = (method, url, param) => {
    return new Promise((resolve, reject) => {
        axios({
            method,
            url,
            params: {
                ...param,
            },
            cancelToken: new CancelToken(c => {
                cancel = c;
            })
        }).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error);
        });
    });
};

export const get = async (url, param) => {
    return await ajaxRequest('get', url, param);
};

export const post = async (url, param) => {
    return await ajaxRequest('post', url, param);
};

export const put = async (url, param) => {
    return await ajaxRequest('put', url, param);
};

export const del = async (url, param) => {
    return await ajaxRequest('delete', url, param);
};

export const patch = async (url, param) => {
    return await ajaxRequest('patch', url, param);
};
