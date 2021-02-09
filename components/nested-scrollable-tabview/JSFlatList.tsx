import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StatusBar,Platform } from 'react-native';
import { isAndroid } from '../../base';
/**
 * props: 
 * 
 * refLists                //列表组件的ref 数组 [ listOneRef,listTwoRef ... ]
 * sharedScrollOffset   //标签页下各个列表共同维护的滚动偏移值
 * headerContentHeight         //头部组件的高度
 * tabBarHeight            //标签栏组件的高度
 * statusBarHeight      //状态栏的高度
 * footerHeight         //列表Footer组件高度
 * bottomTabBarHeight      //底部导航栏高度
 * refLists
 * index
 */

const JSFlatList = React.forwardRef((props: any, ref: any) => {

    const sharedScrollOffset = props.sharedScrollOffset;
    const headerContentHeight = props.headerContentHeight;
    const tabBarHeight = props.tabBarHeight;
    const statusBarHeight = props.statusBarHeight;
    const footerHeight = props?.footerHeight ?? 0;
    const navigationBarHeight = props.navigationBarHeight;
    const bottomTabBarHeight = props?.bottomTabBarHeight ?? 0;
    const refLists = props.refLists;
    const isStatusBarTranslucent = props?.isStatusBarTranslucent ?? false;
    const index = props.index;
    const currentPageIndex = useMemo(() => props.currentPageIndex, [props.currentPageIndex]);
    const isMeTheCurrentPage = useMemo(() => currentPageIndex === index,[currentPageIndex]);

    const stopEdgeValue = useMemo(() => {
        if(isAndroid){
            let _statusBarHeight = isStatusBarTranslucent ? 0 : statusBarHeight;
            return headerContentHeight - navigationBarHeight - tabBarHeight + _statusBarHeight;
        }
        return headerContentHeight - navigationBarHeight - tabBarHeight ;
    },[isStatusBarTranslucent,headerContentHeight,tabBarHeight,statusBarHeight,navigationBarHeight]);

    const listContainerHeightRef = useRef(0);

    const calculatedScrollCompensationValueRef = useRef(0); //动态补偿高度值【记录】
    const [scrollCompensationValue, setscrollCompensationValue] = useState(0);    //动态补偿高度
    const layoutMeasureInitializedRef = useRef(false);  //列表布局是否初始化完成
    const enableMeasureListRef = useRef(true);         //是否允许onContentSizeChange响应、改变补偿高度值

    // di("当前page是",currentPageIndex)
    // di("props", props)
    // di("ref", ref)

    const _onContentSizeChange = (w, h) => {
        let contentHeight = h - headerContentHeight - scrollCompensationValue;
        /**
         * 当内容高度contentHeight为0的时候表示列表FlatList布局测量正式完成
         * 测量完成后的后一轮测绘拿到的高度才是列表变化后的高度值
         */
        if (layoutMeasureInitializedRef.current === false) {
            if (contentHeight == footerHeight) {
                layoutMeasureInitializedRef.current = true;
                return;
            }
        } else {
            //初始化测量完成、后续的计算数据会更新补偿高度值
            if (enableMeasureListRef.current === true) {
                // enableMeasureListRef.current = false;
                let diffHeight = listContainerHeightRef.current - contentHeight;

                if (diffHeight < 0) diffHeight = 0;
                //记录 补偿值
                calculatedScrollCompensationValueRef.current = diffHeight;
                if (scrollCompensationValue != diffHeight && !isMeTheCurrentPage) {
                    setscrollCompensationValue(diffHeight);
                }
            }
        }
    };

    const dispatchScrollSynchronization = async (value,keepCondition:boolean,skipSelf?:boolean) => {
        // keepCondition 默认情况为 偏移值 小于等于 停止阈值
        for (let list of refLists) {
            if (list == ref) {
                if(skipSelf){
                    continue
                }
            }
            //如果列表ref存在，并且当前TAB还未吸顶则同步偏移值，一旦吸顶就不同步其他列表
            if (list.current?._listRef?._scrollRef) {
                if(keepCondition){
                    list.current._listRef._scrollRef.scrollTo({x: 0, y: value, animated: false})
                }else{
                    list.current._listRef._scrollRef.scrollTo({x: 0, y: stopEdgeValue,animated: false})
                }
            }
        };
    }

    // di("JSFlatList Props",props)
    /**
     * 当列表滚动停止的时候触发该事件，这里主要用于同步各个列表滚动偏移
     */
    const onMomentumScrollEnd = (e) => {
        sharedScrollOffset.setValue(e.nativeEvent.contentOffset.y);
        if(isMeTheCurrentPage){
            dispatchScrollSynchronization(sharedScrollOffset._value, sharedScrollOffset._value <= stopEdgeValue, true )
        }
    };
    const onScrollEndDrag = (e) => {
        sharedScrollOffset.setValue(e.nativeEvent.contentOffset.y);
        if(isMeTheCurrentPage){
            dispatchScrollSynchronization(sharedScrollOffset._value, sharedScrollOffset._value <= stopEdgeValue, true )
        }
    }

    const onScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { y: sharedScrollOffset } } }],
        { useNativeDriver: true, listener: (e: any) => { sharedScrollOffset.setValue(e.nativeEvent.contentOffset.y) } }
    );

    const onListLayout = (e) => {
        listContainerHeightRef.current = e.nativeEvent.layout.height;
        enableMeasureListRef.current = true;
    }

    useEffect(() => {
        //头部组件高度变化后这里需要允许列表重新calculate contentSize
        enableMeasureListRef.current = true;
    }, [headerContentHeight])

    useEffect(() => {
        if(layoutMeasureInitializedRef.current == false){
            return;
        }
        if(isMeTheCurrentPage){
            //我是当前页面了
            if(calculatedScrollCompensationValueRef.current > 0){
                dispatchScrollSynchronization(0,true,false).then(() => {
                    setscrollCompensationValue(bottomTabBarHeight);
                })
            }else{
                setscrollCompensationValue(bottomTabBarHeight);
            }
        }else{
            //我不是当前页面，如果我需要补偿值，则在这里更新
            if(calculatedScrollCompensationValueRef.current > 0){
                
                setscrollCompensationValue(calculatedScrollCompensationValueRef.current)
            }
        }
    },[currentPageIndex])

    return (
        <Animated.FlatList
            ref={ref}
            onLayout={onListLayout}
            onContentSizeChange={_onContentSizeChange}
            {...props}
            contentContainerStyle={{ paddingTop: headerContentHeight, paddingBottom: scrollCompensationValue }}
            onScroll={onScroll}
            onMomentumScrollEnd={onMomentumScrollEnd}
            onScrollEndDrag={onScrollEndDrag}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
        />
    )
});

export default JSFlatList;