import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, Easing, useColorScheme, Pressable } from 'react-native';
import { sw, sh, font } from '../base';
import { observer } from 'mobx-react';
import modalStore from './ModalStore';
import ModalProvider from '../ModalProvider';

interface ToastMessageArea {
    top: string;
    center: string;
    bottom: string;
}

interface ToastMessage {
    text: string;
    duration?: number;
    position?: keyof ToastMessageArea
}

//获取 Toast 视图在屏幕上所处位置距离上方的偏移值
const getAreaOffset = (area: keyof ToastMessageArea | undefined) => {
    let offset = 0;
    switch (area) {
        case "top":
            offset = sh * 0.15;
            break;
        case "center":
            offset = sh * 0.45;
            break;
        default:
            offset = sh * 0.73;
            break;
    }
    return offset;
}

const ToastModalContent = observer((props: {
    toast: ToastMessage;
    hideCallback: any;
}) => {

    const schema = useColorScheme();
    const isDark = schema === 'dark';

    const toast = props.toast;
    const opacity = useRef(new Animated.Value(0.0)).current;
    const backgroundColor = useMemo(() => isDark ? '#333333' : '#000000dd', [isDark]);

    const toastViewPositionOffset = useMemo(() => {
        return getAreaOffset(toast.position);
    },[toast])

    const show = (duration?: any) => {
        Animated.timing(opacity, {
            toValue: 1.0,
            useNativeDriver: false
        }).start();
        //定时关闭并清除该Toast
        let t = duration ? duration : 1600;
        timeout = setTimeout(() => {
            hide();
        }, t);
    };
    const hide = () => {
        if (timeout) clearTimeout(timeout);
        props.hideCallback();
    }
    const _manualCancel = () => {
        hide();
    }

    const renderToastView = () => {
        if (ModalProvider.shared.renderToastView) {
            return ModalProvider.shared.renderToastView(props)
        } else {
            return (
                <View style={[
                    styles.toast_container, 
                    { backgroundColor: backgroundColor,marginTop:toastViewPositionOffset }]}>
                    <Text style={styles.toast_text}>
                        {toast?.text ?? ""}
                    </Text>
                </View>
            )
        }
    };
    useEffect(() => {
        show(toast?.duration)
    }, []);

    return (
        <Animated.View style={{ ...StyleSheet.absoluteFill, zIndex: 999, opacity: opacity }}>
            <Pressable
                onPress={_manualCancel}
                style={styles.toast_content_wrapper}>
                    {renderToastView()}
            </Pressable>
        </Animated.View>
    )
});

let timeout: any = null;
const ToastModal = observer((props: any) => {

    const [toast, settoast]: [toast: ToastMessage | undefined, settoast: any] = useState();

    useEffect(() => {
        let processQueueLength = modalStore.toastMessageProcessQueue.length;
        let waitingQueueLength = modalStore.toastMessageWaitingQueue.length;

        if (processQueueLength == 0) {
            //正在处理的Toast消息队列长度为0 ，则检查 待处理 消息队列长度
            if (waitingQueueLength > 0) {
                //待处理队列长度大于0，处理一条Toast消息
                modalStore.processToastMessageWaitingQueue()
            }
        } else {
            //当前正在处理的Toast消息队列存在Toast
            settoast(modalStore.toastMessageProcessQueue[0]);
        }
    }, [modalStore.toastMessageProcessQueue]);

    const hide = () => {
        settoast(undefined);
        modalStore.clearProcessQueue();
    }

    if (!toast) return null;
    return (
        <ToastModalContent toast={toast} hideCallback={hide} />
    )
});

export default ToastModal;

const styles = StyleSheet.create({
    container: {

    },
    toast_content_wrapper:{
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    toast_container: {
        maxWidth: sw * 0.6,
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 9,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: "hidden",
    },
    toast_text: {
        color: '#fdfdfd',
        fontSize: font(14.5),
        lineHeight: 18
    }
});