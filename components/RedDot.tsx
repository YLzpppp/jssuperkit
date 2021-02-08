import React, { useEffect, useState } from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { font } from '../base';
const RedDot = React.memo((props: {
    size?: number,
    bgColor?: string,
    color?: string,
    text: string,
    font?: number,
    frameStyle?: ViewStyle
}) => {
    let size = props?.size ?? 25;
    let bgColor = props?.bgColor ?? '#FE5757';
    let color = props?.color ?? 'white';
    let text = props?.text ?? '';
    let fontSize = props?.font ?? 16;

    if (text == '' || text == '0') return null;

    return (
        <View style={[{
            height: size,
            width: size,
            borderRadius: size / 2,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: bgColor
        }, props?.frameStyle ?? {}]}>
            <Text style={{ color: color, fontSize: font(fontSize), padding: 0, margin: 0 }}>{text}</Text>
        </View>
    )
});

export default RedDot;