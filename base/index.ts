import React from 'react';
import AppProvider from '../AppProvider';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions,Platform ,PixelRatio} from 'react-native';
import { isTablet } from 'react-native-device-info';
const { width: ww, height: wh } = Dimensions.get('window');
const { width: sw, height: sh } = Dimensions.get('screen');

const isPad = isTablet();

const isAndroid = Platform.OS == 'android';

export {sw,sh,ww,wh,isPad,isAndroid};
/**
 * ====================================
 * ====================================
 * 
 *  @屏幕字体适配
 * 
 * ====================================
 * ====================================
 */


const DeviceBaseWidth = isPad ? 768 : 375; //iphone6
const RealWidth = sh > sw ? sw : sh;

const font = (fontsize: number) => {
    return Math.round((fontsize * RealWidth) / DeviceBaseWidth);
};

const pixelratio = PixelRatio.get();
const getPixel = (dp:number) => {
    return PixelRatio.roundToNearestPixel((1/pixelratio)*dp);
}


export { font,getPixel };
/**
 * ====================================
 * ====================================
 * 
 *  @类型判断
 * 
 * ====================================
 * ====================================
 */

interface TypeKind {
    string: string;
    function: string;
    null: string;
    undefined: string;
    number: string;
}

/**
 * @param target   目标对象
 * @param kind     判断类型
 */
const TypeChecker = (target: any, kind: keyof TypeKind) => {
    if (kind === 'null') {
        return target === null;
    } else if (kind === 'undefined') {
        return target === undefined
    } else {
        return typeof (target) === kind;
    }
}
/**
 * @param target 
 * 等于null 或者 undefined 则返回 true
 * 否则为有效值
 */
const NullChecker = (target: any) => {
    return target === null || target === undefined;
}

/**
 * @空函数
 */
const EmptyFunc = () => {
    return;
}

export {
    TypeChecker,
    NullChecker,
    EmptyFunc
}

/**
 * ====================================
 * ====================================
 * 
 *  @格式化
 * 
 * ====================================
 * ====================================
 */

const getLocalDay = (d) => {
    let day = "";
    switch (d.getDay()) {
        case 0:
            day = "星期天"
            break;
        case 1:
            day = "星期一"
            break;
        case 2:
            day = "星期二"
            break;
        case 3:
            day = "星期三"
            break;
        case 4:
            day = "星期四"
            break;
        case 5:
            day = "星期五"
            break;
        case 6:
            day = "星期六"
            break;
        default:
            break;
    }
    return day;
}

const TimeFormatter = {
    getLocalDay
}

const k =  1000;
const w =  10000;
const qw = 10000000;
const y =  100000000;

const converToBigUnit = (num:number) => {
    if(num < k){
        return num;
    }else if(num < w){
        return (num/k).toFixed(1) + '千';
    }else if(num < qw){
        return (num/w).toFixed(1) + '万';
    }else if(num < y){
        return (num/qw).toFixed(1) + '千万';
    }else{
        return (num/y).toFixed(1) + '亿';
    }
};

const NumberFormatter = {
    converToBigUnit
}

function replaceErrorContent(err: any){
    let msg = err.message.replace("GraphQL error:", "");
    return msg;
};

export { TimeFormatter,NumberFormatter,replaceErrorContent };

/**
 * ====================================
 * ====================================
 * 
 *  @控制台日志输出
 * 
 * ====================================
 * ====================================
 */

const LOG = {
    info: (...args) => {
        if(__DEV__ && AppProvider.shared.debugLevel>=0) console.log('【Info】 ',...args);
    },
    warn: (...args) => {
        if(__DEV__ && AppProvider.shared.debugLevel>=1) console.log('【Warning】 ',...args);
    },
    error: (...args) => {
        if(__DEV__ && AppProvider.shared.debugLevel>=2) console.log('【Error】 ',...args);
    }
}

export { LOG }



/**
 * ====================================
 * ====================================
 * 
 *  @Storage
 * 
 * ====================================
 * ====================================
 */

const setItem = async (key:any,value:any,onError?:(e)=>void) => {
    try {
        const v = JSON.stringify(value)
        await AsyncStorage.setItem(key,v);
    } catch(e) {
        onError && onError(e);
        //console.log('item '+key+' failed save to storage');
    }
};

const removeItem = async (key:any,onError?:(e)=>void) => {
    try {
        await AsyncStorage.removeItem(key)
      } catch(e) {
        // remove error
        onError && onError(e);
      }
};

const removeMultiItems = async (keys: any[],onError?:(e)=>void) => {
    try {
        await AsyncStorage.multiRemove(keys)
      } catch(e) {
        // remove error
        onError && onError(e);
      }
}

const removeAllItems = async () => {
    AsyncStorage.clear();
}

const getItem = async (key: any,onError?:(e)=>void) => {
    try {
        let str = await AsyncStorage.getItem(key);
        if(str == null) return str;
        return JSON.parse(str);
    } catch (e) {
        onError && onError(e);
        return null;
    }
}
const Storage = {
    setItem,
    getItem,
    removeItem,
    removeMultiItems,
    removeAllItems
};
export { Storage }