import {IconPlus, IconRemove} from "../../assets/svgs/SVGIcon.tsx";
import {useEffect, useRef, useState} from "react";
import ImageDefault from "../../assets/imgs/defaul-img.png";
import toast from "react-simple-toasts";
import {MaxSizeImageUpload, ToastAlert} from "../../constants";
import {useTheme} from "../../context/ThemeContext.tsx";

interface ImageProductImportProps {
    urlImg: string | File,
    caption?: string,
    id: string,
    onChange: (file: File | undefined, id: string, keyName: string) => void
    keyName: string,
    onReaderFileBinary?: (file: ArrayBuffer | null,keyName: string, fileType: string) => void
}

const ImageProductImport = (props: ImageProductImportProps) => {
    // const [fileImg, setFileImg] = useState<File | undefined>(undefined);
    const fileRef = useRef<HTMLInputElement>(null);
    const [imageUpload, setImageUpload] = useState<string>('')
    const {isDarkMode} = useTheme();
    function handleImgUpload(event: React.ChangeEvent<HTMLInputElement>) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const file = event?.target?.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            // setFileImg(file);
            if(!file?.type.includes('image')){
                console.log('error type');
                toast(ToastAlert.OnlyImage,{
                    zIndex: 9999,
                    position: 'top-right',
                    theme: isDarkMode ? 'dark' : 'light',
                    className: 'shadow shadow-dangerLight  text-danger'
                })
            }else if(file?.size > MaxSizeImageUpload){
                toast(ToastAlert.MaxSizeImageUpload3kb,{
                    zIndex: 9999,
                    position: 'top-right',
                    theme: isDarkMode ? 'dark' : 'light',
                    className: 'shadow shadow-dangerLight  text-danger'
                })
            } else{
                setImageUpload(reader?.result?.toString() ||
                    '');
                props.onChange(file, props.id, props.keyName);
            }

        }
        reader.readAsDataURL(file);
        if(fileRef.current){
            fileRef.current.value = '';
        }
    }

    // useEffect(() => {
    //     setImageUpload(typeof props.urlImg === 'string' ? props.urlImg : URL.createObjectURL(props.urlImg));
    // }, [props.urlImg]);
    useEffect(() => {
        if (!!props.urlImg && typeof props.urlImg === 'string') {
            setImageUpload(typeof props.urlImg === 'string' ? props.urlImg : URL.createObjectURL(props.urlImg));
        }
    }, [props.urlImg]);
    return (
        <div className={'image-product-import-root relative overflow-hidden'}>
            <label
                htmlFor={`image-upload-${props.id}`}
                className={'container border border-dashed rounded-[8px] hover:cursor-pointer border-greenTo w-[137px] aspect-square flex flex-col gap-y-[5px] justify-center items-center'}>
                {!imageUpload && (
                   <div className={'flex flex-col gap-y-[5px] justify-center items-center'}>
                       <IconPlus classNamePath={'stroke-greenTo'}/>
                       <div className={'text-[12px] font-[500] text-greenTo'}>Thêm mới</div>
                   </div>
                )}
            </label>
            {imageUpload && (
                <div>
                    <div onClick={
                        () => {
                            // setFileImg(undefined);
                            setImageUpload('');
                            props.onChange(undefined, props.id, props.keyName);
                        }
                    }
                         className={'absolute hover:cursor-pointer right-[10px] top-[10px] z-10 w-[17px] h-[17px] bg-neutrals-200 rounded-full flex justify-center items-center '}>
                        <IconRemove/>
                    </div>
                    <div className={'absolute top-0 left-0 '}>
                        <img
                            className={'w-[137px] aspect-square rounded-[8px]'}
                            src={imageUpload ? imageUpload : ImageDefault}
                            alt="Lỗi hình ảnh"/>
                    </div>
                </div>
            )}
            <input
                ref={fileRef}
                name={'image'} // Backend must have a field name is 'image' for multer middleware example: upload.single('image')
                id={`image-upload-${props.id}`}
                type={'file'}
                multiple={false}
                accept={'image/*'}
                className={'hidden'}
                onChange={(e) => handleImgUpload(e)}
            />
            <div className={'pt-[12px] text-neutrals-700 text-[12px] font-[500]'}>{props.caption}</div>
        </div>
    );
};

export default ImageProductImport;