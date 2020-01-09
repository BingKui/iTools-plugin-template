// cookie 相关方法
import dayjs from 'dayjs';
/**
 * 设置 cookie
 * @param {String} name 名称
 * @param {Any} value 值
 * @param {Number} days 时间：天，默认：1
 */
export const setCookie = (name, value, days=1) => {
    const expiresTimes =  dayjs().add(days, 'days').unix();
    document.cookie = `${name}=${value}; path=/; expires=${expiresTimes}`;
};

/**
 * 获取 cookie 值
 * @param {String} name 名称
 */
export const getCookie = (name) => {
    const cookieString = '; ' + document.cookie;
    const cookies = cookieString.split( '; ' + scene + name + '=' );
    if ( cookies.length === 2 ){
        return cookies.pop().split( ';' ).shift();
    }
    return null;
};

// localstorage 相关方法
/**
 * 保存数据到 LocalStorage Item
 * @param {String} name 名称
 * @param {String|Object|Array|Number} value 值
 * @param {Number} days 有效时间，单位：天，默认：1
 */
export const setInfo = (name, value, days=1) => {
    const outTime = dayjs().add(days, 'days').unix();
    const param = {
        outTime,
        data: value,
    };
    localStorage.setItem(`itools-plugin-${name}`, JSON.stringify(param));
};

/**
 * 获取 LocalStorage Item 的数据
 * @param {String} name 名称
 */
export const getInfo = (name) => {
    const item = JSON.parse(localStorage.getItem(`itools-plugin-${name}`));
    const nowTime = dayjs().unix();
    if (item && (item.outTime >= nowTime)) {
        return item.data;
    }
    return null;
};

/**
 * 清除 LocalStorage Item 的数据
 * @param {String} name 名称
 */
export const clearInfo = (name) => {
    localStorage.removeItem(`itools-plugin-${name}`);
};

// url 相关方法
/**
 * 获取当前 url 的参数对象
 */
export const getUrlParamObject = (url='') => {
    const uri = url ? new URL(decodeURIComponent(url)) : window.location;
    let search = decodeURIComponent(uri.search);
    let result = {};
    if (search) {
        search = search.substring(1, search.length);
        const arr = search.split('&');
        for (let i = 0; i < arr.length; i++) {
            const name = arr[i].split('=')[0];
            const value = arr[i].split('=')[1];
            result[name] = +value === NaN ? value : +value;
        }
    }
    return result;
};

/**
 * 获取 url 地址的参数值
 * @param {String} name 参数名
 * @param {String} url 地址链接
 */
export const getUrlParam = (name, url='') => {
    const paramObject = getUrlParamObject(url);
    return paramObject[name] || null;
};
