import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Animated, TextStyle } from 'react-native';

import UserBackground from './UserBackground';
import HeaderTabBar from './HeaderTabBar';
import { observer } from 'mobx-react';
import StatusView from '../statusview/StatusView';

const HeaderContentView = observer((props: {
    estimatedHeight: number;
    tabBarHeight: number;
    statusBarHeight: number;
    navigationBarHeight: number;
    currentPageIndex: number;
    viewPagerRef: any;

    imageHeight?: number;
    background?: string;
    backgroundImage?:any;
    onBackgroundImagePress?:any;
    onBackgroundImageLongPress?:any;

    tabBarLabels?:string[];
    renderContent?: any;
    renderTabBar?: any;
    tabBarOptions?: {
        textOptions?: {
            defaultTextStyle?: TextStyle,
            activeTextStyle?: TextStyle
        };
        background?: string;
        indicatorOptions?: {
            visible?: boolean;
            color?: string;
            height?: number;
            trackColor?: string;
        }
    };

    onContentViewLayoutCallback: (measuredHeight: number) => void;
    scrollOffset: Animated.Value;
    viewPagerScrollOffset: Animated.Value;
    containerPanMoveValue: Animated.Value;
    backgroundImageScaleRange: any;
    containerOffsetRange: any;
}) => {
    const onContentViewLayoutCallback = props.onContentViewLayoutCallback;

    const estimatedHeight = props.estimatedHeight;
    const tabBarHeight = props.tabBarHeight;
    const navigationBarHeight = props.navigationBarHeight;
    const scrollOffset = props.scrollOffset;
    const minHeight = useMemo(() => tabBarHeight + estimatedHeight, [tabBarHeight, estimatedHeight]);
    const imageHeight = props?.imageHeight ?? 200;
    const containerBackground = props?.background ?? 'white';

    const [headerHeight, setheaderheight] = useState(estimatedHeight)

    const translateInterpolate = useMemo(() => {
        let stopValue = headerHeight - tabBarHeight - navigationBarHeight;
        return scrollOffset.interpolate({
            inputRange: [0, stopValue, 9999999],
            outputRange: [0, -stopValue, -stopValue]
        })
    }, [headerHeight]);

    const onContentViewLayout = (e) => {
        let h = e.nativeEvent.layout.height;
        setheaderheight(h);
        onContentViewLayoutCallback(h);
    }

    return (
        <Animated.View
            onLayout={onContentViewLayout}
            style={[styles.contentBox,
            {
                minHeight: minHeight,
                backgroundColor: containerBackground
            },
            { transform: [{ translateY: translateInterpolate }] }
            ]}>
            <UserBackground
                backgroundImageScaleRange={props.backgroundImageScaleRange}
                height={imageHeight}
                containerPanMoveValue={props.containerPanMoveValue}
                onPress={props.onBackgroundImagePress}
                onLongPress={props.onBackgroundImageLongPress}
                source={props.backgroundImage}/>

            <Animated.View style={{
                flex: 1,
                backgroundColor: containerBackground,
                paddingBottom: tabBarHeight,
                transform: [
                    { translateY: props.containerPanMoveValue.interpolate(props.containerOffsetRange) }
                ]
            }}>
                <StatusView show={props?.renderContent != undefined}>
                    {props.renderContent()}
                </StatusView>
                <StatusView show={props?.renderContent == undefined}>
                    <View style={{ paddingStart: 15, paddingVertical: 10 }}>
                        <Text>Tip🔧: 使用renderContent来替换掉该默认ContentView</Text>
                    </View>
                </StatusView>
                <View style={{ position: 'absolute', bottom: tabBarHeight }}>
                    {props?.renderTabBar && props.renderTabBar({
                        viewPagerRef: props.viewPagerRef,
                        currentPageIndex: props.currentPageIndex,
                        viewPagerScrollOffset: props.viewPagerScrollOffset,
                        tabBarHeight: props.tabBarHeight,
                    })}
                    <StatusView show={props?.renderTabBar == undefined}>
                        <HeaderTabBar
                            viewPagerRef={props.viewPagerRef}
                            currentPageIndex={props.currentPageIndex}
                            viewPagerScrollOffset={props.viewPagerScrollOffset}
                            tabBarHeight={props.tabBarHeight}
                            labels={props.tabBarLabels}
                            textOptions={props?.tabBarOptions?.textOptions}
                            background={props?.tabBarOptions?.background}
                            indicatorOptions={props?.tabBarOptions?.indicatorOptions}
                        />
                    </StatusView>
                </View>
            </Animated.View>
        </Animated.View>
    )
});
export default HeaderContentView;

const styles = StyleSheet.create({
    contentBox: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 9
    }
})