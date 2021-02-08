import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Modal, Dimensions, Animated, ActivityIndicator, useColorScheme, StyleSheet } from 'react-native';
const { width: sw } = Dimensions.get('window');
import LottieView from 'lottie-react-native';
import { observer } from 'mobx-react';
import modalStore from './ModalStore';
import { font } from '../base';

const CONTENT_BACKGROUND = '#000000DD';
const CONTENT_BACKGROUND_DARK = '#333333';

const LoadingModalContent = React.memo((props: {
    options: any
}) => {

    const schema = useColorScheme();
    const isDark = schema === 'dark';

    const options = props.options;

    const opacityValue = useRef(new Animated.Value(0.0)).current;
    const text = options?.text;

    const contentBackgroundColor = useMemo(() => {
        if (options?.contentBackgroundColor) {
            return options?.contentBackgroundColor;
        } else {
            return isDark ? CONTENT_BACKGROUND_DARK : CONTENT_BACKGROUND;
        }
    }, [props.options, isDark]);

    const renderContentView = useCallback(() => {
        if (options?.loadingView) {
            return options.loadingView;
        } else {
            return (
                <View style={[styles.content, { backgroundColor: contentBackgroundColor }]}>
                    <LottieView
                        source={require('../res/loading_colorful.json')}
                        autoPlay
                        loop
                        style={{ height: 50, width: 90 }} />
                    {text && <Text style={styles.text}>{text}</Text>}
                </View>
            )
        }
    },[options]);

    useEffect(() => {
        Animated.timing(opacityValue, {
            toValue: 1.0,
            useNativeDriver: false
        }).start();
    }, [])

    return (
        <View style={[styles.absolute, { zIndex: 900 }]}>
            <Animated.View style={styles.container}>
                {renderContentView()}
            </Animated.View>
        </View>
    )
});

const LoadingModal = observer((props) => {

    if (!modalStore.loading) return null;

    return (
        <LoadingModalContent options={modalStore.loadingViewOptions} />
    )
})

export default LoadingModal;


const styles = StyleSheet.create({
    absolute: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        minHeight: 90,
        minWidth: 90,
        maxWidth: sw * 0.6,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: "hidden",
    },
    text: {
        marginTop: 3,
        color: '#f8f8f8',
        fontSize: font(16)
    }
})