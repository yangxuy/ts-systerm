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

export const equalArray = (arr1: any[], arr2: any[]) => {
  if (arr1 === arr2) {
    return true;
  }

  // 长度不等，不用继续判断
  if (arr1.length !== arr2.length) {
    return false;
  }

  // 判断每个基本数据类型是否一样
  let type1, type2; // 数组每一项的数据类型
  for (let i = 0; i < arr1.length; i++) {
    type1 = type(arr1[i]);
    type2 = type(arr2[i]);

    // 数据类型不一样，无需判断
    if (type1 !== type2) {
      return false;
    }

    if (type1 === 'Array') {
      if (!equalArray(arr1[i], arr2[i])) {
        return false;
      }

    } else if (type1 === 'Object') {
      if (!equalObject(arr1[i], arr2[i])) {
        return false;
      }

    } else if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};
export const equalObject = (obj1: any, obj2: any) => {
  if (obj1 === obj2) {
    return true;
  }
  // 属性总数不等，直接返回false
  let size1 = 0;
  for (let key in obj1) {
    size1++;
  }
  let size2 = 0;
  for (let key in obj2) {
    size2++;
  }
  if (size1 !== size2) {
    return false;
  }

  let type1, type2;
  for (let key in obj1) {
    type1 = type(obj1[key]);
    type2 = type(obj2[key]);
    if (type1 !== type2) {
      return false;
    }

    if (type1 === 'Object') {
      if (!equalObject(obj1[key], obj2[key])) {
        return false;
      }

    } else if (type1 === 'Array') {
      if (!equalArray(obj1[key], obj2[key])) {
        return false;
      }

    } else if (obj1[key] !== obj2[key]) {
      return false;
    }

  }
  return true;
};

const type = (data: any) => {
  return Object.prototype.toString.call(data).slice(8, -1);
};