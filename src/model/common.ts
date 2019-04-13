interface Common {
    id: number;
    data: any;
    code: number;
    msg: string;
}

// rules
interface Rules {
    NotEmpty: object;
    number: object;
    date: object;

    [propName: string]: object;
}

// 分页
interface Page<T> {
    page: number;
    pageSize: number;
    info: T;
}