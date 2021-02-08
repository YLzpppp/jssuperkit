import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ViewStyle, Animated, Platform, TextStyle } from 'react-native';
import ViewPager from '@react-native-community/viewpager';
import StatusView from '../statusview/StatusView';
import { HeaderTabLeftAlignKind, HeaderTabCenterWithUnderLine, HeaderTabDefault } from './components';
export { HeaderTabCenterWithUnderLine, HeaderTabLeftAlignKind };

interface BZKeyboardDismissMode {
    'none': string,
    'on-drag': string
}
interface BZOverScrollMode {
    'auto': string,
    'always': string,
    'never': string
}
interface BZScrollState {
    'dragging': string,
    'settling': string,
    'idle': string
}

const ScrollableTabView = React.memo((props: {
    vpRef?: any;
    children?: any;
    isHideTabBar?: boolean;
    customTabBar?: any;
    initialPage?: number;
    scrollEnabled?: boolean;
    keyboardDismissMode?: keyof BZKeyboardDismissMode;
    overScrollMode?: keyof BZOverScrollMode;
    onPageSelected?: (page: number) => void;
    onPageScrollStateChanged?: (state: keyof BZScrollState) => void;
    onScroll?: (v: number) => void;

    textOptions?: { enableShadow?: boolean, defaultStyle?: TextStyle, activeStyle?: TextStyle };
    underLineOptions?: { hide?: boolean, color?: string, bottom?: number, height?: number };
    containerOptions?: { background?: string, style?: ViewStyle, insets?: BZEdgeInsets };
}) => {
    const isHideTabBar = props?.isHideTabBar ?? false;
    const initialPage = props?.initialPage ?? 0;
    const scrollEnabled = props?.scrollEnabled ?? true;
    const keyboardDismissMode = props?.keyboardDismissMode ?? 'on-drag';
    const overScroll = props?.overScrollMode ?? 'never';

    //当前viewpager中存在的子组件数量
    const ChildCount = props?.children ? props?.children?.length : 0;
    const SegmentLength = sw / ChildCount;

    //Viewpager 滚动偏移量 0 -> 1 -> ...
    const scrollOffsetValue = useRef(new Animated.Value(0)).current;
    //Viewpager 页码
    const [currentPage, setpage] = useState(initialPage);

    const __onPageSelected = (event) => {
        let curPage = event.nativeEvent.position;
        setpage(curPage);
        //call the callback if existed
        props?.onPageSelected && props.onPageSelected(curPage);
    }
    const __onScrollStateChanged = (state) => {
        let s = state.nativeEvent.pageScrollState;
        //call the callback if existed
        props?.onPageScrollStateChanged && props.onPageScrollStateChanged(s);
    }
    const __onPageScroll = (event) => {
        /**
         * Eg: 
         * 三个子组件   ==>    0 -> 1 -> 2
         * 两个子组件   ==>    0 -> 1
         */
        let { position: __position, offset: __offset } = event.nativeEvent;
        let __value = __position + __offset;
        scrollOffsetValue.setValue(__value);
        props?.onScroll && props?.onScroll(__value);
    }

    const switchHandler = (index) => {

    };

    const headerProps = {
        scrollOffsetValue: scrollOffsetValue,
        currentTab: currentPage,
        switchTabHandler: switchHandler,
        segmentLength: SegmentLength,
        pageChildren: props.children,
        initialPage: initialPage,
        textOptions: props?.textOptions,
        containerOptions: props?.containerOptions,
        underLineOptions: props?.underLineOptions,
    }
    return (
        <>
            <StatusView show={!isHideTabBar}>
                {
                    props?.customTabBar ? props.customTabBar(headerProps) : (
                        <HeaderTabDefault
                            scrollOffsetValue={scrollOffsetValue}
                            currentTab={currentPage}
                            switchTabHandler={switchHandler}
                            segmentLength={SegmentLength}
                            pageChildren={props?.children}
                            initialPage={initialPage}
                            textOptions={props?.textOptions}
                            containerOptions={props?.containerOptions}
                            underLineOptions={props?.underLineOptions} />
                    )
                }
            </StatusView>

            <ViewPager
                ref={props?.vpRef}
                style={{ flex: 1 }}
                initialPage={initialPage}
                scrollEnabled={scrollEnabled}
                keyboardDismissMode={keyboardDismissMode}
                overScrollMode={"never"}
                onPageScroll={__onPageScroll}
                onPageScrollStateChanged={__onScrollStateChanged}
                onPageSelected={__onPageSelected}>
                {
                    props.children
                }
            </ViewPager>
        </>
    )
});
export default ScrollableTabView;