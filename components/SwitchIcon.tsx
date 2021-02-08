import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Image,Animated,Easing, StyleSheet } from 'react-native';

const ItemHeight = 56;
const IconWrapperSize = ItemHeight * 0.5;
const IconSize = IconWrapperSize * 0.6;
const IconSliderWidth = IconWrapperSize * 2;
const IconSliderHeight = IconWrapperSize * 0.7;

const BaseIcon = (props: {
    color: string
    icon: string,
    iconWrapperSize: number,
}) => {
    const color = props?.color ?? '#ffffff';
    const iconSize = props.iconWrapperSize * 0.6;
    return (
        <View style={[
            styles.iconWrapper,
            { backgroundColor: color }
        ]}>
            <Image source={{ uri: props.icon }} style={{ height: iconSize, width: iconSize }} resizeMode="contain" />
        </View>
    )
}

const SwitchIcon = React.memo((props: {
    icon?: string,
    on: boolean,
    sliderColor?: string,
    sliderActiveColor?: string
    dotColor?: string,
    chooseCallback?: any,
    sliderFrame?: {
        width: number,
        height: number
    },
    iconWrapperSize?: number,
}) => {
    const offsetValue = IconSliderWidth - IconWrapperSize;

    const sliderColor = props?.sliderColor ?? '#e8e8e8';
    const dotColor = props?.dotColor ?? '#ffffff';
    const sliderActiveColor = props?.sliderActiveColor ?? '#3287FE'
    const sliderWidth = props?.sliderFrame?.width ?? IconSliderWidth;
    const sliderHeight = props?.sliderFrame?.height ?? IconSliderHeight;
    const iconWrapperSize = props?.iconWrapperSize ?? IconWrapperSize;

    const [on, seton] = useState(props.on);
    const offset = useRef(new Animated.Value(props.on ? offsetValue : 0)).current;
    const offsetAimatedStyle = {
        transform: [
            { translateX: offset }
        ]
    };
    const opacity = useRef(new Animated.Value(props.on ? 1.0 : 0)).current;
    const opacityAnimatedStyle = {
        opacity: opacity
    };
    const _tapHandler = () => {
        if (on) {//切换到关闭状态
            Animated.timing(offset,{
                useNativeDriver:true,
                toValue:0,
                duration: 300, easing: Easing.bezier(.17, 1.09, .68, .97)
            }).start(() => {
                props?.chooseCallback && props?.chooseCallback(false);
            })
            seton(false);
        } else {//切换到打开状态
            Animated.timing(offset,{
                useNativeDriver:true,
                toValue:offsetValue,
                duration: 300, easing: Easing.bezier(.17, 1.09, .68, .97)
            }).start(() => {
                props?.chooseCallback && props?.chooseCallback(true);
            })
            seton(true);
        }
    };
    useEffect(() => {
        if (on) { //激活底色
            Animated.timing(opacity,{
                useNativeDriver:false,
                toValue: 1.0,
                duration: 500, 
                easing: Easing.linear
            }).start();
        } else {//关闭底色
            Animated.timing(opacity,{
                useNativeDriver: false,
                toValue:0.0,
                duration: 500, 
                easing: Easing.linear
            }).start();
        }
    }, [on])
    return (
        <Pressable
            onPress={_tapHandler}
            style={[styles.iconSlider, {
                backgroundColor: sliderColor,
                width: sliderWidth,
                height: sliderHeight,
                borderRadius: sliderHeight / 2
            }]}>
            <Animated.View style={[
                offsetAimatedStyle,
                styles.iconWrapper,
                {
                    backgroundColor: dotColor,
                    height: iconWrapperSize,
                    width: iconWrapperSize,
                    borderRadius: iconWrapperSize / 2,
                }
            ]}>
                {props?.icon && <BaseIcon color={dotColor} icon={props.icon} iconWrapperSize={iconWrapperSize}/>}
            </Animated.View>
            <Animated.View style={[
                styles.iconSlider,
                styles.iconSliderActiveLayer,
                {
                    backgroundColor: sliderActiveColor,
                    width: sliderWidth,
                    height: sliderHeight,
                    borderRadius: sliderHeight / 2
                },
                opacityAnimatedStyle
            ]} />
        </Pressable>
    )
})

export default SwitchIcon;

const styles = StyleSheet.create({
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000000',
        shadowOpacity: 0.21,
        shadowRadius:3,
        shadowOffset:{width:2,height:1}
    },
    iconSlider: {
        justifyContent: 'center'
    },
    iconSliderActiveLayer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1
    }
})