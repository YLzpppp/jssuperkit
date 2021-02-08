import React from 'react';
import { View, ViewStyle,StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

const LoadingView = React.memo((props: {
    containerStyle?: ViewStyle,
    iconSize?: number,
    wrapperStyle?:ViewStyle
}) => {
    const size = props?.iconSize ?? 60;
    return (
        <View style={[styles.container,props.containerStyle]}>
            <View style={[props?.wrapperStyle ?? {}]}>
                <LottieView
                    source={require('../../res/loading_colorful.json')}
                    autoPlay
                    loop
                    style={{ height: size, width: size }} />
            </View>
        </View>
    )
});

export default LoadingView;

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'               
    }
})