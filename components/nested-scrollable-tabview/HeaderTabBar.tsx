import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, useWindowDimensions, ScrollView, Animated, TextStyle } from 'react-native';
import { sw } from '../../base';
import StatusView from '../statusview/StatusView';

const TabWidth = parseInt((sw / 3).toFixed(0));
const SegTwo = TabWidth * 2;
const SegTwoUltra = SegTwo + 10;

const HeaderTabBar = React.memo((props: {
    viewPagerRef: any;
    currentPageIndex: number;
    viewPagerScrollOffset: any;
    tabBarHeight: number;
    textOptions?: {
        defaultTextStyle?: TextStyle,
        activeTextStyle?: TextStyle
    };
    labels?: string[];
    background?: string;
    indicatorOptions?: {
        visible?: boolean;
        color?: string;
        height?: number;
        trackColor?: string;
    }
}) => {

    const tabBarHeight = props.tabBarHeight;
    const viewPagerScrollOffset = props.viewPagerScrollOffset;
    const currentPageIndex = props.currentPageIndex;
    const viewPagerRef = props.viewPagerRef;

    const background = props?.background ?? 'white';

    const indicatorVisible = props?.indicatorOptions?.visible ?? true;
    const indicatorHeight = props?.indicatorOptions?.height ?? 1;
    const indicatorColor = props?.indicatorOptions?.color ?? 'lightblue';
    const indicatorTrackColor = props?.indicatorOptions?.trackColor ?? '#565656';

    const labels = props?.labels ?? [];

    const textStyle = { fontSize: font(17), color: '#000' };
    const defaultTextStyle = props?.textOptions?.defaultTextStyle ?? textStyle;
    const activeTextStyle = props?.textOptions?.activeTextStyle ?? textStyle;

    const renderTabItems = useCallback(() => {
        return labels.map((value, index) => {
            let isMe = currentPageIndex == index;
            return (
                <Pressable
                    key={index}
                    onPress={() => {
                        viewPagerRef.current.setPage(index);
                    }}
                    style={[
                        styles.tabItem,
                        { height: tabBarHeight, }
                    ]}>
                    <Text style={isMe ? activeTextStyle : defaultTextStyle}>
                        {value}
                    </Text>
                </Pressable>
            )
        })
    }, [currentPageIndex, labels])

    return (

        <Animated.View style={[
            {
                height: tabBarHeight,
                backgroundColor: background,
                zIndex: 9,
                borderBottomWidth: indicatorHeight,
                borderBottomColor: indicatorTrackColor
            },
            styles.container
        ]}>
            {renderTabItems()}
            <StatusView show={indicatorVisible}>
                <Animated.View style={{
                    height: indicatorHeight,
                    width: TabWidth,
                    backgroundColor: indicatorColor,
                    position: 'absolute',
                    bottom: -indicatorHeight,
                    transform: [
                        {
                            translateX: viewPagerScrollOffset.interpolate({
                                inputRange: [-0.3, 0, 1, 2, 2.3],
                                outputRange: [-10, 0, TabWidth, SegTwo, SegTwoUltra]
                            })
                        }
                    ]
                }} />
            </StatusView>
        </Animated.View>
    )
});
export default HeaderTabBar;

const styles = StyleSheet.create({
    container: {
        width: sw,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
    },
    tabItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth:1,
        // borderColor:'red'
    },
})