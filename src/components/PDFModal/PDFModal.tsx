import { Modal } from 'antd';
import ButtonGradient from "../ButtonGradient";
import {useTheme} from "../../context/ThemeContext.tsx";

interface PDFModalProps {
    visible: boolean;
    onClose: () => void;
    pdfUrl: string;
}

const PDFModal = ({ visible, onClose, pdfUrl }: PDFModalProps) => {
    const {isDarkMode} = useTheme();
    return (
        <Modal
            styles={{content: {backgroundColor: isDarkMode ? 'var(--color-dark-2C2C)' : ''},header: {color: isDarkMode ? 'var(--color-dark-2C2C)' : '',backgroundColor: isDarkMode ? 'var(--color-dark-2C2C)' : ''}}}
            destroyOnClose
            open={visible} onCancel={onClose} footer={
                <div style={{ textAlign: 'center' }}>
                    <ButtonGradient
                        className={`${isDarkMode ? 'border-darkGrey-3838-important' : ''} h-[49px] w-[180px] text-[18px] px-[26px]`}
                        name={'Đóng'}
                        onClick={onClose}/>
                </div>
        } width="80%">
            <iframe src={pdfUrl} width="100%" height="600px" />
        </Modal>
    );
};

export default PDFModal;