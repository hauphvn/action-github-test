import ImgNotfound from '../../assets/imgs/404.png';
import {useNavigate} from 'react-router-dom';
// import {ROUTES_PATH} from "../../constants";
const Notfound = () => {
const navigate = useNavigate();
// const location = useLocation();
    // const [goBackPath, setGoBackPath] = useState(ROUTES_PATH.HOME);
    // useEffect(() => {
    //     console.log(location);
    // }, [location]);
    return (
        <div className={'w-full flex justify-center items-center h-screen flex-col gap-y-[70px]'}>
            <div className={'w-[600px]'}>
                <img src={ImgNotfound} alt={'404'}/>
            </div>
            <div className={'text-center'}>
                <div className="title font-[700] text-[42px] text-semantics-grey01">
                    Trang không tìm thấy!
                </div>
                <div onClick={() => navigate(-1)} className={'hover:cursor-pointer hover:text-semantics-green02 font-[600] text-[24px] text-neutrals-700'}>Quay lại</div>
            </div>
        </div>
    );
};

export default Notfound;