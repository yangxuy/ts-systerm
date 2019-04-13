import axios from 'axios';

type Methods = 'get' | 'put' | 'post' | 'delete' | string
const ajax = (method: string, url: string, data?: any) => {  //暴露 request 给我们好API 管理
    method = method.toLocaleLowerCase();   //封装RESTful API的各种请求方式 以 post get delete为例
    if (method === 'post') {
        return axios.post(url, data);    //axios的post 默认转化为json格式
    } else if (method === 'put') {
        return axios.put(url, data);
    } else if (method === 'get') {
        return axios.get(url, {
            params: data
        });
    } else if (method === 'delete') {
        return axios.delete(url + '/' + data);
    } else {
        return axios.get(url);
    }
};

export const imgSend = (methods: Methods, data: any) => ajax(methods, '/file/upload', data)

export const goodsSortManage = (methods: Methods, data?: any) => ajax(methods, '/api/type', data); // 商品分类
export const goodsBrandManage = (methods: Methods, data?: any) => ajax(methods, '/api/brand', data); // 商品品牌
export const goodsManage = (methods: Methods, data?: any) => ajax(methods, '/api/goods', data); // 商品
export const goodsGetManage = (methods: Methods, data?: any) => ajax(methods, '/api/goods/list', data); // 商品获取2
export const goodsAttribute = (methods: Methods, data?: any) => ajax(methods, '/api/property', data); // 商品属性
export const goodsGetAttribute = (methods: Methods = 'post', data?: any) => ajax(methods, '/api/property/list', data); // 商品属性获取
export const goodsProperty = (methods: Methods, data?: any) => ajax(methods, '/api/property', data); // 商品参数
export const goodsGetProperty = (methods: Methods='post', data?: any) => ajax(methods, '/api/property', data); // 商品参数
