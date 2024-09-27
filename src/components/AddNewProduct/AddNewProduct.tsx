import {Drawer} from "antd";
import Button from "../Button";
import ButtonGradient from "../ButtonGradient";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {formAddEditProduct, formAddEditProductDefault} from "../../constants/SchemaYups.ts";
import Input from "../Input";
import Select from "../Select";
import {IconSelectArrowLarge} from "../../assets/svgs/SVGIcon.tsx";
import Switch from "../Swtich";
import {
    BtnBold,
    BtnBulletList,
    BtnItalic,
    BtnLink,
    BtnNumberedList,
    BtnRedo,
    BtnStrikeThrough,
    BtnUnderline,
    BtnUndo,
    ContentEditableEvent,
    Editor,
    EditorProvider,
    Toolbar
} from 'react-simple-wysiwyg';
import ImageProductImport from "../ImageProductImport";
import {IImageUpdateRequest, INewProductRequest} from "../../types";
import {useTheme} from "../../context/ThemeContext.tsx";
import {FolderImageOnFtp, TypeAddNewProductImage, UnitOptions, WarrantyOptions} from "../../constants/AppContants.ts";
import {StoreOptions} from "../../pages/Product/Product.tsx";
import {STORAGE_ITEM} from "../../constants/StorageItem.ts";
import {useMutation} from "@tanstack/react-query";
import Loading from "../Loading/Loading.tsx";
import {post} from "../../libs";
import {API_PATH} from "../../constants/Path.ts";
import toast from "react-simple-toasts";
import CurrencyInput from "../CurrencyInput";
import {ToastAlert} from "../../constants";
import {LoaderPinwheel} from "lucide-react";
import {generateSimpleId} from "../../utils";

interface AddNewProductProps {
    show: boolean,
    onClose: (isReload: boolean) => void,
    onSubmit?: () => void,
    storeOptions: StoreOptions[],
}

const AddNewProduct = (props: AddNewProductProps) => {
    const {isDarkMode} = useTheme();
    const [tabIndex, setTabIndex] = useState<'info' | 'desc' | 'image'>('info');
    const [htmlDescription, setHtmlDescription] = useState('');
    const [productImgs, setProductImgs] = useState<{ id: string, urlImg: string | File, keyName: string }[]>([]);
    const [newImageUploaded, setNewImageUploaded] = useState<{ file: File | null, name: string }[]>([]);
    const [imagesChange, setImagesChange] = useState<IImageUpdateRequest>({
        loai: TypeAddNewProductImage
    });
    const [typeObjCurrent, setTypeObjCurrent] = useState<{
        type?: string;
        type2?: string;
        type3?: string;
        type4?: string;
        type5?: string;
    }>({})

    function preOnTabClick(type: 'info' | 'desc' | 'image') {
        setTabIndex(type);
    }

    const setInfoTemp = () => {
        const salePrice = getValues('salePrice');
        const discount = getValues('discount');
        sessionStorage.setItem('infoTemp', JSON.stringify({
            salePrice,
            discount
        }));
    }
    const getInfoTemp = (): { salePrice: string, discount: string } => {
        const infoTemp = sessionStorage.getItem('infoTemp');
        if (infoTemp) {
            return JSON.parse(infoTemp);
        }
        return {
            salePrice: '0',
            discount: '0'
        }
    }
    const resetInfoTemp = () => {
        sessionStorage.removeItem('infoTemp');
        sessionStorage.removeItem('fileNameDelete');
        sessionStorage.removeItem('fileNameNew');
        sessionStorage.removeItem('fileNameOld');
        sessionStorage.removeItem('productId');
        setNewImageUploaded([]);
    }
    const {
        formState: {errors, isDirty, isValid},
        control: controlAddNewProduct,
        setValue,
        getValues,
        watch,
        reset
    } = useForm({
        resolver: yupResolver(formAddEditProduct()),
        mode: 'all',
        defaultValues: formAddEditProductDefault
    })

    function onChangeEditorDescription(e: ContentEditableEvent) {
        setHtmlDescription(e.target.value);
        setValue('description', e.target.value, {
            shouldValidate: true,
            shouldDirty: true
        });
    }


    function getTempImage(): string[] {
        return JSON.parse(sessionStorage.getItem('fileNameOriginal') || '["","","","",""]');
    }

    useEffect(() => {
        setProductImgs([
            {
                urlImg: '',
                id: generateSimpleId(),
                keyName: 'URLImage'
            },
            {
                urlImg: '',
                id: generateSimpleId(),
                keyName: 'URLImage2'
            },
            {
                urlImg: '',
                id: generateSimpleId(),
                keyName: 'URLImage3'
            },
            {
                urlImg: '',
                id: generateSimpleId(),
                keyName: 'URLImage4'
            },
            {
                urlImg: '',
                id: generateSimpleId(),
                keyName: 'URLImage5'
            }
        ]);
        const subscription = watch((value, {name}) => {
            if (name === 'discount') {
                const salePrice = parseInt(getValues('salePrice') ?? '0');
                const discountPrice = parseInt(value.discount || '0') / 100 * salePrice;
                setValue('priceAfterDiscount', (salePrice - discountPrice).toString(), {
                    shouldValidate: true,
                    shouldDirty: true
                });
            }
            if (name === 'salePrice') {
                const salePrice = parseInt(value.salePrice || '0');
                const discountPrice = parseInt(getValues(('discount')) || '0');
                setValue('priceAfterDiscount', (salePrice - (discountPrice / 100 * salePrice)).toString(), {
                    shouldValidate: true,
                    shouldDirty: true
                })
            }
            if (name === 'isContactPrice') {
                if (value.isContactPrice) {
                    setInfoTemp();
                    setValue('salePrice', '0', {
                        shouldValidate: true,
                        shouldDirty: true
                    });
                    setValue('discount', '0', {
                        shouldValidate: true,
                        shouldDirty: true
                    });
                    setValue('priceAfterDiscount', '0', {
                        shouldValidate: true,
                        shouldDirty: true
                    });
                } else {
                    const {salePrice, discount} = getInfoTemp();
                    setValue('salePrice', salePrice, {
                        shouldValidate: true,
                        shouldDirty: true
                    });
                    setValue('discount', discount, {
                        shouldValidate: true,
                        shouldDirty: true
                    });
                }
            }

        });
        return () => subscription.unsubscribe();
    }, [watch, getValues, setValue]);

    useEffect(() => {
        return () => {
            resetInfoTemp();
            sessionStorage.removeItem('fileNameOriginal');
        }
    }, []);
    const onUpdateFile = async (productId: string) => {
        const formData = new FormData();
        formData.append('folder', FolderImageOnFtp.Products);
        formData.append('productId', productId);
        if (newImageUploaded.length > 0) {
            newImageUploaded.forEach(item => {
                if (item?.file) {
                    formData.append('filesUpdated', item.file, item.name);
                }
            })
        } else {
            formData.append('filesUpdated', '');
        }

        console.log(formData);

        const res = await post(API_PATH.HANDLE_FILE.ADD_NEW_FILE_PRODUCT_IMAGE_V2, formData
        );
        return res.data;
    }
    const onAddNewProduct = async () => {
        const dataBody: INewProductRequest = {
            tensanpham: getValues('productName'),
            sanphamtructuyen: getValues('isOnlineSale') ? 1 : 0,
            soluong: parseInt(getValues('quantity') ?? '0'),
            trigia: parseInt(getValues('importPrice') ?? '0'),
            giaban: getValues('isContactPrice') ? 0 : parseInt(getValues('salePrice') ?? '0'),
            iddonvitinh: parseInt(getValues('unit') ?? '0'),
            idcuahang: parseInt(getValues('store') ?? '0'),
            giatritiente: '&#8363',
            mota: htmlDescription,
            giamgia: getValues('isContactPrice') ? 0 : parseInt(getValues('discount') ?? '0'),
            thoigianbaohanh: parseInt(getValues('warranty') ?? '0'),
            khoiluong: parseInt(getValues('weight') ?? '0'),
            dai: parseInt(getValues('length') ?? '0'),
            rong: parseInt(getValues('width') ?? '0'),
            cao: parseInt(getValues('height') ?? '0'),
            idnguoidung: parseInt(localStorage.getItem(STORAGE_ITEM.USER_ID) || sessionStorage.getItem(STORAGE_ITEM.USER_ID) || '-1', 10),
        };
        if (typeObjCurrent?.type) {
            dataBody.type = typeObjCurrent.type;
        }
        if (typeObjCurrent?.type2) {
            dataBody.type2 = typeObjCurrent.type2;
        }
        if (typeObjCurrent?.type3) {
            dataBody.type3 = typeObjCurrent.type3;
        }
        if (typeObjCurrent?.type4) {
            dataBody.type4 = typeObjCurrent.type4;
        }
        if (typeObjCurrent?.type5) {
            dataBody.type5 = typeObjCurrent.type5;
        }
        const res = await post(API_PATH.PRODUCT.ADD_NEW, dataBody);
        return res.data;
    }

    function handleOnChangeImg(file: File | undefined, id: string, keyName: string) {
        if (file === undefined) { // Delete image
            if (imagesChange?.filename) {
                const fileNameClone = JSON.parse((sessionStorage.getItem('fileNameNew')) || '["","","","",""]');
                const fileNameDelete: (string | undefined)[] = JSON.parse(sessionStorage.getItem('fileNameDelete') || '["","","","",""]');
                const fileNameNew = fileNameClone.filter((name: string) => {
                    if (keyName === 'URLImage' && !!imagesChange?.filename) {
                        return name !== imagesChange.filename[0];
                    }
                    if (keyName === 'URLImage2' && !!imagesChange?.filename) {
                        return name !== imagesChange.filename[1];
                    }
                    if (keyName === 'URLImage3' && !!imagesChange?.filename) {
                        return name !== imagesChange.filename[2];
                    }
                    if (keyName === 'URLImage4' && !!imagesChange?.filename) {
                        return name !== imagesChange.filename[3];
                    }
                    if (keyName === 'URLImage5' && !!imagesChange?.filename) {
                        return name !== imagesChange.filename[4];
                    }
                });

                if (keyName === 'URLImage') {
                    fileNameDelete[0] = (imagesChange.filename[0] || '');
                    setValue('URLImage', '', {
                        shouldValidate: true,
                        shouldDirty: true
                    });
                    setTypeObjCurrent(pre => ({
                        ...pre,
                        type: undefined
                    }))
                }
                if (keyName === 'URLImage2') {
                    fileNameDelete[1] = (imagesChange.filename[1] || '');
                    setValue('URLImage2', '', {
                        shouldValidate: true,
                        shouldDirty: true
                    });
                    setTypeObjCurrent(pre => ({
                        ...pre,
                        type2: undefined
                    }))
                }
                if (keyName === 'URLImage3') {
                    fileNameDelete[2] = (imagesChange.filename[2] || '');
                    setValue('URLImage3', '', {
                        shouldValidate: true,
                        shouldDirty: true
                    });
                    setTypeObjCurrent(pre => ({
                        ...pre,
                        type3: undefined
                    }))
                }
                if (keyName === 'URLImage4') {
                    fileNameDelete[3] = (imagesChange.filename[3] || '');
                    setValue('URLImage4', '', {
                        shouldValidate: true,
                        shouldDirty: true
                    });
                    setTypeObjCurrent(pre => ({
                        ...pre,
                        type4: undefined
                    }))
                }
                if (keyName === 'URLImage5') {
                    fileNameDelete[4] = (imagesChange.filename[4] || '');
                    setValue('URLImage5', '', {
                        shouldValidate: true,
                        shouldDirty: true
                    });
                    setTypeObjCurrent(pre => ({
                        ...pre,
                        type5: undefined
                    }))
                }
                const keyNameTyped = keyName as keyof typeof formAddEditProductDefault;
                setValue(keyNameTyped, '', {
                    shouldValidate: true,
                    shouldDirty: true
                });
                sessionStorage.setItem('fileNameNew', JSON.stringify(fileNameNew));
                sessionStorage.setItem('fileNameDelete', JSON.stringify(fileNameDelete));
            }
        } else { // Change image
            let newImg: string | File = '';
            const newProductImgs = productImgs.map(img => {
                if (img.id === id) {
                    newImg = file ? URL.createObjectURL(file) : img.urlImg;
                    return {
                        id: img.id,
                        urlImg: newImg,
                        keyName: img.keyName
                    }
                }
                return img;
            })
            setProductImgs(newProductImgs);
            const keyNameTyped = keyName as keyof typeof formAddEditProductDefault;
            setValue(keyNameTyped, newImg, {
                shouldValidate: true,
                shouldDirty: true
            });


            const newProductImgLocal = productImgs.map(img => {
                if (img?.keyName === keyName) {
                    const imgLocal = file ? URL.createObjectURL(file) : img.urlImg;
                    return {
                        id: img.id,
                        urlImg: imgLocal,
                        keyName: img.keyName
                    }
                }
                return img;
            })
            setProductImgs(newProductImgLocal);

            // Update fileNameNew session storage
            const fileNameClone = JSON.parse((sessionStorage.getItem('fileNameNew')) || '["","","","",""]');
            // const fileNameDelete: (string | undefined)[] = JSON.parse(sessionStorage.getItem('fileNameDelete') || '["","","","",""]');
            const fileNameOld: (string | undefined)[] = JSON.parse(sessionStorage.getItem('fileNameOld') || '["","","","",""]');
            const imagesOriginal = getTempImage();
            if (keyName === 'URLImage') {
                fileNameClone[0] = file?.name;
                setTypeObjCurrent(pre => ({
                    ...pre,
                    type: file?.type
                }))
                fileNameOld[0] = imagesOriginal[0];
                setNewImageUploaded(pre => {
                    return [...pre, {
                        name: '_1',
                        file: file
                    }]
                })
                sessionStorage.setItem('fileNameOld', JSON.stringify(fileNameOld));
            }
            if (keyName === 'URLImage2') {
                fileNameClone[1] = file?.name;
                setTypeObjCurrent(pre => ({
                    ...pre,
                    type2: file?.type
                }))
                fileNameOld[1] = imagesOriginal[1];
                setNewImageUploaded(pre => {
                    return [...pre, {
                        name: '_2',
                        file: file
                    }]
                })
                sessionStorage.setItem('fileNameOld', JSON.stringify(fileNameOld));
            }
            if (keyName === 'URLImage3') {
                fileNameClone[2] = file?.name;
                setTypeObjCurrent(pre => ({
                    ...pre,
                    type3: file?.type
                }))
                fileNameOld[2] = imagesOriginal[2]
                setNewImageUploaded(pre => {
                    return [...pre, {
                        name: '_3',
                        file: file
                    }]
                })
                sessionStorage.setItem('fileNameOld', JSON.stringify(fileNameOld));
            }
            if (keyName === 'URLImage4') {
                fileNameClone[3] = file?.name;
                setTypeObjCurrent(pre => ({
                    ...pre,
                    type4: file?.type
                }))
                fileNameOld[3] = imagesOriginal[3];
                setNewImageUploaded(pre => {
                    return [...pre, {
                        name: '_4',
                        file: file
                    }]
                })
                sessionStorage.setItem('fileNameOld', JSON.stringify(fileNameOld));
            }
            if (keyName === 'URLImage5') {
                fileNameClone[4] = file?.name;
                setTypeObjCurrent(pre => ({
                    ...pre,
                    type5: file?.type
                }))
                fileNameOld[4] = imagesOriginal[4];
                setNewImageUploaded(pre => {
                    return [...pre, {
                        name: '_5',
                        file: file
                    }]
                })
                sessionStorage.setItem('fileNameOld', JSON.stringify(fileNameOld));
            }
        }
    }

    async function handleReaderFileBinary(binary: ArrayBuffer | null, keyName: string) {
        if (keyName === 'URLImage') {
            setImagesChange(pre => ({
                ...pre,
                file1: binary
            }))
        }
        if (keyName === 'URLImage2') {
            setImagesChange(pre => ({
                ...pre,
                file2: binary
            }))
        }
        if (keyName === 'URLImage3') {
            setImagesChange(pre => ({
                ...pre,
                file3: binary
            }))
        }
        if (keyName === 'URLImage4') {
            setImagesChange(pre => ({
                ...pre,
                file4: binary
            }))
        }
        if (keyName === 'URLImage5') {
            setImagesChange(pre => ({
                ...pre,
                file5: binary
            }))
        }
    }

    const {
        mutate: mutateUploadFile,
        isPending: isPendingUploadFile
    } = useMutation({
        mutationKey: ['upProductImage'],
        mutationFn: onUpdateFile,
        onSuccess: (res) => {
            if (res) {
                console.log('res:', res);
                if (res?.statusCodes === 500) {
                    toast('Thêm hình ảnh sản phẩm thất bại',
                        {
                            zIndex: 9999,
                            position: 'top-center',
                            theme: isDarkMode ? 'dark' : 'light',
                            className: 'shadow shadow-dangerLight  text-danger'
                        });
                } else {
                    toast('Thêm sản phẩm thành công',
                        {
                            zIndex: 9999,
                            position: 'top-center',
                            theme: isDarkMode ? 'dark' : 'light',
                            className: 'shadow shadow-successLight  text-success'
                        });
                    reset();
                    props.onClose(true);
                }

            } else {
                toast('Thêm hình ảnh sản phẩm thất bại',
                    {
                        zIndex: 9999,
                        position: 'top-center',
                        theme: isDarkMode ? 'dark' : 'light',
                        className: 'shadow shadow-dangerLight  text-danger'
                    });
            }
        },
        onError: () => {
            toast('Thêm sản phẩm thất bại',
                {
                    zIndex: 9999,
                    position: 'top-center',
                    theme: isDarkMode ? 'dark' : 'light',
                    className: 'shadow shadow-dangerLight  text-danger'
                });
        }
    })
    const {
        mutate: mutateAddNewProduct,
        isPending: isPendingAddNewProduct,
    } = useMutation({
        mutationKey: ['addNewProduct'],
        mutationFn: onAddNewProduct,
        onSuccess: (data) => {
            if (data?.length > 0 && data[0]?.success === '01') {
                const fileNameArray = data[0]?.TenTapTin?.split(',');
                sessionStorage.setItem('fileNameNew', JSON.stringify(fileNameArray));
                setImagesChange(pre => ({
                    ...pre,
                    filename: fileNameArray
                }));
                mutateUploadFile(data[0]?.IDSanPham);
            } else {
                toast('Thêm sản phẩm thất bại',
                    {
                        zIndex: 9999,
                        position: 'top-center',
                        theme: isDarkMode ? 'dark' : 'light',
                        className: 'shadow shadow-dangerLight  text-danger'
                    });
            }
        },
        // onError: () => {
        //     toast('Thêm sản phẩm thất bại',
        //         {
        //
        //             position: 'top-center',
        //             theme: isDarkMode ? 'dark' : 'light',
        //             className: 'shadow shadow-dangerLight  text-danger'
        //         });
        // }
    })

    function preSubmit() {
        if (!typeObjCurrent.type?.includes('image')) {
            toast(ToastAlert.PresentProductImageIsRequired, {
                position: 'top-right',
                theme: isDarkMode ? 'dark' : 'light',
                className: 'shadow shadow-dangerLight  text-danger',
                zIndex: 9999
            })
        } else {
            mutateAddNewProduct();
        }
    }

    return (
        <Drawer
            width={489}
            className={'update-product-drawer transition-all duration-300'}
            styles={{
                body: {background: isDarkMode ? 'var(--color-dark-2E2E)' : ''},
                header: {
                    paddingBottom: 0,
                    background: isDarkMode ? 'var(--color-dark-2E2E)' : '',
                    borderBottomColor: isDarkMode ? 'var(--color-dark-2727)' : '--color-neutrals-50'
                },
            }}
            title={<div
                className={`${isDarkMode ? 'text-neutrals-400' : 'text-semantics-grey01'}  text-[32px] font-[500]`}>
                Thêm
                mới</div>}
            destroyOnClose maskClosable={false} closeIcon={null} onClose={() => props.onClose}
            open={props.show}>
            <div id={'update-product-container'}
                 className={`${isDarkMode ? 'bg-darkGrey-2E2E' : ''} add-new-product-container flex justify-between flex-col h-full w-[435px]`}>
                <div className="update-contents-container w-full">
                    <div className="actions-tab flex mb-[24px] fixed w-full gap-x-[17px] ">
                        <div
                            onClick={() => preOnTabClick('info')}
                            className={`
                             ${tabIndex === 'info' ? (isDarkMode ? ' border-[1.5px] border-darkGrey-3838 bg-darkGrey-2E2E text-neutrals-400 font-[600]' : ' border-[1.5px] border-greenFrom bg-semantics-green03 text-semantics-green01 font-[600]') : (isDarkMode ? 'bg-darkGrey-3333 text-neutrals-600 ' : 'bg-neutrals-50 text-neutrals-700')}'} 
                              hover:cursor-pointer rounded-[8px] flex justify-center items-center  w-[131px] h-[42px]`}>
                            Thông tin
                        </div>
                        <div
                            onClick={() => preOnTabClick('desc')}
                            className={`
                            ${tabIndex === 'desc' ? (isDarkMode ? ' border-[1.5px] border-darkGrey-3838 bg-darkGrey-2E2E text-neutrals-400 font-[600]' : ' border-[1.5px] border-greenFrom bg-semantics-green03 text-semantics-green01 font-[600]') : (isDarkMode ? 'bg-darkGrey-3333 text-neutrals-600 ' : 'bg-neutrals-50 text-neutrals-700')}'} 
                                hover:cursor-pointer rounded-[8px] flex justify-center items-center  w-[131px] h-[42px]`}>
                            Mô tả
                        </div>
                        <div
                            onClick={() => preOnTabClick('image')}
                            className={`
                             ${tabIndex === 'image' ? (isDarkMode ? ' border-[1.5px] border-darkGrey-3838 bg-darkGrey-2E2E text-neutrals-400 font-[600]' : ' border-[1.5px] border-greenFrom bg-semantics-green03 text-semantics-green01 font-[600]') : (isDarkMode ? 'bg-darkGrey-3333 text-neutrals-600 ' : 'bg-neutrals-50 text-neutrals-700')}'} 
                               hover:cursor-pointer  rounded-[8px] flex justify-center items-center  w-[131px] h-[42px]`}>
                            Hình ảnh
                        </div>
                    </div>
                    <div
                        className={`${tabIndex === 'info' ? 'visible' : 'hidden'} form-container mt-[70px] max-h-[75vh] overflow-y-scroll scroll-smooth`}>
                        <Controller
                            control={controlAddNewProduct}
                            name='productName'
                            render={({field: {onChange, onBlur, value}}) => (
                                <div className={'control h-[98px] px-[2px]'}>
                                    <label htmlFor={'productName'}
                                           className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                        Tên sản phẩm
                                        <span className={'text-semantics-red02'}>*</span>
                                    </label>
                                    <div className={'relative flex '}>
                                        <div className={'w-full max-h-[50px]'}>
                                            <Input
                                                warning={errors.productName?.message}
                                                id={'account'}
                                                className={`${isDarkMode ? 'bg-darkGrey-3636 border-darkGrey-2E2E placeholder-semantics-grey02 text-semantics-grey03 ' : 'bg-neutrals-200'} h-[50px] pl-[11px]`}
                                                placeholder={'Nhập tên sản phẩm'}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                value={value || ''}
                                            />
                                        </div>
                                        <span
                                            className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.productName?.message || ''}
                                            </span>
                                    </div>
                                </div>
                            )}
                        />
                        <Controller
                            control={controlAddNewProduct}
                            name='store'
                            render={({field: {value, onChange}}) => (
                                <div className={'control h-[92px]'}>
                                    <label htmlFor={'store'}
                                           className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                        Cửa hàng
                                        <span className={'text-semantics-red02'}>*</span>
                                    </label>
                                    <div className={'relative flex px-[2px]'}>
                                        <div className={'w-full max-h-[50px]'}>
                                            <Select
                                                mode={'single'}
                                                onChange={onChange}
                                                value={value || ''}
                                                suffixIcon={<IconSelectArrowLarge/>}
                                                className={`control-add-product custom-select-dropdown ${isDarkMode ? 'placeholder-dark border-dark bg-darkGrey-2E2E rounded-[8px] select-dark-content ' : 'bg-neutrals-200 '} h-[50px] text-[12px]`}
                                                options={props.storeOptions}
                                                placeholder={'Chọn cửa hàng'}/>
                                        </div>
                                        <span
                                            className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.store?.message || ''}
                                            </span>
                                    </div>
                                </div>
                            )}
                        />
                        <div
                            className={`${isDarkMode ? 'bg-darkGrey-3838' : 'bg-neutrals-300'} horizontal-line w-full h-[1px] mb-[16px]`}></div>
                        <div className={'text-semantics-red02 text-[12px] mb-[24px]'}>(*) Sản phẩm phải được nhập theo
                            giá ĐÃ TÍNH VAT
                        </div>
                        <div className="form-row flex gap-x-[40px] w-full flex-auto items-center">
                            <div className={'flex-1'}>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='warranty'
                                    render={({field: {value, onChange}}) => (
                                        <div className={'control h-[98px]'}>
                                            <label htmlFor={'warranty'}
                                                   className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                                Bảo hành
                                                <span className={'text-semantics-red02'}>*</span>
                                            </label>
                                            <div className={'relative flex px-[2px] '}>
                                                <div className={'w-full max-h-[50px]'}>
                                                    <Select
                                                        onChange={onChange}
                                                        value={value || ''}
                                                        mode={'single'}
                                                        suffixIcon={<IconSelectArrowLarge/>}
                                                        className={`control-add-product custom-select-dropdown ${isDarkMode ? 'placeholder-dark border-dark bg-darkGrey-2E2E rounded-[8px] select-dark-content ' : 'bg-neutrals-200 '} h-[50px] text-[12px]`}
                                                        options={WarrantyOptions} placeholder={'Thời gian bảo hành'}/>
                                                </div>
                                                <span
                                                    className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.warranty?.message || ''}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='isOnlineSale'
                                    render={({field: {value, onChange}}) => (
                                        <div className={'flex gap-x-[15px] flex-1 items-center'}>
                                            <label className={'min-w-[109px] text-[14px] font-[500] text-neutrals-700'}
                                                   htmlFor="isOnlineSale">Bán
                                                trực tuyến</label>
                                            <Switch
                                                checked={value}
                                                onChange={onChange}
                                            />
                                        </div>
                                    )}
                                />

                            </div>
                        </div>
                        <div className="form-row flex gap-x-[40px] w-full flex-auto items-center">
                            <div className={'flex-1'}>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='unit'
                                    render={({field: {value, onChange}}) => (
                                        <div className={'control h-[98px]'}>
                                            <label htmlFor={'unit'}
                                                   className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                                Đơn vị tính
                                                <span className={'text-semantics-red02'}>*</span>
                                            </label>
                                            <div className={'relative flex px-[2px] '}>
                                                <div className={'w-full max-h-[50px]'}>
                                                    <Select
                                                        onChange={onChange}
                                                        value={value || ''}
                                                        mode={'single'}
                                                        suffixIcon={<IconSelectArrowLarge/>}
                                                        className={`control-add-product custom-select-dropdown ${isDarkMode ? 'placeholder-dark border-dark bg-darkGrey-2E2E rounded-[8px] select-dark-content ' : 'bg-neutrals-200 '} h-[50px] text-[12px]`}
                                                        options={UnitOptions} placeholder={'Đơn vị tính'}/>
                                                </div>
                                                <span
                                                    className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.unit?.message || ''}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='isContactPrice'
                                    render={({field: {value, onChange}}) => (
                                        <div className={'flex gap-x-[15px] flex-1 items-center'}>
                                            <label className={'min-w-[109px] text-[14px] font-[500] text-neutrals-700'}
                                                   htmlFor="isContactPrice">Giá liên hệ</label>
                                            <Switch
                                                checked={value}
                                                onChange={onChange}
                                            />
                                        </div>
                                    )}
                                />

                            </div>
                            {/*<div className={'flex gap-x-[15px] flex-1 items-center'}>*/}
                            {/*    <label className={'min-w-[109px] text-[14px] font-[500] text-neutrals-700'}*/}
                            {/*           htmlFor="isOnlineSale">Giá liên hệ</label>*/}
                            {/*    <Switch*/}
                            {/*    />*/}
                            {/*</div>*/}
                        </div>
                        <div className="form-row flex gap-x-[8px] w-full flex-auto items-center">
                            <div className={'flex-1'}>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='importPrice'
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <div className={'control h-[98px]'}>
                                            <label htmlFor={'productName'}
                                                   className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                                Giá nhập
                                                <span className={'text-semantics-red02'}>*</span>
                                            </label>
                                            <div className={'relative flex px-[2px] '}>
                                                <div className={'w-full max-h-[50px]'}>
                                                    <CurrencyInput
                                                        warning={errors.importPrice?.message}
                                                        id={'account'}
                                                        className={`${isDarkMode ? 'bg-darkGrey-3636 border-darkGrey-2E2E placeholder-semantics-grey02 text-semantics-grey03 ' : 'bg-neutrals-200'} h-[50px] pl-[11px]`}
                                                        placeholder={'Nhập giá nhập'}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        value={value || ''}
                                                    />
                                                </div>
                                                <span
                                                    className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.importPrice?.message || ''}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className={'flex-1'}>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='salePrice'
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <div className={'control h-[98px]'}>
                                            <label htmlFor={'salePrice'}
                                                   className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                                Giá bán
                                                <span className={'text-semantics-red02'}>*</span>
                                            </label>
                                            <div className={'relative flex px-[2px] '}>
                                                <div className={'w-full max-h-[50px]'}>
                                                    <CurrencyInput
                                                        disabled={getValues('isContactPrice')}
                                                        warning={errors.salePrice?.message}
                                                        id={'salePrice'}
                                                        className={`${isDarkMode ? 'bg-darkGrey-3636 border-darkGrey-2E2E placeholder-semantics-grey02 text-semantics-grey03 ' : 'bg-neutrals-200'} h-[50px] pl-[11px]`}
                                                        placeholder={'Nhập giá bán'}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        value={value}
                                                    />
                                                </div>
                                                <span
                                                    className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.salePrice?.message || ''}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="form-row flex gap-x-[8px] w-full flex-auto items-center">
                            <div className={'flex-1'}>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='discount'
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <div className={'control h-[92px]'}>
                                            <label htmlFor={'discount'}
                                                   className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                                Giảm giá(%)
                                                <span className={'text-semantics-red02'}>*</span>
                                            </label>
                                            <div className={'relative flex px-[2px] '}>
                                                <div className={'w-full max-h-[50px]'}>
                                                    <Input
                                                        disabled={getValues('isContactPrice')}
                                                        warning={errors.discount?.message}
                                                        id={'discount'}
                                                        className={`${isDarkMode ? 'bg-darkGrey-3636 border-darkGrey-2E2E placeholder-semantics-grey02 text-semantics-grey03 ' : 'bg-neutrals-200'} h-[50px] pl-[11px]`}

                                                        placeholder={'Giảm giá'}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        value={value || ''}
                                                    />
                                                </div>
                                                <span
                                                    className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.discount?.message || ''}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className={'flex-1'}>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='priceAfterDiscount'
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <div className={'control h-[92px]'}>
                                            <label htmlFor={'priceAfterDiscount'}
                                                   className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                                Giá sau giảm
                                                <span className={'text-semantics-red02'}>*</span>
                                            </label>
                                            <div className={'relative flex px-[2px] '}>
                                                <div className={'w-full max-h-[50px]'}>
                                                    <CurrencyInput
                                                        disabled
                                                        warning={errors.salePrice?.message}
                                                        id={'priceAfterDiscount'}
                                                        className={`${isDarkMode ? 'bg-darkGrey-3636 border-darkGrey-2E2E placeholder-semantics-grey02 text-semantics-grey03 ' : 'bg-neutrals-200'} h-[50px] pl-[11px]`}

                                                        placeholder={'Giá sau giảm'}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        value={value || ''}
                                                    />
                                                </div>
                                                <span
                                                    className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.priceAfterDiscount?.message || ''}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <div
                            className={`${isDarkMode ? 'bg-darkGrey-3838' : 'bg-neutrals-300'} horizontal-line w-full h-[1px] mb-[16px]`}></div>
                        <div className="form-row flex gap-x-[8px] w-full flex-auto items-center">
                            <div className={'flex-1'}>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='quantity'
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <div className={'control h-[98px]'}>
                                            <label htmlFor={'quantity'}
                                                   className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                                Số lượng
                                                <span className={'text-semantics-red02'}>*</span>
                                            </label>
                                            <div className={'relative flex px-[2px] '}>
                                                <div className={'w-full max-h-[50px]'}>
                                                    <Input
                                                        warning={errors.quantity?.message}
                                                        id={'quantity'}
                                                        className={`${isDarkMode ? 'bg-darkGrey-3636 border-darkGrey-2E2E placeholder-semantics-grey02 text-semantics-grey03 ' : 'bg-neutrals-200'} h-[50px] pl-[11px]`}

                                                        placeholder={'Nhập số lượng'}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        value={value || ''}
                                                    />
                                                </div>
                                                <span
                                                    className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.quantity?.message || ''}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className={'flex-1'}>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='weight'
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <div className={'control h-[98px]'}>
                                            <label htmlFor={'weight'}
                                                   className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                                Khối lượng
                                                <span className={'text-semantics-red02'}>*</span>
                                            </label>
                                            <div className={'relative flex px-[2px] '}>
                                                <div className={'w-full max-h-[50px]'}>
                                                    <Input
                                                        warning={errors.weight?.message}
                                                        id={'account'}
                                                        className={`${isDarkMode ? 'bg-darkGrey-3636 border-darkGrey-2E2E placeholder-semantics-grey02 text-semantics-grey03 ' : 'bg-neutrals-200'} h-[50px] pl-[11px]`}

                                                        placeholder={'Nhập khối lượng'}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        value={value || ''}
                                                    />
                                                </div>
                                                <span
                                                    className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.weight?.message || ''}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="form-row flex gap-x-[8px] w-full flex-auto items-center">
                            <div className={'flex-1'}>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='length'
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <div className={'control h-[98px]'}>
                                            <label htmlFor={'length'}
                                                   className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                                Dài(mm)
                                                <span className={'text-semantics-red02'}>*</span>
                                            </label>
                                            <div className={'relative flex px-[2px] '}>
                                                <div className={'w-full max-h-[50px]'}>
                                                    <Input
                                                        warning={errors.importPrice?.message}
                                                        id={'length'}
                                                        className={`${isDarkMode ? 'bg-darkGrey-3636 border-darkGrey-2E2E placeholder-semantics-grey02 text-semantics-grey03 ' : 'bg-neutrals-200'} h-[50px] pl-[11px]`}

                                                        placeholder={'Nhập chiều dài'}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        value={value || ''}
                                                    />
                                                </div>
                                                <span
                                                    className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.length?.message || ''}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className={'flex-1'}>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='width'
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <div className={'control h-[98px]'}>
                                            <label htmlFor={'width'}
                                                   className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                                Rộng(mm)
                                                <span className={'text-semantics-red02'}>*</span>
                                            </label>
                                            <div className={'relative flex px-[2px] '}>
                                                <div className={'w-full max-h-[50px]'}>
                                                    <Input
                                                        warning={errors.width?.message}
                                                        id={'width'}
                                                        className={`${isDarkMode ? 'bg-darkGrey-3636 border-darkGrey-2E2E placeholder-semantics-grey02 text-semantics-grey03 ' : 'bg-neutrals-200'} h-[50px] pl-[11px]`}

                                                        placeholder={'Nhập chiều rộng'}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        value={value || ''}
                                                    />
                                                </div>
                                                <span
                                                    className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.width?.message || ''}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                            <div className={'flex-1'}>
                                <Controller
                                    control={controlAddNewProduct}
                                    name='height'
                                    render={({field: {onChange, onBlur, value}}) => (
                                        <div className={'control h-[98px]'}>
                                            <label htmlFor={'height'}
                                                   className={'label text-[12px] font-[500] text-neutrals-700 pb-[7px]'}>
                                                Cao(mm)
                                                <span className={'text-semantics-red02'}>*</span>
                                            </label>
                                            <div className={'relative flex px-[2px] '}>
                                                <div className={'w-full max-h-[50px]'}>
                                                    <Input
                                                        warning={errors.salePrice?.message}
                                                        id={'height'}
                                                        className={`${isDarkMode ? 'bg-darkGrey-3636 border-darkGrey-2E2E placeholder-semantics-grey02 text-semantics-grey03 ' : 'bg-neutrals-200'} h-[50px] pl-[11px]`}

                                                        placeholder={'Nhập chiều cao'}
                                                        onChange={onChange}
                                                        onBlur={onBlur}
                                                        value={value || ''}
                                                    />
                                                </div>
                                                <span
                                                    className={'absolute bottom-[-17px] text-semantics-red02 text-[12px]'}>
                                                {errors.height?.message || ''}
                                            </span>
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className={`${tabIndex === 'desc' ? 'visible' : 'hidden'} form-container mt-[70px] max-h-[70vh] overflow-y-scroll scroll-smooth`}>
                        <EditorProvider>
                            <Editor
                                style={{color: isDarkMode ? 'var(--color-neutrals-400)' : ''}}
                                value={htmlDescription} onChange={onChangeEditorDescription}>
                                <Toolbar>
                                    <BtnRedo/>
                                    <BtnUndo/>
                                    <BtnBold/>
                                    <BtnItalic/>
                                    <BtnUnderline/>
                                    <BtnLink/>
                                    <BtnStrikeThrough/>

                                    <BtnBulletList/>
                                    <BtnNumberedList/>
                                </Toolbar>
                            </Editor>
                        </EditorProvider>
                    </div>

                    <div
                        className={`${tabIndex === 'image' ? 'visible' : 'hidden'} form-container mt-[70px] max-h-[70vh] overflow-y-scroll scroll-smooth`}>
                        <div className={'text-semantics-red02 text-[12px] font-[500] mb-[24px]'}>(*) Dung lượng
                            hình {'<300KB'}</div>
                        <div className={'flex gap-[9px] flex-wrap'}>
                            {productImgs.map((item, index) => (
                                <ImageProductImport
                                    onReaderFileBinary={handleReaderFileBinary}
                                    keyName={item.keyName}
                                    onChange={handleOnChangeImg}
                                    id={item.id}
                                    caption={index === 0 ? 'Ảnh bìa' : 'Ảnh ' + index} key={item.id}
                                    urlImg={item.urlImg}/>
                            ))}
                        </div>

                    </div>

                </div>
                <div className="submit-container flex gap-x-[8px] pt-[5px] ">
                    <Button onClick={() => props.onClose(false)}
                            className={`${isDarkMode ? 'border-darkGrey-3838-important text-neutrals-50' : ''} h-[53px] w-[210px]`}
                            name={'Hủy'}/>
                    <ButtonGradient
                        icon={(isPendingAddNewProduct || isPendingUploadFile) ?
                            <LoaderPinwheel size={18} className={'animate-spin'}/> : null}

                        onClick={() => preSubmit()}
                        className={`${isDarkMode ? 'border-darkGrey-3838-important' : ''} h-[53px] w-[210px] gap-x-2`}
                        disabled={!(isDirty && isValid)}
                        name={'Thêm'}/>
                </div>
            </div>
            {isPendingAddNewProduct || isPendingUploadFile && <Loading/>}
        </Drawer>
    );
};

export default AddNewProduct;