import {STORAGE_ITEM} from "../constants/StorageItem.ts";
import {Role, StoreInfo, UserInfo} from "../types";

const onSaveToken = (isLocalhost: boolean, dataSave: {
    token: string,
    refreshToken: string,
    role:Role,
    userInfo:UserInfo,
    storeInfo: StoreInfo,
    apiUrl: string

}) => {
    if(isLocalhost) {
        localStorage.setItem(STORAGE_ITEM.TOKEN, dataSave.token);
        localStorage.setItem(STORAGE_ITEM.REFRESH_TOKEN, dataSave.refreshToken);
        localStorage.setItem(STORAGE_ITEM.ROLE_ID, dataSave.role.RoleId.toString());
        localStorage.setItem(STORAGE_ITEM.USER_ID, dataSave.userInfo.IDKhachHang.toString());
        localStorage.setItem(STORAGE_ITEM.STORE_ID, dataSave.storeInfo.IDCuaHang.toString());
        localStorage.setItem(STORAGE_ITEM.STORE_PARENT_ID, JSON.stringify(dataSave.storeInfo.IDCuaHangCha));
        localStorage.setItem(STORAGE_ITEM.USER_INFO, JSON.stringify(dataSave.userInfo));
        localStorage.setItem(STORAGE_ITEM.API_URL, dataSave.apiUrl);
        localStorage.setItem(STORAGE_ITEM.IS_AUTHENTICATED, 'true');
        localStorage.setItem(STORAGE_ITEM.FULL_NAME, dataSave.userInfo.Ho + ' ' + dataSave.userInfo.Ten);
        localStorage.setItem(STORAGE_ITEM.NAME_ROLE, dataSave.role.RoleName);
    }else{
        sessionStorage.setItem(STORAGE_ITEM.TOKEN, dataSave.token);
        sessionStorage.setItem(STORAGE_ITEM.REFRESH_TOKEN, dataSave.refreshToken);
        sessionStorage.setItem(STORAGE_ITEM.ROLE_ID, dataSave.role.RoleId.toString());
        sessionStorage.setItem(STORAGE_ITEM.USER_ID, dataSave.userInfo.IDKhachHang.toString());
        sessionStorage.setItem(STORAGE_ITEM.STORE_ID, dataSave.storeInfo.IDCuaHang.toString());
        sessionStorage.setItem(STORAGE_ITEM.STORE_PARENT_ID, JSON.stringify(dataSave.storeInfo.IDCuaHangCha));
        sessionStorage.setItem(STORAGE_ITEM.USER_INFO, JSON.stringify(dataSave.userInfo));
        sessionStorage.setItem(STORAGE_ITEM.API_URL, dataSave.apiUrl);
        sessionStorage.setItem(STORAGE_ITEM.IS_AUTHENTICATED, 'true');
        sessionStorage.setItem(STORAGE_ITEM.FULL_NAME, dataSave.userInfo.Ho + ' ' + dataSave.userInfo.Ten);
        sessionStorage.setItem(STORAGE_ITEM.NAME_ROLE, dataSave.role.RoleName);
    }
}

const clearToken = () => {
        localStorage.removeItem(STORAGE_ITEM.TOKEN);
        localStorage.removeItem(STORAGE_ITEM.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_ITEM.ROLE_ID);
        localStorage.removeItem(STORAGE_ITEM.USER_ID);
        localStorage.removeItem(STORAGE_ITEM.STORE_ID);
        localStorage.removeItem(STORAGE_ITEM.STORE_PARENT_ID);
        localStorage.removeItem(STORAGE_ITEM.USER_INFO);
        localStorage.removeItem(STORAGE_ITEM.API_URL);
        localStorage.removeItem(STORAGE_ITEM.IS_AUTHENTICATED);
        localStorage.removeItem(STORAGE_ITEM.FULL_NAME);
        localStorage.removeItem(STORAGE_ITEM.NAME_ROLE);

        sessionStorage.removeItem(STORAGE_ITEM.TOKEN);
        sessionStorage.removeItem(STORAGE_ITEM.REFRESH_TOKEN);
        sessionStorage.removeItem(STORAGE_ITEM.ROLE_ID);
        sessionStorage.removeItem(STORAGE_ITEM.STORE_ID);
        sessionStorage.removeItem(STORAGE_ITEM.STORE_PARENT_ID);
        sessionStorage.removeItem(STORAGE_ITEM.USER_ID);
        sessionStorage.removeItem(STORAGE_ITEM.USER_INFO);
        sessionStorage.removeItem(STORAGE_ITEM.API_URL);
        sessionStorage.removeItem(STORAGE_ITEM.IS_AUTHENTICATED);
        sessionStorage.removeItem(STORAGE_ITEM.FULL_NAME);
        sessionStorage.removeItem(STORAGE_ITEM.NAME_ROLE);
}

const getToken = () => {
    const token = localStorage.getItem(STORAGE_ITEM.TOKEN) || sessionStorage.getItem(STORAGE_ITEM.TOKEN);
    return token ? JSON.parse(token) : null;
}

export {onSaveToken, clearToken, getToken}