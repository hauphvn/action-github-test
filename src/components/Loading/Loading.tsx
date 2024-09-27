import {HashLoader} from "react-spinners";
import {CSSProperties} from "react";

const Loading = () => {

    const override: CSSProperties = {
        display: 'block',
        margin: '0 auto',
    }
    return (
        <div
            className={'z-[9999] fixed w-screen h-screen flex justify-center items-center top-0 left-0 bg-rgba-black-12'}>
            <div className={'absolute w-full h-full top-0 left-0 bg-transparent'}
                 onClick={(e) => {
                     e.stopPropagation();
                 }}
                 onKeyDown={(e) => {
                     e.stopPropagation();
                 }}
            ></div>
            <HashLoader
                color={'#0E5932'}
                loading={true}
                cssOverride={override}
                aria-label="Loading Spinner"
                data-testid="loader"
            />
        </div>
    );
};

export default Loading;