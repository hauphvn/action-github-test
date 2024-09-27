export const ROUTES_PATH = {
    HOME: '/',
    DASHBOARD: '/dashboard',
    PRODUCT: '/dashboard/products',
    ARTICLE: '/dashboard/articles',
    STORE: '/dashboard/stories',
    LOGIN: '/login'
}

export const API_PATH = {
    EMPLOYEE_LOGIN: '/auth/employee/login',
    PRODUCT: {
        GET_ALL: '/CommonV2/GetSanPham',
        GET_BY_ID: '/ProductWarehouse/GetProductForWarehouseById',
        RE_UPDATE: '/CommonV2/ReUploadSanPham',
        ADD_NEW: '/CommonV2/UploadSanPham',
    },
    STORE:{
        GET_ALL_BY_STORE_PARENT_ID: '/Store/GetAllStoreByParentId',
    },
    HANDLE_FILE:{
        UPLOAD_FILE_PRODUCT_IMAGE: '/Management/UploadFiles',
        UPLOAD_FILE_PRODUCT_IMAGE_V2: '/ProductImage/EditProductImage',
        ADD_NEW_FILE_PRODUCT_IMAGE_V2: '/ProductImage/AddNewProductImage',
    }
}