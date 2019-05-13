import axios, { AxiosResponse } from 'axios';

type Methods = 'get' | 'put' | 'post' | 'delete' | string
const ajax = (method: string, url: string, data?: any) => {  //暴露 request 给我们好API 管理
  method = method.toLocaleLowerCase();   //封装RESTful API的各种请求方式 以 post get delete为例
  if (method === 'post') {
    return axios.post(url, data).then((res: AxiosResponse<any>) => Promise.resolve(res.data));    //axios的post 默认转化为json格式
  } else if (method === 'put') {
    return axios.put(url, data).then((res: AxiosResponse<any>) => Promise.resolve(res.data));
  } else if (method === 'get') {
    return axios.get(url, {
      params: data
    }).then((res: AxiosResponse<any>) => Promise.resolve(res.data));
  } else if (method === 'delete') {
    return axios.delete(url + '/' + data).then((res: AxiosResponse<any>) => Promise.resolve(res.data));
  } else {
    return axios.get(url + '/' + data).then((res: AxiosResponse<any>) => Promise.resolve(res.data));
  }
};

export const imgSend = (methods: Methods, data: any) => ajax(methods, '/file/upload', data);

const goodsSortManage = (methods: Methods, data?: any) => ajax(methods, '/api/category', data); // 商品分类
const goodsBrandManage = (methods: Methods, data?: any) => ajax(methods, '/api/brand', data); // 商品品牌
const goodsProperty = (methods: Methods, data?: any) => ajax(methods, '/api/property', data); // 商品属性
const goodsAttributeValue = (methods: Methods, data?: any) => ajax(methods, '/api/attributeValue', data); // 商品属性值
const goodsManage = (methods: Methods, data?: any) => ajax(methods, '/api/product', data); // 商品
const goodsAttribute = (methods: Methods, data?: any) => ajax(methods, '/api/attribute', data);
const goodsSku = (method:Methods,data: any) => ajax(method, '/api/product/sku', data); // 添加商品sku

const goodsGetManage = (methods: Methods, data?: any) => ajax(methods, '/api/goods/list', data); // 商品获取2
const goodsGetProperty = (methods: Methods = 'post', data?: any) => ajax(methods, '/api/property/list', data); // 商品属性获取
const goodsGetAttribute = (methods: Methods = 'post', data?: any) => ajax(methods, '/api/attribute/list', data); // 商品参数

export default {
  goodsSortManage,
  goodsBrandManage,
  goodsManage,
  goodsGetManage,
  goodsProperty,
  goodsGetProperty,
  goodsAttribute,
  goodsGetAttribute,
  goodsAttributeValue,
  goodsSku
};