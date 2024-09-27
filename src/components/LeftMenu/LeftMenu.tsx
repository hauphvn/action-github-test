import InfoUserMenu from "../InfoUserMenu";
import MenuItem from "../MenuItem";
import {IconArticleMenu, IconCartMenu, IconManageMenu, IconStoreMenu} from "../../assets/svgs/SVGIcon.tsx";
import {NavLink, useLocation} from "react-router-dom";
import {ROUTES_PATH} from "../../constants";
import {useEffect, useState} from "react";
import SubMenuItem from "../SubMenuItem";
import {useTheme} from "../../context/ThemeContext.tsx";

const listManagementMenus: { key: number, value: string }[] = [
    {
        key: 1, value: 'Bán hàng',
    },
    {
        key: 2, value: 'Chuẩn bị đơn',
    },
    {
        key: 3, value: 'Đóng gói',
    },
    {
        key: 4, value: 'Vận chuyển',
    },
    {
        key: 5, value: 'Quản lý chung',
    },
    {
        key: 6, value: 'Chi phí',
    },
    {
        key: 7, value: 'Báo cáo',
    },
    {
        key: 8, value: 'Quản lý đơn',
    },
]
const onRenderSubMenuManagement = () => {
    return (
        listManagementMenus.map((item: { key: number, value: string }) => {
            return <SubMenuItem key={item.key} name={item.value}/>
        })
    )
}
const LeftMenu = () => {
    const location = useLocation();
    const {isDarkMode} = useTheme();
    const [pathName, setPathName] = useState('')
    const [isOpenTabManage, setIsOpenTabManage] = useState(false);
    useEffect(() => {
        setPathName(location?.pathname);
    }, [location]);


    return (
        <div className={`max-w-[304px]`}>
            <InfoUserMenu/>
            <div className={'pt-[40px] flex gap-y-[24px] flex-col'}>
               <div>
                   <NavLink
                       to={ROUTES_PATH.DASHBOARD}>
                       <div onClick={() => setIsOpenTabManage(!isOpenTabManage)}>
                           <MenuItem isOpen={isOpenTabManage} isActive={pathName === ROUTES_PATH.DASHBOARD}
                                     icon={<IconManageMenu isDarkMode={isDarkMode} isActive={pathName === ROUTES_PATH.DASHBOARD}/>}
                                     name={'Quản trị'} hasChildren/>
                       </div>
                   </NavLink>
                  <div className={'ml-[25px]'}>
                      {isOpenTabManage ? (onRenderSubMenuManagement()) : null}
                  </div>
               </div>
                <NavLink to={ROUTES_PATH.PRODUCT}>
                    <MenuItem isActive={pathName.includes(ROUTES_PATH.PRODUCT)}
                              icon={<IconCartMenu isDarkMode={isDarkMode} isActive={pathName.includes(ROUTES_PATH.PRODUCT)}/>}
                              name={'Sản phẩm'}/>
                </NavLink>
                <NavLink to={ROUTES_PATH.ARTICLE}>
                    <MenuItem isActive={pathName.includes(ROUTES_PATH.ARTICLE)}
                              icon={<IconArticleMenu isDarkMode={isDarkMode} isActive={pathName.includes(ROUTES_PATH.ARTICLE)}/>}
                              name={'Bài viết'}/>
                </NavLink>
                <NavLink to={ROUTES_PATH.STORE}>
                    <MenuItem isActive={pathName.includes(ROUTES_PATH.STORE)}
                              icon={<IconStoreMenu isDarkMode={isDarkMode} isActive={pathName.includes(ROUTES_PATH.STORE)}/>}
                              name={'Cửa hàng'}/>
                </NavLink>
            </div>
        </div>
    );
};

export default LeftMenu;