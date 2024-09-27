import './tableProductStyle.css';
import 'react-simple-toasts/dist/theme/dark.css';
import 'react-simple-toasts/dist/theme/light.css';
import Button from "../../components/Button";
import ButtonGradient from "../../components/ButtonGradient";
import {
    IconFilter,
    IconInputSearch,
    IconManageMenu,
    IconPen,
    IconPlus,
    IconPrinter,
    IconRecycling,
    IconSelectArrowButton,
    IconWarehouse
} from "../../assets/svgs/SVGIcon.tsx";
import Select from "../../components/Select";
import {SelectOption} from "../../components/Select/Select.tsx";
import Input from "../../components/Input";
import {Table, TableProps} from "antd";
import {useEffect, useState} from "react";
import AddNewProduct from "../../components/AddNewProduct";
import {IProductDetails, IResProduct} from "../../types";
import UpdateProduct from "../../components/UpdateProduct";
import FilterProduct from "../../components/FilterProduct";
import ErrorModal from "../../components/ErrorModal/ErrorModal.tsx";
import {useTheme} from "../../context/ThemeContext.tsx";
import ImportWarehouseProduct from "../../components/ImportWarehouseProduct";
import CreateItemProductPrinter from "../../components/CreateItemProductPrinter";
import {error500, FormatCurrency, ProductGet} from "../../constants";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {get, post} from "../../libs";
import {API_PATH} from "../../constants/Path.ts";
import {STORAGE_ITEM} from "../../constants/StorageItem.ts";
import {Skeleton} from "antd";
import toast from "react-simple-toasts";
import Loading from "../../components/Loading";

const categories: SelectOption[] = [
    {label: 'Category 1', value: '1'},
    {label: 'Category 2', value: '2'},
    {label: 'Category 3', value: '3'},
    {label: 'Category 4', value: '4'},
    {label: 'Category 5', value: '5'},
]

export interface StoreOptions {
    label: string,
    value: string
}

interface ISearchParam {
    productName: string,
    page?: number,
    total?: number
}

const Product = () => {
    const {VITE_DOMAIN_IMAGE} = import.meta.env;
    const {isDarkMode} = useTheme();
    const [showAddNew, setShowAddNew] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [stores, setStores] = useState<StoreOptions[]>([]);
    const [delayInputSearch, setDelayInputSearch] = useState('');
    // const [binaryImages, setBinaryImages] = useState<IBinaryImage[]>()
    const [valuesPrinter, setValuesPrinter] = useState<{
        [key: string]: { goldRate: string, goldRateFormat: string, laborCost: string, laborCostFormat: string }
    }>({});
    const [paramSearch, setParamSearch] = useState<ISearchParam>({
        productName: '',
        page: 1,
        total: 10
    });
    const [showPrinterPDF, setShowPrinterPDF] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [products, setProducts] = useState<IResProduct[]>([]);
    const queryClient = useQueryClient();
    const getProducts = async () => {
        const res = await post(API_PATH.PRODUCT.GET_ALL, {
            "loai": ProductGet.Type,
            "idcuahang": localStorage.getItem(STORAGE_ITEM.STORE_ID) || sessionStorage.getItem(STORAGE_ITEM.STORE_ID),
            "keyword": paramSearch.productName,
            "idvaitro": localStorage.getItem(STORAGE_ITEM.ROLE_ID) || sessionStorage.getItem(STORAGE_ITEM.ROLE_ID),
            // "sotrang":1,
            // "soitem":4
        });
        return res.data;
    }
    const getAllStoreByParentId = async () => {
        const res = await get(API_PATH.STORE.GET_ALL_BY_STORE_PARENT_ID + `?id=${localStorage.getItem(STORAGE_ITEM.STORE_PARENT_ID) || sessionStorage.getItem(STORAGE_ITEM.STORE_PARENT_ID)}`);
        return res.data;
    }
    const getProductDetail = async (productID: string) => {
        const res = await get(API_PATH.PRODUCT.GET_BY_ID + `?id=${productID}`);
        return res.data;
    }
    const {
        data: dataProducts,
        isLoading: loadingProducts,
        isError: errorProducts,
        isSuccess: successProducts,
        isRefetching: refetchingProducts,
        isFetching: fetchingProducts
    } = useQuery({
            queryKey: ['products', paramSearch],
            queryFn: getProducts,
        },
    );
    const {
        data: dataStores,
        isSuccess: successStores,
        isLoading: loadingStores,
    } = useQuery({
        queryKey: ['stores'],
        queryFn: getAllStoreByParentId,
    });
    // const fetchBinaryData = async (urlImages: {
    //     key: string,
    //     url: string
    // }[]): Promise<{
    //     success: {
    //         key: string,
    //         value: ArrayBuffer
    //     }[], errors: string[]
    // }> => {
    //     const fetchImage = async (image: { key: string, url: string }): Promise<{
    //         key: string,
    //         value: ArrayBuffer
    //     }> => {
    //         const response = await fetch(image.url);
    //         if (!response.ok) {
    //             throw new Error(`${image.key}`);
    //         }
    //         const data = await response.arrayBuffer();
    //         return {
    //             key: image.key,
    //             value: data
    //         }
    //     };
    //     const results = await Promise.allSettled(urlImages.map(fetchImage));
    //     const success = results
    //         .filter(result => result.status === 'fulfilled')
    //         .map(result => (result as PromiseFulfilledResult<{
    //             key: string,
    //             value: ArrayBuffer
    //         }>).value);
    //     const errors = results
    //         .filter(result => result.status === 'rejected')
    //         .map(result => (result as PromiseRejectedResult).reason.message);
    //     return {success, errors};
    // }
    // const {
    //     mutate: fetchDataBinaryImages,
    //     isPending: isPendingFetchDataBinaryImages,
    // } = useMutation({
    //     mutationKey: ['fetchDataBinaryImages'],
    //     mutationFn: fetchBinaryData,
    //     onSuccess: ({success}) => {
    //         if (success.length > 0) {
    //             setBinaryImages(success);
    //         }
    //         setShowUpdate(true);
    //     },
    //     onError: (error) => {
    //         console.log('error fetch image: ', error);
    //     },
    // })
    const {
        mutate: mutateUpdateProduct,
        isPending: isPendingUpdateProduct,
    } = useMutation({
        mutationKey: ['updateProduct'],
        mutationFn: getProductDetail,
        onSuccess: (data) => {
            if (data?.metadata) {
                setProductEdit({
                    Cao: data?.metadata?.Cao,
                    Dai: data?.metadata?.Dai,
                    GiaBan: data?.metadata?.GiaBan,
                    GiaSauGiam: data?.metadata?.GiaSauGiam,
                    GiaTriTienTe: data?.metadata?.GiaTriTienTe,
                    GiamGia: data?.metadata?.GiamGia,
                    IDCuaHang: data?.metadata?.IDCuaHang,
                    IDDonViTinh: data?.metadata?.IDDonViTinh,
                    IDSanPham: data?.metadata?.IDSanPham,
                    KhoiLuong: data?.metadata?.KhoiLuong,
                    KhoiLuong1: data?.metadata?.KhoiLuong1,
                    MaSanPham: data?.metadata?.MaSanPham,
                    MoTa: data?.metadata?.MoTa,
                    Rong: data?.metadata?.Rong,
                    SanPhamTrucTuyen: data?.metadata?.SanPhamTrucTuyen,
                    SoLuong: data?.metadata?.SoLuong,
                    TenSanPham: data?.metadata?.TenSanPham,
                    ThoiGianBaoHanh: data?.metadata?.ThoiGianBaoHanh,
                    TriGia: data?.metadata?.TriGia,
                    URLImage: data?.metadata?.URLImage,
                    URLImage2: data?.metadata?.URLImage2,
                    URLImage3: data?.metadata?.URLImage3,
                    URLImage4: data?.metadata?.URLImage4,
                    URLImage5: data?.metadata?.URLImage5,
                    actionType: 'update'
                });
                setShowUpdate(true);
                // fetchDataBinaryImages([
                //     {key: 'URLImage', url: `${VITE_DOMAIN_IMAGE}${data?.metadata?.URLImage}`},
                //     {key: 'URLImage2', url: `${VITE_DOMAIN_IMAGE}${data?.metadata?.URLImage2}`},
                //     {key: 'URLImage3', url: `${VITE_DOMAIN_IMAGE}${data?.metadata?.URLImage3}`},
                //     {key: 'URLImage4', url: `${VITE_DOMAIN_IMAGE}${data?.metadata?.URLImage4}`},
                //     {key: 'URLImage5', url: `${VITE_DOMAIN_IMAGE}${data?.metadata?.URLImage5}`},
                // ]);
            }
            // if (productEdit?.productID) {
            //     if (productEdit?.actionType === 'update') {
            //         setShowUpdate(true);
            //     } else if (productEdit?.actionType === 'delete') {
            //         setShowModalDelete(true);
            //     } else if (productEdit?.actionType === 'import-warehouse') {
            //         setShowImportWarehouseProduct(true);
            //     } else if (productEdit?.actionType === 'printer') {
            //         setShowPrinterPDF(true);
            //     }
            // }
        }
    })
    const onResetProductEdit = () => {
        setProductEdit({
            actionType: 'unknown'
        })
    }
    useEffect(() => {
        if (successStores && dataStores) {
            const stores = dataStores?.metadata?.map((item: any) => ({
                label: item.TenCuaHang,
                value: item.IdcuaHang.toString()
            }));
            setStores(stores);
        }
    }, [successStores]);
    useEffect(() => {
        queryClient.invalidateQueries({
            queryKey: ['products', paramSearch]
        });
    }, [paramSearch?.productName]);
    useEffect(() => {
        if (successProducts && dataProducts) {
            const searchProducts = dataProducts?.map((product: any) => ({
                key: product.IDSanPham,
                productID: product.IDSanPham,
                productName: product.TenSanPham,
                image: `${VITE_DOMAIN_IMAGE}${product?.URLImage || product?.URLImage2 || product?.URLImage3 || product?.URLImage4 || product?.URLImage5}`,
                productCode: product.MaSanPham,
                amount: product.SoLuong,
                price: product.GiaBan
            }));
            setProducts(searchProducts);
        }
    }, [successProducts, refetchingProducts]);
    const columns: TableProps<IResProduct>['columns'] = [
        {
            title: () => (<div className={`${isDarkMode ? 'dark-mode' : ' '} w-[116px]`}>Hình ảnh</div>),
            dataIndex: 'image',
            key: 'image',
            align: 'center',
            render: (_, {image}) => {
                return (
                    <div className={' flex justify-center'}>
                        <img className={'w-[88px] h-[88px] rounded'} src={image} alt={'product'}/>
                    </div>
                )
            },
        },
        {
            title: () => (<div className={`${isDarkMode ? 'dark-mode' : ' '} `}>Sản phẩm</div>),
            dataIndex: 'productName',
            key: 'productName',
            align: 'center',
            sorter: (a, b) => a.productName.localeCompare(b.productName),
            render: (_, {productName, price}) => {
                return (
                    <div className={'text-left flex flex-col gap-y-[8px] justify-center'}>
                        <div className={' font-[600] text-[20px]'}>
                            {productName}
                        </div>
                        <div className={'text-[14px]'}><span
                            className={`${isDarkMode ? 'text-neutrals-400' : 'text-semantics-grey02'}`}>Giá bán: </span>
                            <span
                                className={'text-accent-a01'}>{+price <= 0 ? "Liên hệ" : FormatCurrency(price)}</span>
                        </div>
                    </div>
                )
            }
        },
        {
            title: () => (<div className={`${isDarkMode ? 'dark-mode' : ' '} `}>Mã sản phẩm</div>),
            dataIndex: 'productCode',
            key: 'productCode',
            align: 'center',
            sorter: (a, b) => a.productCode.localeCompare(b.productCode),
            render: (_, {productCode}) => {
                return (
                    <div className={' font-[500] text-[18px]'}>
                        {productCode}
                    </div>
                )
            }
        },
        {
            title: () => (<div className={`${isDarkMode ? 'dark-mode' : ' '} `}>Số lượng</div>),
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            sorter: (a, b) => a.amount.localeCompare(b.amount),
            render: (_, {amount}) => {
                return (
                    <div className={' font-[500] text-[18px]'}>
                        {amount}
                    </div>
                )
            }
        },
        {
            title: () => (<div className={`${isDarkMode ? 'dark-mode' : ' '} `}>Chỉnh sửa</div>),
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_, {productID, productName, price, productCode, amount}) => {
                return (
                    <div className={' flex flex-col gap-y-[10px] w-full justify-center items-center'}>
                        <div className="print-container gap-x-[12px] flex items-center">
                            <div
                                className={`${isDarkMode ? 'border-darkGrey-3838 bg-darkGrey-3333' : 'border-neutrals-500'} print-data w-[187px] flex  gap-x-[8px] h-[38px] px-[18px] py-[12px] items-center justify-between border-[0.5px] rounded-[8px]`}>
                                <input
                                    value={valuesPrinter[productID]?.goldRate || ''}
                                    onChange={(e) => setValuesPrinter(pre => ({
                                        ...pre,
                                        [productID]: {
                                            ...pre[productID],
                                            goldRate: e.target.value,
                                            goldRateFormat: e.target.value + '%'
                                        }
                                    }))}
                                    className={`${isDarkMode ? 'bg-darkGrey-3333' : ''} w-[50px] outline-0 text-[12px] p-0 m-0 leading-none`}
                                    placeholder={'TL Vàng'} type="text"/>
                                <div className={`border-semantics-grey01 border-l-[1px] h-[14px]`}></div>
                                <input
                                    value={valuesPrinter[productID]?.laborCost || ''}
                                    onChange={(e) => setValuesPrinter(pre => ({
                                        ...pre,
                                        [productID]: {
                                            ...pre[productID],
                                            laborCost: e.target.value,
                                            laborCostFormat: (!isNaN(+e?.target?.value) && e?.target?.value) ? FormatCurrency(e?.target?.value) : ''
                                        }
                                    }))}
                                    className={`${isDarkMode ? 'bg-darkGrey-3333' : ''} w-[84px] outline-0 text-[12px] p-0 m-0 leading-none`}
                                    placeholder={'Tiền công'} type="text"/>
                            </div>
                            <div
                                onClick={() => onEditProduct({
                                    productID,
                                    productName,
                                    price,
                                    productCode,
                                    quantity: amount,
                                    actionType: 'printer'
                                })}
                                // onClick={() => prePrintItem(productName, productID)}
                                className={`${isDarkMode ? 'bg-darkGrey-2E2E' : ''} printer hover:cursor-pointer shadow-button-1 w-[40px] h-[40px] flex justify-center items-center rounded-[8px]`}>
                                <IconPrinter isDarkMode={isDarkMode}/>
                            </div>
                        </div>
                        <div className="actions-container flex gap-x-[12px] ">
                            <div
                                onClick={() => {
                                    onEditProduct({
                                        productID,
                                        productName,
                                        price,
                                        productCode,
                                        quantity: amount,
                                        actionType: 'update'
                                    });
                                    mutateUpdateProduct(productID);
                                }}
                                className={` ${isDarkMode ? 'bg-darkGrey-2E2E' : ''} icon rounded-[8px] py-[8px] px-[24px] shadow-button-1 hover:cursor-pointer w[72px] h-[40px] `}>
                                <IconPen isDarkMode={isDarkMode}/>
                            </div>
                            <div
                                onClick={() => onEditProduct({
                                    productID,
                                    productName,
                                    price,
                                    productCode,
                                    quantity: amount,
                                    actionType: 'import-warehouse'
                                })}
                                className={` ${isDarkMode ? 'bg-darkGrey-2E2E' : ''} icon rounded-[8px] py-[8px] px-[24px] shadow-button-1 hover:cursor-pointer w[72px] h-[40px] `}>
                                <IconWarehouse isDarkMode={isDarkMode}/>
                            </div>
                            <div
                                onClick={() => onEditProduct({
                                    productID,
                                    productName,
                                    price,
                                    productCode,
                                    quantity: amount,
                                    actionType: 'delete'
                                })}
                                className={` ${isDarkMode ? 'bg-darkGrey-2E2E' : ''} icon rounded-[8px] py-[8px] px-[24px] shadow-button-1 hover:cursor-pointer w[72px] h-[40px] `}>
                                <IconRecycling isDarkMode={isDarkMode}/>
                            </div>
                        </div>
                    </div>
                )
            }
        },
    ];
    const [productEdit, setProductEdit] = useState<IProductDetails>({
        actionType: 'unknown'
    })
    const [showUpdate, setShowUpdate] = useState(false);
    const [showImportWarehouseProduct, setShowImportWarehouseProduct] = useState(false);
    // useEffect(() => {
    //
    // }, [productEdit?.productID])
    useEffect(() => {
        setTimeout(() => {
            setParamSearch(pre => ({
                ...pre,
                productName: delayInputSearch
            }));
        }, 300);
    }, [delayInputSearch]);
    useEffect(() => {
        if (errorProducts) {
            toast(error500,
                {
                    position: 'top-center',
                    theme: isDarkMode ? 'dark' : 'light',
                    className: 'shadow shadow-semantics-red03  text-semantics-red02'
                });
        }
    }, [errorProducts]);

    function onEditProduct(param: {
        productID: string;
        price: string;
        productName: string,
        productCode: string,
        quantity: string,
        actionType: 'update' | 'delete' | 'import-warehouse' | 'printer'
    }) {
        setProductEdit({
            actionType: param.actionType
        });
    }

    function preOnShowAddNew() {
        setShowAddNew(true);
    }

    function preOnCloseAddNew(isReload: boolean) {
        setShowAddNew(false);
        if (isReload) {
            queryClient.invalidateQueries({
                queryKey: ['products', paramSearch]
            });
        }
    }

    function preOnCloseUpdate(isReload: boolean) {
        onResetProductEdit();
        setShowUpdate(false);
        if (isReload) {
            queryClient.invalidateQueries({
                queryKey: ['products', paramSearch]
            });
        }
    }

    function preOnCloseImportWarehouseProduct() {
        onResetProductEdit();
        setShowImportWarehouseProduct(false);
    }

    function preHandlerSearch(value: string) {
        setDelayInputSearch(value);
    }

    function onHandleDelete() {
        // const newProducts = products.filter(product => product.productID !== productEdit.productID);
        // setProducts(newProducts);
        // setShowModalDelete(false);
    }

    function preOnCloseDelete() {
        onResetProductEdit();
        setShowModalDelete(false);
    }

    return (
        <div>
            <div
                className={`${isDarkMode ? 'text-neutrals-400 border-b-darkGrey-2727' : 'text-semantics-grey01 border-b-neutrals-300'} titleContainer h-[88px] border-b-[1px] pl-[32px] pr-[33px] flex justify-between items-center`}>
                <div className="title  text-[32px]">Sản phẩm</div>
                <div className={'flex gap-x-[25px]'}>
                    <Button
                        icon={<IconManageMenu isDarkMode={isDarkMode}/>}
                        className={`${isDarkMode ? 'bg-darkGrey-3333 border-darkGrey-3838 text-neutrals-400' : ''} h-[40px] shadow-button-1`}
                        name={'Nhập theo danh sách'}/>
                    <ButtonGradient
                        onClick={preOnShowAddNew}
                        icon={<IconPlus/>}
                        className={`${isDarkMode ? 'border-darkGrey-3838-important border' : ''} h-[40px] w-[165px] text-[16px]  px-[24px] gap-x-[14px]`}
                        name={'Thêm mới'}/>
                </div>
            </div>
            <div
                className={`${isDarkMode ? 'text-neutrals-400' : 'text-neutrals-700'} action-filter-container h-[88px] px-[24px] py-[32px] flex  justify-between`}>
                <div className={'flex gap-x-[20px] w-[325px] items-center'}>
                    <label className={' text-[14px]'} htmlFor="categories">Danh sách:</label>
                    <div className={' w-[230px] flex items-center'}>
                        <Select
                            isDarkMode={isDarkMode}
                            maxTagCount={1}
                            suffixIcon={<IconSelectArrowButton/>}
                            className={`custom-select-dropdown ${isDarkMode ? 'placeholder-dark border-dark bg-darkGrey-2E2E rounded-[8px] select-dark-content ' : ''} h-[38px] text-[12px]`}
                            id={'categories'}
                            options={categories}
                            placeholder={'Tất cả'}/>
                    </div>
                </div>
                <div className={'flex items-center gap-x-[20px]'}>
                    <Input
                        onChange={(e) => preHandlerSearch(e?.target?.value)}
                        suffix={<IconInputSearch isDarkMode={isDarkMode}/>}
                        className={`text-[12px]  h-[40px] w-[230px] rounded-[8px] ${!isDarkMode ? 'shadow-button-1 focus-within:shadow-button-1' : ' text-neutrals-400 border-dark placeholder-dark'}`}
                        placeholder={'Tìm kiếm sản phẩm'}/>
                    <div className={'relative'}>
                        <Button
                            onClick={() => setShowFilter(!showFilter)}
                            className={` ${isDarkMode ? 'text-neutrals-400 border-none hover:bg-darkGrey-2E2E ' : ''} text-[16px] h-[40px] shadow-button-1`}
                            icon={<IconFilter isDarkMode={isDarkMode}/>}
                            name={'Bộ lộc'}/>
                        <div className={'absolute top-[3rem] right-0 z-20'}>
                            {showFilter && <FilterProduct/>}
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-container mt-[24px] pl-[24px] pr-[32px]">
                {loadingProducts ? (<Skeleton active/>) : (
                    <Table

                        id={`${isDarkMode ? 'table-product-dark-mode' : 'table-product-light-mode'}`}
                        scroll={{x: '100%', y: '67vh'}}
                        pagination={{position: ["bottomCenter"]}}
                        columns={columns} dataSource={products}
                        showSorterTooltip={{
                            title: 'Click để sắp xếp'
                        }}
                    />
                )}
            </div>
            <AddNewProduct
                storeOptions={stores}
                show={showAddNew} onClose={preOnCloseAddNew}/>
            <UpdateProduct
                storeOptions={stores} show={showUpdate} onClose={preOnCloseUpdate}
                productEdit={productEdit}/>
            <ImportWarehouseProduct show={showImportWarehouseProduct} onClose={preOnCloseImportWarehouseProduct}
                                    productEdit={productEdit}/>
            <ErrorModal
                title={<div className={`${isDarkMode ? 'dark-mode' : ' '} `}>Xoá sản phẩm</div>}
                onCancel={preOnCloseDelete}
                onOk={onHandleDelete} open={showModalDelete}>
                <div className={'p-6'}>
                    <p className={`${isDarkMode ? 'text-neutrals-400' : 'text-semantics-grey02'}`}>Bạn có chắc chắn
                        muốn <span className={'text-semantics-red02'}>xoá</span> sản phẩm {' '}
                        <span className={'font-bold'}>{productEdit.TenSanPham}</span>
                        {' '}này không?</p>
                </div>
            </ErrorModal>
            <CreateItemProductPrinter
                open={showPrinterPDF}
                onClose={() => {
                    onResetProductEdit();
                    setShowPrinterPDF(false)
                }}
                productName={productEdit.TenSanPham || ''}
                goldRate={valuesPrinter[productEdit.IDSanPham || '']?.goldRateFormat}
                laborCost={valuesPrinter[productEdit.IDSanPham || '']?.laborCostFormat}
            />
            {(isPendingUpdateProduct || loadingStores || loadingProducts || fetchingProducts) &&
                <Loading/>}
        </div>
    );
};

export default Product;