import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, useColorScheme, Pressable, Image, Animated, Platform, Dimensions, StyleSheet, TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, CommonActions } from '@react-navigation/native'
import SvgIcon from '../svgicon/SvgIcon';
import DefaultIcons from '../svgicon/DefaultIcons';
import StatusView from '../statusview/StatusView';
import { font,isAndroid } from '../../base';

const { width, height } = Dimensions.get('window');
const HeaderBaseHeight = isAndroid ? 48 : 44;
const BackIconSize = 36;
const MoreIconSize = 23;
const COLOR_WHITE = '#FFFFFF';
const COLOR_DARK = '#121212';

/**
 *  安卓顶部导航栏高 Material Design 当前标准为56，市场常见为 48 ,
 *  ios顶部导航栏
 *      非刘海屏： 导航栏 44 , 状态栏 20 , tabBar 49
 *      刘海屏 : 导航栏 44 , 状态栏 20 , tabBar 83
 */
const Header = React.memo((props: {
    navigation: any;
    popTop?: boolean;
    elevation?: number;
    background?: string;
    centerTitle?: string;
    centerTitleStyle?: TextStyle;
    moreCallback?: any;
    leftComponent?: any;
    rightComponent?: any;
    centerComponent?: any;
    absolute?: boolean;
    backButtonColor?: string;
    enableBackButtonShadow?: boolean;
    backHandler?: any;
    animateValue?: Animated.Value;
}) => {
    const schema = useColorScheme();
    const isDark = schema === 'dark';
    const defaultBackgroundColor = useMemo(() => isDark ? COLOR_DARK : COLOR_WHITE, [isDark]);
    const defaultTextColor = useMemo(() => isDark ? COLOR_WHITE : COLOR_DARK, [isDark]);
    const navigation = props.navigation;
    const elevation = props?.elevation ?? 0;
    const backgroundColor = props?.background ?? defaultBackgroundColor;
    const title = props?.centerTitle ?? '';
    const backButtonColor = props?.backButtonColor ?? defaultTextColor;
    const enableBackButtonShadow = props?.enableBackButtonShadow ?? false;

    const absoluteStyle = React.useMemo(() => {
        let abs = props?.absolute ?? false;
        return abs ? styles.absolute : {}
    }, [props?.absolute]);

    const shadowStyle = React.useMemo(() => {
        if(props?.elevation){
            return Platform.select({
                ios: {
                    shadowColor: '#000000',
                    shadowOpacity: 0.12,
                    shadowRadius: 6,
                    shadowOffset: { width: 1, height: 6 }
                },
                android: {
                    elevation:props.elevation
                }
            })
        }
    },[props.elevation]);

    const moreCallback = () => {
        if (props?.moreCallback) {
            props.moreCallback();
        }
    }

    const backHandler = () => {
        if (props?.backHandler != undefined) {
            props.backHandler();
            return;
        }
        if (props?.popTop) {
            navigation.dispatch(state => {
                return CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Home' }]
                })
            });
        } else {
            navigation.goBack();
        }
    }

    return (
        <SafeAreaView edges={["top"]} style={[absoluteStyle,shadowStyle]}>
            <StatusView show={props?.animateValue != undefined}>
                <Animated.View style={[styles.absolute, {
                    backgroundColor: backgroundColor,
                    opacity: props.animateValue?.interpolate({
                        inputRange: [0, 50],
                        outputRange: [0, 1]
                    })
                }]} />
            </StatusView>
            <StatusView show={props?.animateValue == undefined}>
                <View style={[styles.absolute, { backgroundColor: backgroundColor }]} />
            </StatusView>

            <View style={[styles.container]}>
                <StatusView show={props?.leftComponent != undefined}>
                    <View style={styles.edgePart}>
                        {props?.leftComponent}
                    </View>
                </StatusView>
                <StatusView show={props?.leftComponent == undefined}>
                    <Pressable
                        onPress={backHandler}
                        style={styles.edgePart}>
                        <View style={[enableBackButtonShadow ? styles.back_icon_shadow : {}]}>
                            <SvgIcon name={DefaultIcons.arrowLeft} size={24} color={backButtonColor} style={{ marginStart: 12 }} />
                        </View>
                    </Pressable>
                </StatusView>


                <StatusView show={props?.centerComponent != undefined}>
                    <View style={styles.centerPart}>
                        {props?.centerComponent}
                    </View>
                </StatusView>
                <StatusView show={props?.centerComponent == undefined}>
                    <View style={styles.centerPart}>
                        <Text style={[[styles.title, { color: defaultTextColor }, props.centerTitleStyle]]}>{title}</Text>
                    </View>
                </StatusView>


                <StatusView show={props?.rightComponent != undefined}>
                    <View style={styles.edgePart}>
                        {props?.rightComponent}
                    </View>
                </StatusView>
                <StatusView show={props?.rightComponent == undefined}>
                    <Pressable onPress={moreCallback} style={[styles.edgePart, { alignItems: 'flex-end' }]}>
                        {
                            props?.moreCallback && <SvgIcon name={DefaultIcons.breezeMore} size={30} color={backButtonColor} style={{ marginEnd: 14 }} />
                        }
                    </Pressable>
                </StatusView>
            </View>
        </SafeAreaView >
    );
});

export default Header;

const styles = StyleSheet.create({
    container: {
        width: width,
        height: HeaderBaseHeight,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    back: {
        height: BackIconSize,
        width: BackIconSize,
        marginStart: 8,
    },
    more: {
        height: MoreIconSize,
        width: MoreIconSize,
        marginBottom: -3,
        marginEnd: 15
    },
    title: {
        fontSize: font(18),
    },
    edgePart: {
        flex: 1.5,
        height: HeaderBaseHeight,
        justifyContent: 'center',
        // backgroundColor:"red"
    },
    centerPart: {
        flex: 3,
        height: HeaderBaseHeight,
        justifyContent: 'center',
        alignItems: "center",
        // backgroundColor:"green"
    },
    absolute: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    absolute_navigation_bar: {
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        zIndex: 900
    },
    back_icon_shadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOpacity: 0.3,
                shadowRadius: 3,
                shadowOffset: { width: 1, height: 1 }
            },
            android: {
                elevation: 2,
            }
        })
    },
})