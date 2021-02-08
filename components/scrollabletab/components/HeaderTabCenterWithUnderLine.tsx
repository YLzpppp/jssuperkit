import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState,useRef } from 'react';
import { Animated, View, Text, Dimensions, StyleSheet, TouchableOpacity, ViewStyle, TextStyle, Platform } from 'react-native';

const { width: sw, height: sh } = Dimensions.get('window');
const TabItemHeight = 40 ;
const TabItemWidth = sw * 0.18;

const UserInfoHeight = 80;
const AvatarSize = 60;
const AvatarMV = (UserInfoHeight - AvatarSize)/2;

const TabHeight = TabItemHeight + 0;

const HeaderTabCenterWithUnderLine = React.memo((props: {
    pageChildren?: any,
    scrollOffsetValue?: Animated.Value,
    currentTab?: number,
    switchTabHandler?: (tabIndex: number) => void,
    segmentLength?: number,
    activeTextStyle?: TextStyle,
    defaultTextStyle?: TextStyle,
    backgroundColor?:string,
    rightComponent?:any,
    containerStyle?:ViewStyle,
    enableTextShadow?:boolean,
}) => {
    const {colors,schema}:{colors:colors,schema:string} = useTheme();
    const ChildCount = props?.pageChildren?.length ?? 0;
    const SegmentLength = props?.segmentLength ?? 0;

    const DefaultTextStyle: TextStyle = props?.defaultTextStyle ?? {
        color: colors.textTwo,
        fontSize: font(19)
    };
    const ActiveTextStyle: TextStyle = props?.activeTextStyle ?? {
        color: colors.textOne,
        fontSize: font(19),
    }
    const ShadowTextStyle:TextStyle = props?.enableTextShadow ? {textShadowColor:'#00000055',textShadowRadius:1,textShadowOffset:{width:1,height:1}} : {}
    const BackgroundColor = props?.backgroundColor ?? 'transparent';
    const currentTabIndex = props?.currentTab ?? 0;

    const onTabClick = (index: number) => {
        props?.switchTabHandler && props?.switchTabHandler(index);
    }

    const [textBaseWidth, setbasewidth] = useState(0);
    const textLengthScaleOrigin = useRef<any>({});
    const textLengths = useRef<any>({});
    const [scaleFactors,setfactors]:any[] = useState({
        inputRange:[0,1],
        outputRange:[1,1]
    });

    const onTextLayout = (e:any,index:number) => {
        if(Object.keys(textLengths.current).length <= ChildCount){
            let w = e.nativeEvent.layout.width; //文本宽度

            //文本长度记录
            let temp_len:any = textLengths.current;
            temp_len[index] = w;
            textLengths.current = temp_len;

            //滑动距离记录(对应inputRange)
            let temp_origin:any = textLengthScaleOrigin.current;
            temp_origin[index] = (SegmentLength * index);
            textLengthScaleOrigin.current = temp_origin;
            
            if(Object.keys(temp_origin).length == ChildCount){
                let outputrange:any[] = [];
                let inputrange:any[] = [];
                
                for(let i of Object.keys(textLengthScaleOrigin.current)){
                    inputrange.push(textLengthScaleOrigin.current[i])
                }
                let baseLen = textLengths.current[0];
                setbasewidth(baseLen * 0.72);
                for(let k of Object.keys(textLengths.current)){
                    if(k == '0'){
                        outputrange.push(1);
                    }else{
                        let scale = textLengths.current[k]/baseLen;
                        outputrange.push(scale);
                    }
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
        <View style={[styles.container,{backgroundColor: BackgroundColor},props?.containerStyle]}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
            {
                props?.pageChildren.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index.toString()}
                            activeOpacity={1.0}
                            onPress={() => { onTabClick(0) }}
                            style={[styles.tabItem]}>
                            <Text onLayout={(e) => {
                                onTextLayout(e,index);
                            }} style={[currentTabIndex == index ? ActiveTextStyle : DefaultTextStyle,ShadowTextStyle]}>
                                {item.key}
                            </Text>
                        </TouchableOpacity>
                    )
                })
            }
            </View>
            {/*  底部滑动线  */}
            <Animated.View style={{
                position: 'absolute',
                bottom: 0,
                height: 2,
                width: textBaseWidth,
                backgroundColor: 'white',
                transform: [
                    {translateX: -TabItemWidth/2},
                    {
                        translateX: props.scrollOffsetValue?.interpolate({
                            inputRange:[-0.3,0,1,1.3],
                            outputRange:[-10,0,TabItemWidth,TabItemWidth+10]
                        })
                    }
                ],
                ...Platform.select({
                    'ios':{
                        shadowColor: '#000', shadowRadius: 2, shadowOpacity: 0.5, shadowOffset: { width: 1, height: 1 }
                    },
                    'android':{
                        elevation:3
                    }
                })
            }} />
            <View style={{height:TabItemHeight}}>
                {
                    props.rightComponent
                }
            </View>
        </View>
    )
});

export default HeaderTabCenterWithUnderLine;

const styles = StyleSheet.create({
    container: {
        width: sw,
        height: TabHeight,
        flexDirection:'row',
        justifyContent:'center'
    },
    tabItem: {
        width: TabItemWidth,
        height: TabItemHeight,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth:1,
        // borderColor:'green'
    },
    userinfo:{
        flexDirection:'row',
        height: UserInfoHeight,
        width:sw,
        paddingVertical:AvatarMV,
        paddingStart:15,
        alignItems:'center'
    }
})
