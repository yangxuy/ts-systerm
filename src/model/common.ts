interface Common<T> {
  id: number;
  data: T;
  code: number;
  message: string;
}

// rules
interface Rules {
  NotEmpty: object;
  number: object;
  date: object;

  [propName: string]: object;
}

// 分页
interface Page {
  page: number;
  pageSize: number;

  [propName: string]: string | number;
}

// 分页返回
interface PageRes {
  total: number;
  list: any[];
}

// 对象
interface Obj {
  [propName: string]: object;
}
