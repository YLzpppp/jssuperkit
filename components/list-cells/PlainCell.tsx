import React from 'react';
import { View,Text,StyleSheet,Pressable } from 'react-native';
import useAdaptiveColor from '!/JSSuperKit/hooks/useAdaptiveColor';
import DividerLine from '../DividerLine';
import {font,getPixel} from '../../base';

const PlainCell = React.memo((props:{
    title?: string;
    onPress?:any;
    onPressIn?:any;
    onPressOut?:any;
}) => {

    const textColor =  useAdaptiveColor(undefined,'body');
    const borderColor = useAdaptiveColor(undefined,'border');

    return (
        <Pressable 
        style={styles.container}
        onPress={props?.onPress}
        onPressIn={props?.onPressIn}
        onPressOut={props?.onPressOut}>
            <Text style={[{color: textColor},styles.text]}>{props?.title ?? ''}</Text>
            <DividerLine height={getPixel(1)} color={borderColor} style={styles.divider}/>
        </Pressable>
    )
});
export default PlainCell;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingStart:13,
        justifyContent:'center',
        height:54.6
    },
    divider:{
        position:'absolute',
        bottom:0,
        right:0
    },
    text:{
        fontSize:font(15),
        fontWeight:'400'
    }
})