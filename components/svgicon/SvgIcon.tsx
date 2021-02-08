import React, { useEffect, useState } from 'react';
import * as ART from '@react-native-community/art';
import { ViewStyle, View, Text, SafeAreaView, ScrollView, StyleSheet,Dimensions } from 'react-native';


const SvgIcon = (props: {
    name: string[],
    size?: number,
    color?: string,
    scale?: number,
    __debugBG?: string,
    offset?: {
        x?: number,
        y?: number
    }
    style?: ViewStyle
}) => {

    let n = props.name;
    let size = props.size ?? 28;
    let color = props.color ?? "#222";
    let scale = props.scale ?? (size * 0.001);
    let debugBG = props.__debugBG ?? "transparent";
    let x = props.offset?.x ?? 0;
    let y = props.offset?.y ?? 0;

    return (
        <ART.Surface height={size} width={size} style={[styles.center, { backgroundColor: debugBG }, props.style]}>
            <ART.Group>
                {n.map((item: string, index: number) => {
                    return <ART.Shape
                        key={index.toString()}
                        d={item}
                        fill={color}
                        stroke={color}
                        height={size}
                        scale={scale}
                        x={x}
                        y={y}
                    />
                })}
            </ART.Group>
        </ART.Surface>
    )
};
export default SvgIcon;

const styles = StyleSheet.create({
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})
