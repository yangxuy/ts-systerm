export const deepCopy = (obj: any) => {
    const toString = Object.prototype.toString;
    let result: any;
    if (typeof obj !== 'object') {
        return obj;
    }
    if (toString.call(obj).slice(8, -1) === 'Object') {
        result = {};
    }
    if (toString.call(obj).slice(8, -1) === 'Array') {
        result = [];
    }
    for (let key in obj) {
        // @ts-ignore
        result[key] = typeof obj === 'object' ? deepCopy(obj[key]) : obj[key];
    }
    return result;
};