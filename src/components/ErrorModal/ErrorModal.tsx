import {Modal} from "antd";
import Button from "../Button";
import {ReactNode} from "react";
import ButtonGradient from "../ButtonGradient";
import {useTheme} from "../../context/ThemeContext.tsx";

interface ErrorModalProps {
    onCancel?: () => void;
    onOk: () => void;
    okText?: string;
    cancelText?: string;
    open: boolean;
    children: ReactNode,
    title: ReactNode
}

const ErrorModal = (props: ErrorModalProps) => {
    const {isDarkMode} = useTheme();
    return (
        <Modal
            styles={{content: {backgroundColor: isDarkMode ? 'var(--color-dark-2C2C)' : ''},header: {color: isDarkMode ? 'var(--color-dark-2C2C)' : '',backgroundColor: isDarkMode ? 'var(--color-dark-2C2C)' : ''}}}
            destroyOnClose
            title={<div className={`${isDarkMode ? 'text-neutrals-400' : ''}`}>{props.title}</div>}
            footer={
                <div className={'flex gap-x-[8px] w-full justify-end '}>
                    <Button
                        className={`${isDarkMode ? 'border-darkGrey-3838-important text-neutrals-50' : ''} h-[40px] `}
                        name={props.cancelText || 'Đóng'}
                        key="back" onClick={props?.onCancel}/>
                    <ButtonGradient
                        className={`${isDarkMode ? 'border-darkGrey-3838-important' : ''} 
                        h-[40px] w-[150px]`}
                        onClick={props?.onOk}
                        name={props.okText || 'Xác nhận'}
                        key="submit"/>
                </div>

            }
            open={props.open}
            onCancel={props?.onCancel}
        >
                {props.children}
        </Modal>
    );
};

export default ErrorModal;