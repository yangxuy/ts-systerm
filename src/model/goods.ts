interface Sku {
  price: string | number;
  stock: string | number;
  stockAlarm: string | number;
  str: string | number;

  [propName: string]: string | number;
}

interface Goods {
  id: number;
  name: string; // 名称
  categoryId: number | string; // 所属类型id
  brandId: number | string; // 所属品牌id
  subHead: string; // 副标题
  detail: string; // 描述
  orderNum: string | number; // 描述
  unit: string; // 描述
  pictureList: string; // 商品图片
  status: number; // 商品状态
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
  parentId: string | string;
  orderNum: number | string;
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

interface AttributeValue {
  id?: number; //
  value: string; // 所属类型ID
  attributeId: number | string;
  orderNum: string | number; // 排序
}

interface Attribute {
  id?: number;
  name: string;
  categoryId: string | number;
  sale: number;
  orderNum: number | string;
}