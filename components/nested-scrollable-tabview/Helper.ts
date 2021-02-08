import useStatusHeight from '!/JSSuperKit/hooks/useStatusHeight';
import {sw,sh,isAndroid} from '../../base';

const HeaderBaseHeight = isAndroid ? 48 : 44;

interface RangeType {
    scale:string;
    translate:string;
}

const IMAGE_HEIGHT = 200;
const SEG_UNIT = sh * 0.1;
const EDGE_SEG = SEG_UNIT * 4;
const FACTOR = 0.5;

function getRanges(type:keyof RangeType,imageHeight?:number){
    let imgHeight = imageHeight ?? IMAGE_HEIGHT;
    if(type == 'scale'){
        return ({inputRange: [
                0, 
                EDGE_SEG,
                EDGE_SEG + 20, 
                EDGE_SEG + 50, 
                EDGE_SEG + 90, 
                999999],
            outputRange: [
                1, 
                1.8, 
                1.85, 
                1.88, 
                1.89, 
                2]});
    }else{
        return ({
            inputRange: [
                0, 
                EDGE_SEG,
                EDGE_SEG + 20, 
                EDGE_SEG + 50, 
                EDGE_SEG + 90, 
                999999
            ],
            outputRange: [
                0,
                imgHeight*(1.8 - 1) * FACTOR,
                imgHeight*(1.85 - 1) * FACTOR,
                imgHeight*(1.88 - 1) * FACTOR,
                imgHeight*(1.89 - 1) * FACTOR,
                imgHeight*(2 - 1) * FACTOR,
            ]
        })
    }
};

const useNavigationBarHeight = (navigationBarBaseHeight?:number) => {
    let baseHeight = navigationBarBaseHeight ?? HeaderBaseHeight;
    const statusBarHeight = useStatusHeight();

    return baseHeight + statusBarHeight;
}

export {
    getRanges,
    useNavigationBarHeight,
    HeaderBaseHeight
}