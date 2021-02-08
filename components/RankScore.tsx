import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ViewStyle } from 'react-native';
import SvgIcon from './svgicon/SvgIcon';
import Icons from './svgicon/DefaultIcons';

const RankScore = React.memo((props: {
    iconSize?: number,
    defaultColor?: string,
    activeColor?: string,
    gap?: number,
    activeCount?: number,
    defaultCount?: number,
    containerStyle?: ViewStyle[],
    scoreEnabled?:boolean;
    onScored?:(count:number) => any
}) => {
    const gap = props?.gap ?? 5;
    const iconSize = props?.iconSize ?? 20;
    const defaultColor = props?.defaultColor ?? "#f1f1f1";
    const activeColor = props?.activeColor ?? "#1273ff";
    const scoreEnabled = props?.scoreEnabled ?? false;

    //默认评分星星的个数（数组）
    const defaultStarCountList = useMemo(() => {
        let _count = props?.defaultCount ?? 5;
        let arr: any[] = [];
        for (let i = 0; i < _count; i++) {
            arr.push(i)
        }
        return arr;
    }, [props?.defaultCount]);
    //用户评分星星的个数
    const [activeStarCountList, setactivestarcountlist]: any[] = useState([]);

    useEffect(() => {
        //初始化评分星星数
        let _count = props?.activeCount ?? 0;
        let arr: any[] = []
        for (let i = 0; i < _count; i++) {
            arr.push(i);
        }
        if (activeStarCountList.length != arr.length) {
            setactivestarcountlist([...arr])
        }
    }, [props.activeCount])

    const onActiveStarClick = (index:number) => {
        if(scoreEnabled == false) return;
        let curNum = index+1;
        let minusCount = activeStarCountList.length - curNum;
        if(minusCount <= activeStarCountList.length){
            let _list = [...activeStarCountList];
            _list.splice(0,minusCount);
            setactivestarcountlist(_list);
            props?.onScored && props.onScored(_list.length);
        }
    }
    const onInactiveStarClick = (index:number) => {
        // info("点击默认星星",index+1)
        if(scoreEnabled == false) return;
        let curNum = index+1;
        let plusCount = curNum - activeStarCountList.length;
        let _list = [...activeStarCountList];
        for(let i=0;i<plusCount;i++){
            _list.push(Math.round(Math.random()*100))
        }
        setactivestarcountlist(_list);
        props?.onScored && props.onScored(_list.length);
    }

    return (
        <View style={[styles.container, ...(props?.containerStyle ?? [])]}>
            {/* <SvgIcon name={Icons.Star} size={iconSize} color={defaultColor} style={{marginEnd:gap}}/> */}
            <View style={{ position:"absolute",zIndex: 1, flexDirection: 'row' }}>
                {
                    activeStarCountList.map((item, index) => {
                        return (
                            <Pressable onPress={() => {
                                onActiveStarClick(index);
                            }}>
                                <SvgIcon key={index} name={Icons.breezeStar} size={iconSize} color={activeColor} style={{ marginEnd: gap }} />
                            </Pressable>
                        )
                    })
                }
            </View>
            {
                defaultStarCountList.map((item, index) => {
                    return (
                        <Pressable onPress={() => {
                            onInactiveStarClick(index)
                        }}>
                            <SvgIcon key={index} name={Icons.breezeStar} size={iconSize} color={defaultColor} style={{ marginEnd: gap }} />
                        </Pressable>
                    )
                })
            }
        </View>
    )
});
export default RankScore;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    }
})