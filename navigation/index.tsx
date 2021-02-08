import React, { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { observer } from 'mobx-react';
import DefaultTabBar from './DefaultTabBar';
import navigationStore from './NavigationStore';

const StackNavigation = createStackNavigator();
const BottomNavigation = createBottomTabNavigator();

interface AppRouters {
    name: string;
    component: any;
    options?: StackNavigationOptions
}

/**
 * @底部导航
 * 
 */
const AppTabBarNavigation = observer((props) => {

    const tabScreens = navigationStore.tabScreens;
    const options = navigationStore.tabBarOptions;
    const lazy = options?.lazy ?? true;
    const renderTabBar = options?.renderTabBar ?? null;
    const renderTabBarContent = options?.renderTabBarContent ?? null;
    const usedCustomTabBar = renderTabBar != null;

    const renderTabScreen = tabScreens.map((value, index) => {
        return <BottomNavigation.Screen key={index} name={value.name} component={value.component} />
    });
    const renderDefaultTabBar = (props:any) => <DefaultTabBar {...props} tabScreen={tabScreens}/>;

    return (
        <BottomNavigation.Navigator
        lazy={lazy}
        tabBar={usedCustomTabBar ? renderTabBar : renderDefaultTabBar}
        >
            {renderTabScreen}
        </BottomNavigation.Navigator>
    )
});

/**
 * @栈路由导航
 * 
 */
const AppNavigation = observer((props: {
    routers?: AppRouters[];
}) => {
    const schema = useColorScheme();
    const isDark = schema == 'dark';
    const routers = props?.routers ?? [];
    const registeredTabScreens:boolean = navigationStore.tabScreens.length > 0;
    const theme = isDark ?  navigationStore.themes.dark : navigationStore.themes.light;

    const stackRouters = routers.map((router: any) => {
        return (
            <StackNavigation.Screen
                key={router.name}
                options={router.options}
                name={router.name}
                component={router.component}
            />
        )
    });

    return (
        <NavigationContainer theme={theme}>
            <StackNavigation.Navigator screenOptions={{
                gestureEnabled: true,
                headerShown: false
            }}>
                {registeredTabScreens && <StackNavigation.Screen name={'Home'} component={AppTabBarNavigation} />}
                {stackRouters}
            </StackNavigation.Navigator>
        </NavigationContainer>
    )
});

export default AppNavigation;