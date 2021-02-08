import { useCallback, useEffect,useRef,useState } from 'react';
import { EmptyFunc, TypeChecker } from '../base';

interface Configs {
    silenceTime?: number;
    violenceTapCallback?: any;
}

const useTapGuardian = (onTap:any,configs?:Configs) => {

    const preTapTime = useRef(Date.now());
    const comboCount = useRef(0);

    const silenceTime = configs?.silenceTime ?? 800;
    const violenceTapCallback = configs?.violenceTapCallback ?? EmptyFunc;

    const validationChecker = () => {
        let rest_time = Date.now() - preTapTime.current;
        preTapTime.current = Date.now();
        if (rest_time >= silenceTime) {
            comboCount.current = 0;
            return true;
        } else {
            comboCount.current += 1;
            return false;
        }
    }

    const callback = useCallback(() => {
        let valide = validationChecker();
        if(valide){
            TypeChecker(onTap,"function") && onTap();
        }else{
            TypeChecker(onTap,"function") && violenceTapCallback()
        }
    },[onTap]);


    return callback;

}

export default useTapGuardian;