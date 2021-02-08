import React from 'react';
import {View, ViewStyle} from 'react-native';

export default React.memo((props:{
    width?: number,
    height?: number,
    radius?: number,
    color?: string,
    style?:ViewStyle
}) => {
    let h = props?.height ?? 1;
    let w = props?.width ?? '100%';
    let r = props?.radius ?? 0;
    let bg = props?.color ?? '#f1f1f1';
    let fs = props?.style ?? {};
    return (
        <View style={[{
            height: h,
            width: w,
            borderRadius: r,
            backgroundColor: bg
        }, fs ]}/>
    )
}) ;