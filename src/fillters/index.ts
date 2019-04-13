interface IDInNameType {
    id: number;
    name: string;

    [propName: string]: string | number
}

export default {
    filterIdToName: (id: number, type: IDInNameType[]): string => {
        let empty: string = '';
        type.forEach((item) => {
            if (item.id === id) {
                empty = item.name;
            }
        });
        return empty;
    },
    filterData: (v: Date) => {
        if (v) {
            const date = new Date(v);
            const y = date.getFullYear();
            const m = date.getMonth() + 1;
            const h = date.getHours();
            return `${y}-${m}-${h}`
        } else {
            return ''
        }
    }
};