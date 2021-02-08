import { StyleSheet, Platform } from 'react-native';

const BZStyles = StyleSheet.create({
    flex1: {
        flex: 1
    },
    flex2: {
        flex: 2
    },
    flex3: {
        flex: 3
    },
    flex4: {
        flex: 4
    },
    flex5: {
        flex: 5
    },
    flex6: {
        flex: 6
    },
    flex7: {
        flex: 7
    },
    flex8: {
        flex: 8
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    col_default: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    col_center: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    col_center_h: {
        flexDirection: 'column',
        alignItems: 'center'
    },
    col_center_v: {
        flexDirection: 'column',
        justifyContent: 'center'
    },
    row_default: {
        flexDirection: 'row'
    },
    row_between_center_v: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    row_between: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    row_between_end_v: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },

    absolute: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },

    shadow1: {
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOpacity: 0.5,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 0 }
            },
            android: {
                elevation: 8
            }
        })
    }
});

export default BZStyles;