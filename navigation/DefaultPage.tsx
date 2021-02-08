import React,{useMemo } from 'react';
import { View, Text, SafeAreaView, StyleSheet,useColorScheme } from 'react-native';

const DEFAULT_TEXT = 'Hello ,my friends😄';

const DefaultPage = (props: {
    text?: string;
}) => {

    const schema = useColorScheme();

    const textStyle = useMemo(() => schema === 'dark' ? styles.text_dark : styles.text_light,[schema]);
    const pageStyle = useMemo(() => schema === 'dark' ? styles.page_dark : styles.page_light,[schema]);
    const textValue = props?.text ? `🥳 Breeze Navigation Provider\n Located in🚪: ${props.text}` : DEFAULT_TEXT;

    return (
        <View style={[styles.container,pageStyle]}>
            <SafeAreaView style={styles.content}>
                <Text style={[textStyle,{textAlign:'center'}]}>
                    {textValue}
                </Text>
            </SafeAreaView>
        </View>
    )
};

export default DefaultPage;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_light: {
        fontSize:21,
        color:'#232323',
        lineHeight:38,
    },
    text_dark: {
        fontSize:21,
        color:'#DDDDDD',
        lineHeight:38,
    },
    page_light: {
        backgroundColor: '#FEFEFE',
    },
    page_dark: {
        backgroundColor: '#323232'
    }
})