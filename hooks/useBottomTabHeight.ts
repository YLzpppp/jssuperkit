/**
 * BottomTabHeight : 56
 * Notification !!! sync this value if BottomTabHeight changed 
 * ( Locate at @router/BottomTabBarConstants )
 */
import useiOSBottomSafeInset from './useiOSBottomSafeInset';

const useBottomTabHeight = (tabBarHeight?:number) => {
    let tabHeight = tabBarHeight ?? 56;
    return useiOSBottomSafeInset() + tabHeight;
};

export default useBottomTabHeight;