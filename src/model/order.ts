interface Order {  // 订单基本信息
    id?: number; // 订单ID
    orderNumber: number; // 订单单号
    uid: number; // 用户ID
    uname: string; // 用户名称
    amount: number; // 下单金额
    payMethods: number; // 支付方式(0:微信，1:支付宝)
    orderSource: number; // 订单来源(0:APP,1: 小程序)
    orderStatus: number; // 订单状态
}

interface OrderDetail { // 订单详情
    goodsId: number;// 商品ID
    goodsName: string;// 商品名称
    price: number;// 商品单价
    number: number;// 商品数量
    pic: string;// 商品图片
    values: string[]//商品属性
}