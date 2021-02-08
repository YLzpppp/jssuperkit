import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, useColorScheme, Pressable, Image, Animated, Platform, Dimensions, StyleSheet, TextStyle } from 'react-native';
import SvgIcon from '../svgicon/SvgIcon';
import DefaultIcons from '../svgicon/DefaultIcons';
import StatusView from '../statusview/StatusView';
import { font, isAndroid,sw } from '../../base';
import { useNavigationBarHeight,HeaderBaseHeight } from './Helper';

const COLOR_WHITE = '#FFFFFF';
const COLOR_DARK = '#121212';

/**
 *  安卓顶部导航栏高 Material Design 当前标准为56，市场常见为 48 ,
 *  ios顶部导航栏
 *      非刘海屏： 导航栏 44 , 状态栏 20 , tabBar 49
 *      刘海屏 : 导航栏 44 , 状态栏 20 , tabBar 83
 */
const NavigationBar = React.memo((props: {
    navigation: any;
    onPopTop?: any;
    backHandler?: any;
    background?: string;
    centerTitle?: string;
    centerTitleStyle?: TextStyle;
    moreCallback?: any;
    leftComponent?: any;
    rightComponent?: any;
    centerComponent?: any;
    backButtonColor?: string;
    scrollOffset?: Animated.Value;

    isStatusBarTranslucent?: boolean;
    headerContentHeight: number;
    tabBarHeight: number;
    statusBarHeight: number;
    baseHeight?:number;
    renderCustomNavigationBar?: (props: any) => any;
}) => {
    const navigationBarHeight = useNavigationBarHeight();

    const schema = useColorScheme();
    const isDark = schema === 'dark';
    const defaultBackgroundColor = useMemo(() => isDark ? COLOR_DARK : COLOR_WHITE, [isDark]);
    const defaultTextColor = useMemo(() => isDark ? COLOR_WHITE : COLOR_DARK, [isDark]);
    const navigation = props.navigation;
    const backgroundColor = props?.background ?? defaultBackgroundColor;
    const title = props?.centerTitle ?? '';
    const backButtonColor = props?.backButtonColor ?? defaultBackgroundColor;

    const isStatusBarTranslucent = props?.isStatusBarTranslucent ?? false;
    const headerContentHeight = props.headerContentHeight;
    const tabBarHeight = props.tabBarHeight;
    const statusBarHeight = props.statusBarHeight;
    const navigationBarBaseHeight = props?.baseHeight ?? HeaderBaseHeight;

    const stopEdgeValue = useMemo(() => {
        if (isAndroid) {
            let _statusBarHeight = isStatusBarTranslucent ? 0 : statusBarHeight;
            return headerContentHeight - navigationBarHeight - tabBarHeight + _statusBarHeight;
        }
        return headerContentHeight - navigationBarHeight - tabBarHeight + statusBarHeight;
    }, [isStatusBarTranslucent, headerContentHeight, tabBarHeight, statusBarHeight, navigationBarHeight]);

    const backgroundOpacityInterpolate = useMemo(() => {
        return (
            props.scrollOffset?.interpolate({
                inputRange: [0, stopEdgeValue],
                outputRange: [0, 1]
            })
        )
    }, [stopEdgeValue, props.scrollOffset]);
    const buttonBackgroundOpacityInterpolate = useMemo(() => {
        return (
            props.scrollOffset?.interpolate({
                inputRange: [0, stopEdgeValue],
                outputRange: [1, 0]
            })
        )
    }, [stopEdgeValue, props.scrollOffset]);

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
        if (props?.onPopTop) {
            props.onPopTop();
        } else {
            navigation.goBack();
        }
    }

    const customNavigationBarProps = useMemo(() => ({
        height: navigationBarBaseHeight,
        scrollOffset: props.scrollOffset,
        navigation,
        title,
        isStatusBarTranslucent,
        headerContentHeight,
        tabBarHeight,
        statusBarHeight
    }),[navigationBarBaseHeight,props.scrollOffset,navigation,title,isStatusBarTranslucent,headerContentHeight,tabBarHeight,statusBarHeight])

    return (
        <View style={[styles.absolute,
        {
            zIndex: 99,
            height: navigationBarHeight,
            justifyContent: 'flex-end'
        }
        ]}>
            <StatusView show={props?.scrollOffset != undefined}>
                <Animated.View style={[styles.absolute, {
                    backgroundColor: backgroundColor,
                    opacity: backgroundOpacityInterpolate
                }]} />
            </StatusView>

            {
                props?.renderCustomNavigationBar ? props.renderCustomNavigationBar(customNavigationBarProps) : (
                    <View style={[styles.container, { height: navigationBarBaseHeight }]}>
                        <StatusView show={props?.leftComponent != undefined}>
                            <View style={styles.edgePart}>
                                {props?.leftComponent}
                            </View>
                        </StatusView>
                        <StatusView show={props?.leftComponent == undefined}>
                            <Pressable
                                onPress={backHandler}
                                style={styles.edgePart}>
                                <View style={[{
                                    padding: 5,
                                    justifyContent: 'center',
                                    alignSelf: 'flex-start',
                                    marginStart: 12
                                }]}>
                                    <Animated.View style={[styles.absolute,
                                    {
                                        backgroundColor: '#00000087',
                                        borderRadius: 30,
                                        overflow: 'hidden',
                                        opacity: buttonBackgroundOpacityInterpolate
                                    }]} />
                                    <SvgIcon name={DefaultIcons.arrowLeft} size={20} color={backButtonColor} />
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
                                    "props?.moreCallback" && (
                                        <View style={[{
                                            height:32,
                                            width:32,
                                            borderRadius:16,
                                            overflow:'hidden',
                                            justifyContent: 'center',
                                            alignItems:'center',
                                            alignSelf: 'flex-end',
                                            marginEnd: 14
                                        }]}>
                                            <Animated.View style={[styles.absolute,
                                            {
                                                backgroundColor: '#00000087',
                                                overflow: 'hidden',
                                                opacity: buttonBackgroundOpacityInterpolate
                                            }]} />
                                            <SvgIcon name={DefaultIcons.breezeMore} size={23} color={backButtonColor} style={{}} />
                                        </View>
                                    )
                                }
                            </Pressable>
                        </StatusView>
                    </View>
                )
            }
        </View>
    );
});

export default NavigationBar;

const styles = StyleSheet.create({
    container: {
        width: sw,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    back: {
        height: 36,
        width: 36,
        marginStart: 8,
    },
    more: {
        height: 23,
        width: 23,
        marginBottom: -3,
        marginEnd: 15
    },
    title: {
        fontSize: font(18),
    },
    edgePart: {
        flex: 1.5,
        height: '100%',
        justifyContent: 'center',
        // backgroundColor:"red"
    },
    centerPart: {
        flex: 2,
        height: '100%',
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