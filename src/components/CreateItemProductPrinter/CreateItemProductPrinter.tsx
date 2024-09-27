import {Document, Page, Text, View, StyleSheet, pdf, Image} from '@react-pdf/renderer';
import {useEffect, useState} from "react";
import QR_PKG from "../../assets/imgs/qr-code-pkg.png";
import PDFModal from "../PDFModal";
import {Font} from '@react-pdf/renderer';

Font.register({
    family: 'Inter',
    src: '/fonts/Inter/Inter-Regular.ttf',
});
// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: 'row',
        backgroundColor: '#E4E4E4',
    },
    section: {
        margin: 5,
        padding: 5,
        flexGrow: 1,
    },
    image: {
        width: 100,
        height: 100,
    },
    title: {
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'Inter',
    },
    subtitle: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 10,
        fontFamily: 'Inter',
    }
});

interface ICreateItemProductPrinterProps {
    productName: string;
    goldRate?: string,
    laborCost?: string,
    open?: boolean,
    onClose?: () => void;
}

const CreateItemProductPrinter = (props: ICreateItemProductPrinterProps) => {
    const {productName, goldRate, laborCost, open, onClose} = props;
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);
    const generatePDF = async () => {
        const doc = (
            <Document
            >
                <Page
                    size="A4" style={styles.page}>
                    <View style={styles.section}>
                        <Image style={styles.image} src={QR_PKG}/>
                    </View>
                    <View style={styles.section}>
                        <Text style={styles.title}>{productName}</Text>
                        {goldRate && <Text style={styles.subtitle}>Tỉ lệ vàng: {goldRate}</Text>}
                        {laborCost && <Text style={styles.subtitle}>Công: {laborCost}</Text>}
                    </View>
                </Page>
            </Document>
        );

        const blob = await pdf(doc).toBlob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
    };
    useEffect(() => {
        if (open && productName) {
            generatePDF().then(() => {
                setVisible(true);
            }).catch((error) => {
                console.log('error', error);
            });
        }
        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
            setVisible(false);
        }
    }, [open, productName, goldRate, laborCost]);
    return (
        <div>
            {pdfUrl && <PDFModal visible={visible} onClose={() => {
                setVisible(false);
                onClose && onClose();
            }} pdfUrl={pdfUrl}/>}
        </div>
    );
};

export default CreateItemProductPrinter;