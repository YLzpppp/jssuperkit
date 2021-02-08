import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, ScrollView, StyleSheet, Dimensions } from 'react-native';
const { width: sw, height: sh } = Dimensions.get('screen');
import SvgIcon from './SvgIcon';
import AppProvider from '../../AppProvider';

const PADDING = sh * 0.05;
const ICON_SIZE = 25;
const ICON_COLOR = '#000000';

const IconsPreview = () => {

    const Icons = AppProvider.shared.icons();

    const [data, setdata]: any[] = useState([]);
    useEffect(() => {
        let _data: any[] = [];
        let keys = Object.keys(Icons);
        for (let i of keys) {
            _data.push({ title: i, value: Icons[i] })
        }
        setdata(_data);
    }, [])
    return (
        <View style={styles.container}>
            <SafeAreaView>
                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.icons_wrapper}>
                        {
                            data.map((item, index) => {
                                return (
                                    <View style={styles.icon}>
                                        <SvgIcon key={index} name={item.value} size={ICON_SIZE} color={ICON_COLOR} />
                                        <Text>{item.title}</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default IconsPreview;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white' 
    },
    content: {
        paddingTop: PADDING,
        paddingBottom: PADDING
    },
    icons_wrapper: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    icon: {
        marginHorizontal: 12,
        marginVertical: 10,
        alignItems: 'center'
    }
});
