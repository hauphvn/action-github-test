import {Input as InputAnt, InputProps as AntInputProps} from 'antd';
import {ReactNode} from "react";
import {EyeInvisibleOutlined, EyeTwoTone} from '@ant-design/icons';

interface InputProps extends Omit<AntInputProps, 'children'> {
    className?: string;
    iconopeneye: ReactNode;
    iconcloseeye: ReactNode;
    warning?: string
}

const InputPassword = (props: InputProps) => {
    return (
        <InputAnt.Password
            iconRender={(visible: boolean) => (visible ? (props?.iconopeneye ?
                    (<div className={' w-[24px] hover:cursor-pointer '}>
                        {props.iconopeneye ? props.iconopeneye : <EyeTwoTone/>}
                    </div>) :
                    <EyeTwoTone/>
            ) : (props?.iconcloseeye ? <div className={'w-[24px] hover:cursor-pointer'}>
                        {props?.iconcloseeye ? props.iconcloseeye : <EyeInvisibleOutlined/>}
                    </div> :
                    <EyeInvisibleOutlined/>
            ))}

            className={`
        w-full h-full rounded-[8px] px-[20px] py-[14px]
         ${props?.warning !== '' ? 'border-semantics-red02' : 'border-none '} 
          ` + props?.className}
            {...props}
        />
    );
};

export default InputPassword;