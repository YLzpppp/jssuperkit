import React, { useEffect, useState, useRef } from 'react';
import { Animated, View, Text, Dimensions, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

const { width: sw, height: sh } = Dimensions.get('window');
const TabItemHeight = 40;
const TabItemWidth = sw * 0.2;

const UserInfoHeight = 80;
const AvatarSize = 60;
const AvatarMV = (UserInfoHeight - AvatarSize) / 2;

const TabHeight = TabItemHeight + 0;

const HeaderTabLeftAlignKind = React.memo((props: {
    pageChildren?: any,
    scrollOffsetValue?: Animated.Value,
    currentTab?: number,
    switchTabHandler?: (tabIndex: number) => void,
    segmentLength?: number,
    activeTextStyle?: TextStyle,
    defaultTextStyle?: TextStyle,
    backgroundColor?: string,
    rightComponent?: any,
    containerStyle?: ViewStyle,
    enableTextShadow?: boolean,
    paddingTop?: number,
    underLineScale?: number,
    hideUnderLine?: boolean
}) => {
    const ChildCount = props?.pageChildren?.length ?? 0;
    const SegmentLength = props?.segmentLength ?? 0;
    const PaddingTop = props?.paddingTop ?? 0;
    const underLineScale = props?.underLineScale ?? 1.0;
    const hideUnderLine = props?.hideUnderLine ?? false;

    const DefaultTextStyle: TextStyle = props?.defaultTextStyle ?? {
        color: '#666',
        fontSize: font(17)
    };
    const ActiveTextStyle: TextStyle = props?.activeTextStyle ?? {
        color: '#222',
        fontSize: font(20),
        fontWeight: '500'
    }
    const ShadowTextStyle: TextStyle = props?.enableTextShadow ? { textShadowColor: '#00000055', textShadowRadius: 1, textShadowOffset: { width: 1, height: 1 } } : {}
    const BackgroundColor = props?.backgroundColor ?? 'white';
    const currentTabIndex = props?.currentTab ?? 0;

    const onTabClick = (index: number) => {
        props?.switchTabHandler && props?.switchTabHandler(index);
    }

    const [textBaseWidth, setbasewidth] = useState(0);
    const textLengthScaleOrigin = useRef<any>({});
    const textLengths = useRef<any>({});
    const [scaleFactors, setfactors]: any[] = useState({
        inputRange: [0, 1],
        outputRange: [1, 1]
    });

    const onTextLayout = (e: any, index: number) => {
        if (Object.keys(textLengths.current).length <= ChildCount) {
            let w = e.nativeEvent.layout.width; //文本宽度

            //文本长度记录
            let temp_len: any = textLengths.current;
            temp_len[index] = w;
            textLengths.current = temp_len;

            //滑动距离记录(对应inputRange)
            let temp_origin: any = textLengthScaleOrigin.current;
            temp_origin[index] = (SegmentLength * index);
            textLengthScaleOrigin.current = temp_origin;

            if (Object.keys(temp_origin).length == ChildCount) {
                let outputrange: any[] = [];
                let inputrange: any[] = [];

                for (let i of Object.keys(textLengthScaleOrigin.current)) {
                    inputrange.push(textLengthScaleOrigin.current[i])
                }
                let baseLen = textLengths.current[0];
                setbasewidth(baseLen);
                for (let k of Object.keys(textLengths.current)) {
                    let scale = (textLengths.current[k] / baseLen) * underLineScale;
                    outputrange.push(scale);
                }
                let result = {
                    inputRange: inputrange,
                    outputRange: outputrange
                };
                setfactors(result)
            }
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: BackgroundColor, height: TabHeight + PaddingTop, paddingTop: PaddingTop }, props?.containerStyle]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {
                    props?.pageChildren.map((item, index) => {
                        return (
                            <TouchableOpacity
                                key={index.toString()}
                                activeOpacity={1.0}
                                onPress={() => { onTabClick(0) }}
                                style={[styles.tabItem]}>
                                <Text
                                    style={[currentTabIndex == index ? ActiveTextStyle : DefaultTextStyle, ShadowTextStyle]}
                                    onLayout={(e) => {
                                        onTextLayout(e, index);
                                    }}>
                                    {item.key}
                                </Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
            {!hideUnderLine && (
                <Animated.View style={{
                    position: 'absolute',
                    zIndex: 1,
                    bottom: 1,
                    height: 2,
                    width: textBaseWidth,
                    backgroundColor: 'black',
                    transform: [
                        { translateX: (TabItemWidth - textBaseWidth) / 2 },
                        {
                            translateX: props.scrollOffsetValue?.interpolate({
                                inputRange: [0, 1, 2],
                                outputRange: [0, TabItemWidth, TabItemWidth * 2]
                            })
                        },
                        {
                            scaleX: props.scrollOffsetValue?.interpolate(scaleFactors)
                        }
                    ]
                }} />
            )}
            <View style={{ height: TabItemHeight }}>
                {
                    props.rightComponent
                }
            </View>
        </View>
    )
});

export default HeaderTabLeftAlignKind;

const styles = StyleSheet.create({
    container: {
        width: sw,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    tabItem: {
        width: TabItemWidth,
        height: TabItemHeight,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth:1,
        // borderColor:"red"
    },
    userinfo: {
        flexDirection: 'row',
        height: UserInfoHeight,
        width: sw,
        paddingVertical: AvatarMV,
        paddingStart: 15,
        alignItems: 'center'
    }
})
