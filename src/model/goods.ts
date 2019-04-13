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
}

interface goodsSearch {
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
    id?: number;
    name: string;
    properties: string[];
    selectModel: number;
}

interface Attribute {
    id?: number;
    name: string;
    attibutes: number[]
}