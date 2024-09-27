import {statusCodes} from "./index.ts";

const FormatCurrencyNumber = (value: number) => {
    return value.toLocaleString('vi', {style: 'currency', currency: 'VND'});
}
const MapStatusCodeInternal = (statusCode: number): string => {
    let message ='Lỗi hệ thống. Vui lòng thử lại sau';
    const index = statusCodes.findIndex(item => item.statusCodes === statusCode);
    if(index !== -1){
        message = statusCodes[index].message;
    }
    return message;
}
 const FormatCurrency = (value:  string | null | undefined): string => {
    if (value === null || value === undefined) {
        return '';
    }
    return new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND' }).format(Number(value));
}
const FormatNumber = (value:  string | null | undefined): string => {
    if(value === null || value === undefined){
        return '';
    }
    return value.replace(/\B(?=(\d{3})+(?!\d))/g,'.');
}
 const ParseCurrency = (value: string):  string | null | undefined => {
    return (value.replace(/[^0-9]+/g, '') ||'');
}
export {FormatNumber,FormatCurrencyNumber,MapStatusCodeInternal,FormatCurrency,ParseCurrency};