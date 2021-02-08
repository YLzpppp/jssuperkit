import React from 'react';
import {View,Image,Text,Pressable,StyleSheet,Platform} from 'react-native';

interface Data {
    image: any;
    title: any;
}

const PropsDiffChecker = (prevProps:any,nextProps:any) => {
    return false
}
const CardOne = React.memo((props:{

}) => {
 
    const { colors, item } = props;
    const rect = props?.rect ?? { width: sw * 0.29, height: sw * 0.19 };
    const _empty = () => { };
    const onPress = props?.onPress ?? _empty;
    const cover = item?.cover ?? "";
    const title = item?.name ?? "";
    
    return (
        <Pressable onPress={onPress} style={[{ alignItems: 'center' }, ...(props?.containerStyle ?? [])]}>
            <View style={[styles.cover_wrapper,{ backgroundColor: colors.darkTwo }, ...(props?.coverWrapperStyle ?? [])]}>
                <Image source={{ uri: cover }} style={[styles.cover, { width: rect.width, height: rect.height }, ...(props?.coverStyle ?? [])]} resizeMode="cover" />
            </View>
            <Text numberOfLines={2} style={[{ color: colors.textOne }, styles.title, props.titleStyle]}>
                {(item?.score != undefined && item?.score != 0) && <Text style={{ color: colors.blue, fontWeight: "500" }}>{item.score} </Text>}
                {title}
            </Text>
        </Pressable>
    );
},PropsDiffChecker)


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    cover: {
        borderRadius: 5,
    },
    cover_wrapper: {
        marginBottom: 8,
        borderRadius: 5,
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOpacity: 0.28,
                shadowRadius: 5,
                shadowOffset: {
                    width: 0,
                    height: 3
                }
            },
            android: {
                elevation: 8
            }
        })
    },
    title: {
        fontSize: isPad ? font(13.5) : font(13),
        fontWeight: '500',
        lineHeight: font(18),
        maxWidth: sw * 0.3,
        textAlign: 'center'
    }
});