import React from 'react';
import { View, StyleSheet, Text, ViewStyle, TextStyle, Pressable } from 'react-native';
import SvgIcon from './svgicon/SvgIcon';
import DefaultIcons from './svgicon/DefaultIcons';
import useAdaptiveColor from '../hooks/useAdaptiveColor';
import { font, NullChecker,EmptyFunc } from '../base';
import StatusView from './statusview/StatusView';

const LeftAndRightTitleBar = (props: {
    leftTitle?: string;
    rightTitle?: string;
    leftTitleOption?: { fontSize: number; color: string; fontWeight: string };
    rightTitleOption?: { fontSize: number; color: string; fontWeight: string };
    rightArrowOption?: { size: number; color: string };
    disableArrow?: boolean;
    containerStyle?: ViewStyle[];
    rightComponent?: any;
    leftComponent?: any;
    onRightPress?: any;
}) => {

    const primaryColor = useAdaptiveColor(undefined, "title");
    const secondaryColor = useAdaptiveColor({ lightColor: '#B4B4B4', darkColor: '#B4B4B4' });

    const containerStyle = props?.containerStyle ?? [];

    const leftTitle = props?.leftTitle ?? "";
    const rightTitle = props?.rightTitle ?? "";

    const leftTitleColor = props?.leftTitleOption?.color ?? primaryColor;
    const leftTitleFontSize = props?.leftTitleOption?.fontSize ?? font(16);
    const leftTitleFontWeight: any = props?.leftTitleOption?.fontWeight ?? 'bold';

    const rightTitleColor = props?.rightTitleOption?.color ?? secondaryColor;
    const rightTitleFontSize = props?.rightTitleOption?.fontSize ?? font(14);
    const rightTitleFontWeight: any = props?.rightTitleOption?.fontWeight ?? 'normal';

    const rightArrowSize = props?.rightArrowOption?.size ?? 18;
    const rightArrowColor = props?.rightArrowOption?.color ?? secondaryColor;

    const onRightPress = props?.onRightPress ?? EmptyFunc;

    return (
        <View style={[styles.container, styles.row,...containerStyle]}>
            <StatusView show={NullChecker(props?.leftComponent)}>
                <Text style={[{ color: leftTitleColor, fontSize: leftTitleFontSize, fontWeight: leftTitleFontWeight }]}>{leftTitle}</Text>
            </StatusView>
            <StatusView show={!NullChecker(props?.leftComponent)}>
                {props.leftComponent}
            </StatusView>

            <Pressable onPress={onRightPress} style={[styles.right]}>
                <StatusView show={NullChecker(props?.rightComponent)}>
                    <Text style={[{ color: rightTitleColor, fontSize: rightTitleFontSize,fontWeight:rightTitleFontWeight }]}>{rightTitle}</Text>
                    <SvgIcon name={DefaultIcons.breezeArrowRight} size={rightArrowSize} color={rightArrowColor} />
                </StatusView>
                <StatusView show={!NullChecker(props?.rightComponent)}>
                    {props.rightComponent}
                </StatusView>
            </Pressable>
        </View>
    )
}

export default LeftAndRightTitleBar;

const styles = StyleSheet.create({
    container: {

    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});