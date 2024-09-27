import * as yup from 'yup'
import {stringNormal, stringRequired} from "./YupValidation.ts";

export const formLoginSchema = () => {
    return yup.object().shape({
        account: stringRequired,
        password: stringRequired,
        keyEnv: stringRequired,
    })
}

export const formAddEditProduct = () => {
    return yup.object().shape({
        productName: stringRequired,
        store: stringNormal,
        warranty: stringNormal,
        unit: stringRequired,
        importPrice: stringRequired,
        salePrice: stringRequired,
        discount: stringRequired,
        priceAfterDiscount: stringNormal,
        quantity: stringNormal,
        weight: stringRequired,
        length: stringRequired,
        width: stringRequired,
        height: stringRequired,
        isContactPrice: yup.boolean(),
        isOnlineSale: yup.boolean(),
        description: stringNormal,
        URLImage: stringNormal,
        URLImage2: stringNormal,
        URLImage3: stringNormal,
        URLImage4: stringNormal,
        URLImage5: stringNormal
    })
}
export const formImportWarehouseProduct = () => {
    return yup.object().shape({
        productName: stringRequired,
        remainingQuantity: stringNormal,
        additionalQuantity: stringNormal,
    })
}
export const formImportWarehouseProductDefault = {
    productName: '',
    remainingQuantity: '',
    additionalQuantity: '',
}
export const formAddEditProductDefault = {
    productName: '',
    store: '',
    warranty: '',
    unit: '',
    importPrice: '',
    salePrice: '',
    discount: '0',
    priceAfterDiscount: '',
    quantity: '0',
    weight: '0',
    length: '0',
    width: '0',
    height: '0',
    isContactPrice: false,
    isOnlineSale: false,
    description: '',
    URLImage: '',
    URLImage2: '',
    URLImage3: '',
    URLImage4: '',
    URLImage5: ''
}
export const formLoginDefault = {
    account: '',
    password: '',
    keyEnv: '',
}