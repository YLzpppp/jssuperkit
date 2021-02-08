import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ViewStyle, Platform, ImageStyle, TextStyle } from 'react-native';
import useAdaptiveColor from '../../hooks/useAdaptiveColor';
import { CacheableImage } from '../images';
import { EmptyFunc,sw,isPad } from '../../base';
import StatusView from '../statusview/StatusView';


const CARD_WIDTH = sw * 0.29;
const CARD_HEIGHT = CARD_WIDTH * 4.2/3;
const SCALE_FACTOR = 0.68;
const DEFAULT_RECT = {
    width: isPad ? CARD_WIDTH * SCALE_FACTOR : CARD_WIDTH,
    height: isPad ? CARD_HEIGHT * SCALE_FACTOR : CARD_HEIGHT
};
const RADIUS = 8;

const MovieCardTwo = React.memo((props: {
    data?: {
        cover: string;
        title: string;
        subtitle: string;
        score?: string | number
    },
    rect?: { width: number, height: number },
    containerStyle?: ViewStyle[],
    coverStyle?: ImageStyle[],
    titleStyle?: TextStyle,
    titleOption?: { fontSize: number; color: string; fontWeight: string };
    subtitleOption?: { fontSize: number; color: string; fontWeight: string };
    onPress?: any,
}) => {

    const data = props?.data;

    const primaryColor = useAdaptiveColor(undefined, "title");
    const secondaryColor = useAdaptiveColor({ lightColor: '#B4B4B4', darkColor: '#B4B4B4' });

    const placeholderColor1 = useAdaptiveColor(undefined,"placeholder1");

    const titleColor = props?.titleOption?.color ?? primaryColor;
    const titleFontSize = props?.titleOption?.fontSize ?? font(14);
    const titleFontWeight:any = props?.titleOption?.fontWeight ?? 'bold';

    const subtitleColor = props?.subtitleOption?.color ?? secondaryColor;
    const subtitleFontSize = props?.subtitleOption?.fontSize ?? font(12.5);
    const subtitleFontWeight:any = props?.subtitleOption?.fontWeight ?? 'normal';

    const coverStyle = props?.coverStyle ?? [];
    const containerStyle = props?.containerStyle ?? [];

    const rect = props?.rect ?? DEFAULT_RECT;

    const onPress = props?.onPress ?? EmptyFunc;
    const cover = data?.cover ?? "";
    const title = data?.title ?? "";
    const subtitle = data?.subtitle ?? "";
    const score = data?.score ?? 0;



    return (
        <Pressable onPress={onPress} style={[styles.container, ...containerStyle]}>
            <CacheableImage url={cover} style={[styles.cover_wrapper, { width: rect.width, height: rect.height,backgroundColor:placeholderColor1,borderRadius: RADIUS}, ...coverStyle]} resizeMode={"cover"} />
            <Text numberOfLines={1} style={[{
                color: titleColor,
                maxWidth: rect.width * 0.9,
                fontSize: titleFontSize,
                fontWeight: titleFontWeight,
                lineHeight: titleFontSize*1.5,
            }, styles.title, props.titleStyle]}>
                {title}
            </Text>
            <StatusView show={subtitle != ""}>
                <Text numberOfLines={1} style={[
                    {
                        color: subtitleColor,
                        maxWidth: rect.width*0.9,
                        fontSize: subtitleFontSize,
                        fontWeight: subtitleFontWeight,
                        lineHeight: subtitleFontSize*1.5
                    }
                ]}>
                    <StatusView show={score > 0}>
                        <Text style={{ fontWeight: "500" }}>{score}分 </Text>
                    </StatusView>
                    {subtitle}
                </Text>
            </StatusView>
        </Pressable>
    );
});

export default MovieCardTwo;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    cover: {
        borderRadius: 5,
    },
    cover_wrapper: {
        marginBottom: 8,
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOpacity: 0.28,
                shadowRadius: 5,
                shadowOffset: {
                    width: 0,
                    height: 3
                }
            },
            android: {
                elevation: 8
            }
        })
    },
    title: {
        textAlign: 'center',
    }
});