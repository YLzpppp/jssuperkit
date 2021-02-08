import { makeAutoObservable } from 'mobx';
import React from 'react';
import DefaultPage from './DefaultPage';
import DefaultIcons from '../components/svgicon/DefaultIcons';

const ThemeLight = {
    dark:false,
    colors:{
        primary: '#FFFFFF',
        background: '#FFFFFF',
        card: '#DEDEDE',
        text: '#232323',
        border: '#F1F1F1',
    }
};
const ThemeDark = {
    dark:true,
    colors:{
        primary: '#000000',
        background: '#000000',
        card: '#1D1D1E',
        text: '#FFFFFF',
        border: '#323235',
    }
}

const TAB_ROUTERS = ["首页", "发现", "我的"];
const PageOne = (props:any) => {return <DefaultPage text={TAB_ROUTERS[0]} />;} 
const PageTwo = (props:any) => {return <DefaultPage text={TAB_ROUTERS[1]} />;}
const PageThree = (props:any) => {return <DefaultPage text={TAB_ROUTERS[2]} />;}

const DefaultTabScreens: BZTabScreenOption[] = [
    { 
        name: TAB_ROUTERS[0],
        component: PageOne, 
        tabItem: { 
            svgicon: { name:DefaultIcons.breezeHome}
        }
    },
    { 
        name: TAB_ROUTERS[1],
        component: PageTwo, 
        tabItem: { 
            tabBarBackgroundColor: '#030303',
            svgicon: { name:DefaultIcons.breezeFind}
        }
    },
    { 
        name: TAB_ROUTERS[2],
        component: PageThree, 
        tabItem: { 
            svgicon: { name:DefaultIcons.breezeMe}
        }
    }
];
const DefaultTabBarOption = {
    lazy:true,
    backgroundColor:'white',
    backgroundColorDark:'#020202',
    blurBackgroundOpacity:0.78
}


class NavigationStore {

    tabScreenNotifications: TabScreenNotifications[] = [];
    isTabBarTranslucent: boolean = true;
    isTabBarHidden: boolean = false;
    isShadowEnabled: boolean = true;
    isBorderEnabled: boolean = false;
    isBlurEnabled:boolean = true;

    tabScreens:BZTabScreenOption[] = DefaultTabScreens;
    tabBarOptions:BZTabBarOption = DefaultTabBarOption;
    themes: {light:any;dark:any;} = {light: ThemeLight,dark: ThemeDark};

    constructor() { makeAutoObservable(this) }

    /**
     * @param name  路由名
     * @param count 页面消息数量
     * 
     *  更新对应页面的消息数量
     */
    setNotificationCount(name: string, count: number) {
        if (count <= 0) {
            count = 0
        }
        if (count > 99) {
            count = 99
        }
        let notifications = [...this.tabScreenNotifications];
        for (let i of notifications) {
            if (i.name === name) {
                i.count = count;
                this.tabScreenNotifications = notifications;
                return;
            }
        }
    }
    /**
     * @param translucent 底部导航是否允许内容下沉到导航栏下面（启用绝对定位）
     */
    setTabBarTranslucent(translucent: boolean) {
        this.isTabBarTranslucent = translucent;
    }
    /**
     * @param hidden 
     * 设置底部导航栏是否影藏
     */
    setTabBarHidden(hidden: boolean) {
        this.isTabBarHidden = hidden;
    }
    /**
     * @param enabled 
     * 设置底部导航栏是否显示阴影
     */
    setShadowEnabled(enabled: boolean) {
        this.isShadowEnabled = enabled;
    }
    /**
     * @param enabled 
     * 设置底部导航栏是否显示顶部外边框
     */
    setBorderEnabled(enabled: boolean) {
        this.isBorderEnabled = enabled;
    }

    setIsBlurEnabled(enabled:boolean){
        this.isBlurEnabled = enabled;
    }

    /**
     * @param screens 
     * 完全自定底部导航页面路由
     */
    setTabScreens(screens:BZTabScreenOption[]){
        this.tabScreens = screens;
    }
    /**
     * @param screens 
     * 仅仅注入默认底部导航路由对应的页面
     */
    injectTabScreens(screens:any[]){
        let count = screens.length;
        let tabCount = this.tabScreens.length;
        for(let i = 0;i<count;i++){
            if(i == tabCount) break;
            this.tabScreens[i].component = screens[i]
        }
    }
    /**
     * @param options 
     * 设置底部导航栏组件配置信息
     */
    setTabBarOptions(options:BZTabBarOption){
        this.tabBarOptions = options;
    }
    /**
     * @param themes 
     * 设置导航主题颜色
     */
    setThemes(themes:{light:any;dark:any}){
        this.themes = themes;
    }

}

const navigationStore = new NavigationStore();

export default navigationStore;