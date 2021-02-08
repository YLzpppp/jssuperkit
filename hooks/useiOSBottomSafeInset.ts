import {Platform} from 'react-native';
import { hasNotch } from 'react-native-device-info';

const useiOSBottomSafeInset = () => {
    if(hasNotch() && Platform.OS == 'ios') return 34;
    return 0;
}
export default useiOSBottomSafeInset;