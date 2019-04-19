interface Sku {
  price: string | number;
  stock: string | number;
  stockAlarm: string | number;

  [propName: string]: string|number;
}

interface Goods {
  id: number;
  name: string; // 名称
  typeId: number | string; // 所属类型id
  brandId: number | string; // 所属品牌id
  subHead: string; // 副标题
  summary: string; // 描述
  itemNum: string;// 货号
  price: number | string; // 零售价
  marketPrice: number | string; // 市场价
  stock: number; // 库存
  weight: number; // 重量，单位克
  orderNum: number; // 排序
  attributeId: number | string;
  skuStockList: Sku[],
  property: Property[],
}

interface goodsSearch {
  id?: number;
  name: string;
  beginDate?: string;
  endDate?: string;
}

interface Sorts {
  id: number;
  name: string;
  order: string;
  count?: string;
  unit: string;
}

interface Brand {
  id: number;  // 品牌名称
  name: string; //  品牌名称
  orderNum: string; //排序
  firstChar: string; // 首字母
  brandCompany: string; // 品牌公司
  brandLogo: string; // 品牌logo
  brandBigIcon: string; // 品牌大图
  show: number; // 是否展示
}

interface Property {
  id?: number; //
  attributeId: number; // 所属类型ID
  propertyType: number; // 1主 2负
  name: string;  // 名称
  orderNum: string | number; // 排序
  propertyList: string[]; // 属性值
  selectModel: number; // 单选/复选
  needPic: number; // 属性值是否需要图片描述

  [propName: string]: any;
}

interface Attribute {
  id?: number;
  name: string;
  propertyId: number[]
}