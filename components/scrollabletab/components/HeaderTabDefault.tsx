import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, SafeAreaView, View, Text, Dimensions, StyleSheet, ViewStyle, TextStyle, Pressable } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
import useAdaptiveColor from '../../../hooks/useAdaptiveColor';
import StatusView from '../../statusview/StatusView';

interface TabCalculatedWidth {
    index: number,
    width: number
}

const HeaderTabDefault = React.memo((props: {
    pageChildren?: any,
    scrollOffsetValue: Animated.Value,
    currentTab?: number,
    switchTabHandler?: (tabIndex: number) => void,
    segmentLength?: number,
    initialPage?: number,

    textOptions?: { enableShadow?: boolean, defaultStyle?: TextStyle, activeStyle?: TextStyle },
    underLineOptions?: { hide?: boolean, color?: string, bottom?: number, height?: number },
    containerOptions?: { background?: string, style?: ViewStyle, insets?: BZEdgeInsets },
}) => {
    const defaultTextColor = useAdaptiveColor({ lightColor: "#555555", darkColor: "#AAAAAA" });
    const defaultTextTintColor = useAdaptiveColor(undefined, "title");
    const defaultBackgroundColor = useAdaptiveColor(undefined, "background");

    const childCount = props?.pageChildren?.length ?? 0;
    const initialPage = props?.initialPage ?? 0;
    const edgeInsets = props?.containerOptions?.insets ?? { top: 0, right: 0, bottom: 0, left: 0 };
    const containerStyle = props?.containerOptions?.style ?? null;
    const background = props?.containerOptions?.background ?? defaultBackgroundColor;
    const hideUnderLine = props?.underLineOptions?.hide ?? false;

    const underLineColor = props?.underLineOptions?.color ?? defaultTextColor;
    const underLineHeight = props?.underLineOptions?.height ?? 2.5;
    const underLineBottom = props?.underLineOptions?.bottom ?? 1;


    const defaultTextStyle: TextStyle = useMemo(() => props?.textOptions?.defaultStyle ?? {
        color: defaultTextColor,
        fontSize: font(16),
        fontWeight: '500'
    }, [props?.textOptions?.defaultStyle, defaultTextColor]);
    const defaultTextTintStyle: TextStyle = useMemo(() => props?.textOptions?.activeStyle ?? {
        color: defaultTextTintColor,
        fontSize: font(17),
        fontWeight: '600'
    }, [props?.textOptions?.activeStyle, defaultTextTintColor]);
    const textShadowStyle: TextStyle | null = useMemo(() => props?.textOptions?.enableShadow ? { textShadowColor: '#00000055', textShadowRadius: 1, textShadowOffset: { width: 1, height: 1 } } : null, [props?.textOptions?.enableShadow])

    const currentTabIndex = props?.currentTab ?? 0;

    const onTabClick = (index: number) => {
        props?.switchTabHandler && props?.switchTabHandler(index);
    }

    // const tabCalculatedWidthRef = useRef<TabCalculatedWidth>({});
    const [tabCalculatedWidth, settabCalculatedWidth] = useState({});

    const [underLineInitialWidth, setunderlinewidth] = useState(0);
    const underLineIntialWidthScale = 0.2;
    const underLineInitialOffset = useMemo(() => {
        let keys = Object.keys(tabCalculatedWidth);
        if (keys.indexOf(`${initialPage}`) === -1) {
            return 0;
        }
        let tabWidth = tabCalculatedWidth[`${initialPage}`];
        return (tabWidth - underLineInitialWidth * underLineIntialWidthScale) * 0.5;
    }, [underLineInitialWidth]);

    const underLineAnimateIntepolator = useMemo(() => {
        let keys = Object.keys(tabCalculatedWidth);
        if (keys.length < childCount || keys.length < 2) {
            return 0;
        }
        let inputRange: number[] = [];
        let outputRange: number[] = [0];
        for (let i = 0; i < childCount; i++) {
            inputRange.push(i);
        }
        for (let n = 1; n < keys.length; n++) {
            //start from the second tab
            let preInd = (n - 1).toString();
            let curInd = n.toString();
            let curW = tabCalculatedWidth[curInd] * 0.5 + tabCalculatedWidth[preInd] * 0.5;
            let preW = outputRange[n - 1];
            outputRange.push(curW + preW);
        }
        return props.scrollOffsetValue.interpolate({ inputRange, outputRange });
    }, [props.scrollOffsetValue, childCount, underLineInitialWidth, tabCalculatedWidth])

    const renderLabel = useCallback(() => {
        return props?.pageChildren.map((item, index) => {
            const labelStyle = [currentTabIndex == index ? defaultTextTintStyle : defaultTextStyle, textShadowStyle];
            return (
                <Pressable
                    key={index.toString()}
                    onPress={() => { onTabClick(index) }}
                    onLayout={e => {
                        let w = e.nativeEvent.layout.width;
                        let preTabCalculatedWidth = { ...tabCalculatedWidth };
                        let keys = Object.keys(tabCalculatedWidth);
                        if (keys.indexOf(index) == -1) {
                            preTabCalculatedWidth[`${index}`] = w;
                            settabCalculatedWidth(preTabCalculatedWidth);
                        }
                        if (index === initialPage) {
                            setunderlinewidth(w);
                        }
                    }}
                    style={[styles.tabItem]}>
                    <Text style={labelStyle} adjustsFontSizeToFit >{item.key}</Text>
                </Pressable>
            )
        })
    }, [props?.pageChildren, currentTabIndex, tabCalculatedWidth]);

    return (
        <Animated.View style={[styles.container_animate_wrapper]}>
            <SafeAreaView style={{ backgroundColor: background }}>
                <View style={[styles.container, { paddingTop: edgeInsets.top, paddingRight: edgeInsets.right, paddingBottom: edgeInsets.bottom, paddingLeft: edgeInsets.left }, containerStyle]}>
                    <View style={styles.label_wrapper}>
                        {renderLabel()}
                    </View>
                    <StatusView show={!hideUnderLine && underLineAnimateIntepolator != 0 && underLineInitialWidth > 0}>
                        
                            <Animated.View style={[styles.underline, {
                                bottom: underLineBottom,
                                height: underLineHeight,
                                borderRadius: underLineHeight,
                                overflow: 'hidden',
                                backgroundColor: underLineColor,
                                width: underLineInitialWidth * underLineIntialWidthScale,
                                transform: [
                                    { translateX: underLineInitialOffset },
                                    { translateX: underLineAnimateIntepolator }
                                ]
                            }]} />
                    </StatusView>
                    <View style={{height:underLineHeight*0.5,width:'100%',backgroundColor:'#FFFFFF66',position:'absolute',bottom:underLineBottom}}></View>
                </View>
            </SafeAreaView>
        </Animated.View>
    )
});

export default HeaderTabDefault;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 42,
        // borderWidth: 1,
        // borderColor: 'blue'
    },
    container_animate_wrapper: {
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // right: 0,
        // zIndex: 999
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1,
        // borderColor: "red"
    },
    label_wrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    underline: {
        position: 'absolute',
        zIndex: 1,
    },
    absolute: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }
})
