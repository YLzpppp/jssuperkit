import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Text, Pressable, Animated, SafeAreaView, View, Image, BackHandler, Dimensions, useColorScheme, StyleSheet, InteractionManager, Platform } from "react-native";
import { BlurView } from '@react-native-community/blur';
const { width, height } = Dimensions.get('screen');
import SvgIcon from '../components/svgicon/SvgIcon';
import { observer } from 'mobx-react';
import navStore from './NavigationStore';
import { font } from '../base';
import navigationStore from './NavigationStore';
const isAndroid = Platform.OS === 'android';

const TABBAR_HEIGHT = 56;
const ICON_WRAPPER_SIZE = TABBAR_HEIGHT * 0.56;
const TITLE_HEIGHT = TABBAR_HEIGHT - ICON_WRAPPER_SIZE;
const ICON_SIZE = 26;
const ICON_SIZE_SCALE = ICON_SIZE * 0.001;


const DEFAULT_TINT_COLOR = '#007AFF';
const DEFAULT_TINT_COLOR_DARK = '#007AFF';
const DEFAULT_COLOR = '#868686';
const DEFAULT_COLOR_DARK = '#FFFFFF';
const DEFAULT_TABBAR_BACKGROUND = '#AAAAAA';
const DEFAULT_TABBAR_BACKGROUND_DARK = '#121212';

const Item = (props: {
    isFocused: boolean;
    onPress: any;
    name: string;
    tabItem: BZTabItem;
    setBackground: any;
    background: string;
    isOnSpecificedMode: boolean;
    setIsOnSpecificedMode: any;
}) => {
    const { onPress, isFocused, name, tabItem, setBackground, background, isOnSpecificedMode, setIsOnSpecificedMode } = props;
    const schema = useColorScheme();
    const isDark = schema === 'dark';

    const textFontSize = tabItem?.textOption?.fontSize ?? font(12);
    const textFontWeight = tabItem?.textOption?.fontWeight ?? 'normal';
    const textColor = tabItem?.textOption?.color ?? DEFAULT_COLOR;
    const textColorDark = tabItem?.textOption?.colorDark ?? DEFAULT_COLOR_DARK;
    const textTintColor = tabItem?.textOption?.tintColor ?? DEFAULT_TINT_COLOR;
    const textTintColorDark = tabItem?.textOption?.tintColorDark ?? DEFAULT_TINT_COLOR_DARK;
    const color = useMemo(() => {
        if (isOnSpecificedMode) {
            return textColorDark;
        } else {
            return isDark ? textColorDark : textColor;
        }
    }, [isDark, isOnSpecificedMode]);
    const tintColor = useMemo(() => isDark ? textTintColorDark : textTintColor, [isDark]);

    const svgIconName = tabItem?.svgicon?.name ?? [];
    const svgIconColor = tabItem?.svgicon?.options?.color ?? DEFAULT_COLOR;
    const svgIconColorDark = tabItem?.svgicon?.options?.colorDark ?? DEFAULT_COLOR_DARK;
    const svgIconSelectedColor = tabItem?.selectedSvgIcon?.options?.color ?? DEFAULT_TINT_COLOR;
    const svgIconSelectedColorDark = tabItem?.selectedSvgIcon?.options?.colorDark ?? DEFAULT_TINT_COLOR_DARK;
    const iconColor = useMemo(() => {
        if (isOnSpecificedMode) {
            return svgIconColorDark;
        } else {
            return isDark ? svgIconColorDark : svgIconColor;
        }
    }, [isDark, isOnSpecificedMode]);
    const iconTintColor = useMemo(() => isDark ? svgIconSelectedColorDark : svgIconSelectedColor, [isDark]);
    const iconSize = tabItem?.svgicon?.options?.size ?? ICON_SIZE;
    const iconScale = tabItem?.svgicon?.options?.scale ?? ICON_SIZE_SCALE;
    const iconOffset = tabItem?.svgicon?.options?.offset ?? { x: 0, y: 0 };

    const _callback = () => {
        if (tabItem?.tabBarBackgroundColor != undefined) {
            background != tabItem?.tabBarBackgroundColor && setBackground(tabItem?.tabBarBackgroundColor)
            setIsOnSpecificedMode(true);
        } else {
            if (isDark) {
                setBackground(navigationStore.tabBarOptions?.backgroundColorDark ?? DEFAULT_TABBAR_BACKGROUND_DARK);
            } else {
                setBackground(navigationStore.tabBarOptions?.backgroundColor ?? DEFAULT_TABBAR_BACKGROUND);
            }
            setIsOnSpecificedMode(false);
        }
    }
    const _onPress = () => {
        onPress(_callback)
    }

    return (
        <Pressable onPress={_onPress} style={[styles.center, styles.tab_item]}>
            <View style={styles.icon_wrapper}>
                <SvgIcon name={svgIconName} size={iconSize} scale={iconScale} offset={iconOffset} color={isFocused ? iconTintColor : iconColor} />
            </View>
            <View style={styles.title_wrapper}>
                <Text style={{
                    color: isFocused ? tintColor : color,
                    fontSize: textFontSize,
                    fontWeight: textFontWeight
                }}>
                    {name}
                </Text>
            </View>
        </Pressable>
    )
}

/**
 * @底部导航栏items
 */
const DefaultTabItems = observer((props: { data: any; setBackground: any; background: string; }) => {

    const { state, descriptors, navigation } = props.data;
    const tabScreen: BZTabScreenOption[] = props.data.tabScreen;
    const routes: any[] = state.routes;
    const [isOnSpecificedMode, setIsOnSpecificedMode] = useState(false);

    const renderTabItems = routes.map((route: any, index: number) => {
        let name = route?.name ?? "";
        let key = route?.key ?? index;
        let tabItem: any = null;
        for (let i of tabScreen) {
            if (i.name === name) {
                tabItem = i.tabItem;
                break;
            }
        }
        const isFocused = state.index === index; //focused on current tab ?

        const onPress = (callback: any) => {
            const event = navigation.emit({
                type: "tabPress",
                target: route.key
            });
            if (!isFocused && !event.defaultPrevented) {
                if (true) {
                    navigation.navigate(route.name);
                    callback && callback();
                } else {
                    navigation.navigate('登录');
                }
            }
            // impactOccurred("Medium")
        };

        return (
            <Item key={key} isFocused={isFocused} name={name} tabItem={tabItem} onPress={onPress} setBackground={props.setBackground} background={props.background} isOnSpecificedMode={isOnSpecificedMode} setIsOnSpecificedMode={setIsOnSpecificedMode} />
        )
    })


    return (
        <>
            {renderTabItems}
        </>
    )
});

/**
 * @默认底部导航栏
 */
const DefaultTabBar = observer((props: any) => {

    const schema = useColorScheme();
    const isDark = schema === 'dark';
    const initialized = useRef(false);
    const offsetAnimateValue = useRef(new Animated.Value(0)).current;
    const offsetAnimateStyle = {
        transform: [
            { translateY: offsetAnimateValue }
        ]
    };

    const translucentStyle = useMemo(() => navStore.isTabBarTranslucent ? styles.absolute : null, [navStore.isTabBarTranslucent]);
    const shadowStyle = useMemo(() => navStore.isShadowEnabled ? styles.tab_shadow : null, [navStore.isShadowEnabled]);
    const borderStyle = useMemo(() => navStore.isBorderEnabled ? styles.tab_border : null, [navStore.isBorderEnabled]);
    const backgroundOpacityValue = useMemo(() => navStore.isBlurEnabled ? (navigationStore.tabBarOptions?.blurBackgroundOpacity ?? 0.78) : 1.0, [navStore.isBlurEnabled])

    const [background, setBackground]: any[] = useState(navigationStore.tabBarOptions?.backgroundColor ?? DEFAULT_TABBAR_BACKGROUND);

    useEffect(() => {
        if (isDark) {
            setBackground(navigationStore.tabBarOptions?.backgroundColorDark ?? DEFAULT_TABBAR_BACKGROUND_DARK)
        } else {
            setBackground(navigationStore.tabBarOptions?.backgroundColor ?? DEFAULT_TABBAR_BACKGROUND)
        }
    }, [schema])


    useEffect(() => {
        if (initialized.current == true) {
            if (navStore.isTabBarHidden) {
                Animated.timing(offsetAnimateValue, { toValue: height * 0.3, duration: 302, useNativeDriver: true }).start();
            } else {
                Animated.timing(offsetAnimateValue, { toValue: 0, duration: 302, useNativeDriver: true }).start();
            }
        } else {
            initialized.current = true;
        }
    }, [navStore.isTabBarHidden]);

    if (!isAndroid) {
        return (
            <Animated.View style={[offsetAnimateStyle]}>
                <SafeAreaView style={[translucentStyle, shadowStyle, borderStyle]}>
                    <View style={[styles.absolute_fill, { backgroundColor: background, opacity: backgroundOpacityValue }]} />
                    {!isAndroid && navStore.isBlurEnabled && <BlurView style={[styles.absolute_fill]} blurAmount={10} blurType={"regular"} />}
                    <View style={[styles.tab]}>
                        <DefaultTabItems data={props} setBackground={setBackground} background={background} />
                    </View>
                </SafeAreaView>
            </Animated.View>
        )
    }


    return (

        <SafeAreaView style={[translucentStyle, shadowStyle, borderStyle, { backgroundColor: background }]}>
            <Animated.View style={[offsetAnimateStyle]}>
                <View style={[styles.absolute_fill, { backgroundColor: background, opacity: backgroundOpacityValue }]} />
                {!isAndroid && navStore.isBlurEnabled && <BlurView style={[styles.absolute_fill]} blurAmount={10} blurType={"regular"} />}
                <View style={[styles.tab]}>
                    <DefaultTabItems data={props} setBackground={setBackground} background={background} />
                </View>
            </Animated.View>
        </SafeAreaView>
    )
});

export default DefaultTabBar;

const styles = StyleSheet.create({
    tab: {
        width: "100%",
        height: TABBAR_HEIGHT,
        flexDirection: "row",
        // borderWidth:1,
        // borderColor:'blue'
    },
    tab_shadow: {
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOpacity: 0.16,
                shadowRadius: 10,
                shadowOffset: { x: 0, y: 5 }
            },
            android: {
                elevation: 26
            }
        })
    },
    tab_border: {
        borderTopWidth: 1,
        borderTopColor: '#F1F1F1'
    },
    absolute: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0
    },
    absolute_fill: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        top: 0
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    tab_item: {
        height: TABBAR_HEIGHT,
        marginTop: isAndroid ? 0 : 6
        // borderWidth:1,
        // borderColor:'green',
    },
    icon_wrapper: {
        height: ICON_WRAPPER_SIZE,
        justifyContent: "flex-end",
        // borderWidth:1,
        // borderColor:'blue'
    },
    title_wrapper: {
        height: TITLE_HEIGHT,
        justifyContent: "center",
        alignItems: "center",
        // borderWidth:1,
        // borderColor:'purple'
    }
});