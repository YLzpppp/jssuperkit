import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Image, Animated } from 'react-native';
import { EmptyFunc } from '../../base';

const UserBackground = React.memo((props: {
    height: number;
    containerPanMoveValue: Animated.Value;
    backgroundImageScaleRange:{inputRange,outputRange}
    onPress?:any;
    onLongPress?:any;
    source?:any;
}) => {
    const onPress = props?.onPress ?? EmptyFunc;
    const onLongPress = props?.onLongPress ?? EmptyFunc;
    
    const source = useMemo(() => {
        let _source = props?.source;
        if(_source == undefined){
            return {uri: ''}
        }
        if(typeof(_source) == 'string'){
            return {uri: _source}
        }else{
            return _source;
        }
    },[props.source])

    return (
        <Animated.View style={{
            transform: [{scale: props.containerPanMoveValue.interpolate(props.backgroundImageScaleRange)}]
        }}>
            <Pressable
                onPress={onPress}
                onLongPress={onLongPress}>
                <Image
                    source={source}
                    resizeMode={"cover"}
                    style={{ width: '100%', height: props.height }} />
            </Pressable>
        </Animated.View>
    );
});

export default UserBackground;