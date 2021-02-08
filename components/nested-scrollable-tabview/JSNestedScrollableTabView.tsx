import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Animated, PanResponder, Easing, StyleSheet, TextStyle } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import HeaderContentView from './HeaderContentView';
import { getRanges, useNavigationBarHeight } from './Helper';
import useStatusHeight from '../../hooks/useStatusHeight';
;
import { sw, sh } from '../../base';
import NavigationBar from './NavigationBar';

const JSNestedScrollableTabView = React.memo((props: {
    childPages: any[];
    refLists: any[];
    estimatedHeight: number;
    tabBarHeight?: number;
    bottomTabBarHeight?: number;

    isStatusBarTranslucent?: boolean;

    navigationBarOptions?: {
        navigation: any;
        navigationBarBaseHeight?:number;
        renderCustomNavigationBar?: any;
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
    }

    renderTabBar?: { tabBarHeight: number; renderTab: (props: any) => any };

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

    interpolateRanges?: { imageScale: any; containerOffset: any };

    headerContentViewOptions?: {
        imageHeight?: number;
        background?: string;
        backgroundImage?: any;
        onBackgroundImagePress?: any;
        onBackgroundImageLongPress?: any;
        renderContent?: (props: any) => any;
    };

}) => {
    const statusBarHeight = useStatusHeight();
    const isNavigationBarVisible = useMemo(() => props?.navigationBarOptions != undefined,[props?.navigationBarOptions])

    const _navigationBarHeight = useNavigationBarHeight(props?.navigationBarOptions?.navigationBarBaseHeight);
    const navigationBarHeight = useMemo(() => {
        if(props?.navigationBarOptions){
            return _navigationBarHeight
        }
        return 0;
    },[isNavigationBarVisible,_navigationBarHeight])
    const childPages = props?.childPages ?? [];
    const refLists: any = useMemo(() => {
        if (!props?.refLists) {
            return []
        }
        let lists: any[] = [];
        let labels: any[] = [];
        for (let i of props.refLists) {
            lists.push(i.ref);
            labels.push(i?.label ?? '');
        }
        return ({ refs: lists, labels: labels });
    }, [props.refLists]);
    const estimatedHeight = props.estimatedHeight;
    const tabBarHeight = props?.renderTabBar?.tabBarHeight ?? (props?.tabBarHeight ?? 0);
    const bottomTabBarHeight = props?.bottomTabBarHeight ?? 0;

    const backgroundImageScaleRange = useMemo(() => {
        return props?.interpolateRanges?.imageScale ?? getRanges("scale")
    }, [props.interpolateRanges]);
    const containerOffsetRange = useMemo(() => {
        return props?.interpolateRanges?.containerOffset ?? getRanges("translate", props?.headerContentViewOptions?.imageHeight)
    }, [props.interpolateRanges, props?.headerContentViewOptions?.imageHeight]);

    const vpRef = useRef<ViewPager>(null);
    const isOnSwtichingRef = useRef(true);

    const sharedScrollOffset = useRef(new Animated.Value(0)).current;
    const containerPanMoveValue = useRef(new Animated.Value(0)).current;
    const viewPagerScrollOffset = useRef(new Animated.Value(0)).current;
    const [currentPageIndex, setpageindex] = useState(0);
    const [headerContentHeight, setheadercontentheight] = useState(estimatedHeight);

    const onViewPageSelected = (e) => {
        setpageindex(e.nativeEvent.position);
    };

    const onViewPageScroll = (event) => {
        let { position: __position, offset: __offset } = event.nativeEvent;
        let __value = __position + __offset;

        viewPagerScrollOffset.setValue(__value);

        if (!isOnSwtichingRef.current) {
            isOnSwtichingRef.current = true
        };
        if (__offset == 0 && isOnSwtichingRef.current) {
            isOnSwtichingRef.current = false;
        }
    };

    const onContentViewLayoutCallback = (measuredHeight: number) => {
        setheadercontentheight(measuredHeight);
    }

    const childProps = useMemo(() => ({
        sharedScrollOffset,
        headerContentHeight,
        tabBarHeight,
        statusBarHeight,
        bottomTabBarHeight,
        refLists: refLists.refs,
        currentPageIndex,
        isStatusBarTranslucent: props?.isStatusBarTranslucent,
        navigationBarHeight
    }), [sharedScrollOffset, headerContentHeight, tabBarHeight, statusBarHeight, bottomTabBarHeight, currentPageIndex, props?.isStatusBarTranslucent,navigationBarHeight]);

    const renderChildPages = useCallback(() => (childPages.map((renderChild, index) => {
        let key = index.toString();
        Object.assign(childProps, { index: index });
        return (
            <View key={key} style={{ flex: 1 }}>
                {renderChild(childProps)}
            </View>
        )
    })
    ), [childPages, childProps]);

    const pan = PanResponder.create({
        onMoveShouldSetPanResponderCapture: (e, g) => {
            if (sharedScrollOffset._value == 0 && g.dy > 0 && g.dx < Math.max(sw * 0.03, 10)) {
                refLists.refs[currentPageIndex].current.setNativeProps({ scrollEnabled: false });
                return true;
            }
            return false;
        },
        onPanResponderGrant: (e, g) => { },
        onPanResponderMove: (e, g) => {
            containerPanMoveValue.setValue(Math.abs(g.dy))
        },
        onPanResponderRelease: (e, g) => {
            refLists.refs[currentPageIndex].current.setNativeProps({ scrollEnabled: true });
        },
        onPanResponderEnd: (e, g) => {
            Animated.timing(containerPanMoveValue, {
                toValue: 0,
                easing: Easing.bezier(.17, 1.09, .69, 1.01),
                useNativeDriver: true
            }).start();
        }
    });

    return (
        <View {...pan.panHandlers} style={{ flex: 1 }}>
            {
                props?.navigationBarOptions != undefined && (
                    <NavigationBar
                        scrollOffset={sharedScrollOffset}
                        navigation={props?.navigationBarOptions?.navigation}
                        onPopTop={props?.navigationBarOptions?.onPopTop}
                        backHandler={props?.navigationBarOptions?.backHandler}
                        background={props?.navigationBarOptions?.background}
                        centerTitle={props?.navigationBarOptions?.centerTitle}
                        centerTitleStyle={props?.navigationBarOptions?.centerTitleStyle}
                        moreCallback={props?.navigationBarOptions?.moreCallback}
                        leftComponent={props?.navigationBarOptions?.leftComponent}
                        rightComponent={props?.navigationBarOptions?.rightComponent}
                        centerComponent={props?.navigationBarOptions?.centerComponent}
                        backButtonColor={props?.navigationBarOptions?.backButtonColor}

                        headerContentHeight={headerContentHeight}
                        tabBarHeight={tabBarHeight}
                        statusBarHeight={statusBarHeight}
                        baseHeight={props?.navigationBarOptions?.navigationBarBaseHeight}
                        isStatusBarTranslucent={props.isStatusBarTranslucent}
                    />
                )
            }
            <HeaderContentView
                estimatedHeight={estimatedHeight}
                tabBarHeight={tabBarHeight}
                statusBarHeight={statusBarHeight}
                navigationBarHeight={navigationBarHeight}

                scrollOffset={sharedScrollOffset}
                onContentViewLayoutCallback={onContentViewLayoutCallback}

                backgroundImageScaleRange={backgroundImageScaleRange}
                containerOffsetRange={containerOffsetRange}
                containerPanMoveValue={containerPanMoveValue}
                viewPagerRef={vpRef}
                currentPageIndex={currentPageIndex}
                viewPagerScrollOffset={viewPagerScrollOffset}
                
                imageHeight={props?.headerContentViewOptions?.imageHeight}
                background={props?.headerContentViewOptions?.background}
                backgroundImage={props?.headerContentViewOptions?.backgroundImage}
                onBackgroundImagePress={props?.headerContentViewOptions?.onBackgroundImagePress}
                onBackgroundImageLongPress={props?.headerContentViewOptions?.onBackgroundImageLongPress}
                tabBarLabels={refLists.labels}
                renderContent={props?.headerContentViewOptions?.renderContent}
                renderTabBar={props?.renderTabBar?.renderTab}
                tabBarOptions={props?.tabBarOptions}
            />
            <Animated.View style={{
                flex: 1,
                transform: [{ translateY: containerPanMoveValue.interpolate(containerOffsetRange) }]
            }}>
                <ViewPager
                    ref={vpRef}
                    style={{ flex: 1 }}
                    onPageSelected={onViewPageSelected}
                    onPageScroll={onViewPageScroll}>
                    {renderChildPages()}
                </ViewPager>
            </Animated.View>
        </View>
    )
});

export default JSNestedScrollableTabView;