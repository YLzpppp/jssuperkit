import React from 'react';
import { View,Text,StyleSheet,PixelRatio } from 'react-native';
import useAdaptiveColor from '!/JSSuperKit/hooks/useAdaptiveColor';
import DividerLine from '../DividerLine';
import {font,getPixel} from '../../base';

// 126  164

const PlainSectionHeader = React.memo((props:{
    title?: string;
}) => {

    const ratio = 1/PixelRatio.get();

    const textColor =  useAdaptiveColor(undefined,'title');
    const borderColor = useAdaptiveColor(undefined,'border');

    return (
        <View style={[styles.container,{backgroundColor: borderColor}]}>
            <Text style={{color: textColor,fontSize:font(16)}}>{props?.title ?? ''}</Text>
            <DividerLine height={getPixel(1)} color={borderColor} style={styles.divider}/>
        </View>
    )
});
export default PlainSectionHeader;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingStart:13,
        justifyContent:'center',
        height:42
    },
    divider:{
        position:'absolute',
        bottom:0,
        right:0,
        left:0
    }
})