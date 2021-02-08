declare interface BZEdgeInsets {
    top?:number,
    right?:number,
    bottom?:number,
    left?:number
}
declare interface BZImageOption {
    src: any;
    size?: { height: number; width?: number; offsetX?: number; offsetY?: number; };
}
declare interface BZTextOption {
    color?: string;
    colorDark?: string;
    tintColor?: string;
    tintColorDark?: string;
    fontSize?: number;
    fontWeight?: "bold" | "normal" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900" | undefined;
}
declare interface BZSvgIconOption {
    name: string[];
    options?: {
        size?: number;
        color?: string;
        colorDark?: string;
        scale?: number;
        offset?: {
            x?: number;
            y?: number;
        }
    }
}
declare interface BZTabItem {
    textOption?: BZTextOption;
    image?: BZImageOption;
    imageDark?: BZImageOption;
    selectedImage?: BZImageOption;
    selectedImageDark?: BZImageOption;
    svgicon?: BZSvgIconOption;
    selectedSvgIcon?: BZSvgIconOption;
    tabBarBackgroundColor?: string;
}
declare interface BZTabScreenOption {
    name: string;
    component: any;
    tabItem: BZTabItem;
}
declare interface BZTabBarOption {
    blurBackgroundOpacity?: number;
    backgroundColor?: String;
    backgroundColorDark?: String;
    lazy?: boolean;
    renderTabBar?: any;
    renderTabBarContent?: any;
}
declare interface BZAppRouters {
    name: string;
    component: any;
    options?: any;
}

declare class AppProvider {
    public static shared: typeof AppProvider;
    icons: any;
    registerIcons: (icons, override?: boolean) => void;
    setDebugLevel: (level: number) => void;
}
declare class StyleProvider {
    public static shared: typeof StyleProvider;
    flex: any;
    shadow: any;
}
declare interface TabScreenNotifications {
    name: string;
    count: number;
}
declare class NavigationStore {
    tabScreenNotifications: TabScreenNotifications[];
    isTabBarTranslucent: boolean;
    isTabBarHidden: boolean;
    isShadowEnabled: boolean;
    isBorderEnabled: boolean;
    isBlurEnabled: boolean;

    setNotificationCount: (name: string, count: number) => void;
    setTabBarTranslucent: (translucent: boolean) => void;
    setTabBarHidden: (hidden: boolean) => void;
    setShadowEnabled: (enabled: boolean) => void;
    setBorderEnabled: (enabled: boolean) => void;
    setIsBlurEnabled: (enabled: boolean) => void;

}
declare class NavigationProvider {
    public static shared: NavigationProvider;
    tabScreens: BZTabScreenOption[];
    tabBarOptions: BZTabBarOption;
    themes: { light: any; dark: any; }
    store: NavigationStore;

    setTabScreens: (screens: BZTabScreenOption[]) => any;
    injectTabScreens: (screens: any[]) => void;
    setTabBarOptions: (options: BZTabBarOption) => void;
    setThemes: (themes: { light: any; dark: any }) => void;
}

declare interface TypeKind {
    string: string;
    function: string;
    null: string;
    undefined: string;
    number: string;
}

/**
 *  Toast relative
 */

interface BZToastMessageArea {
    top: string;
    center: string;
    bottom: string;
}

interface BZToastMessage {
    text: string;
    duration?: number;
    position?: keyof BZToastMessageArea
}
interface BZLoadingViewOptions {
    text?: string;
    contentBackgroundColor?: string;
    loadingView?: any;
}

declare class ModalStore {

    toastMessageProcessQueue: BZToastMessage[];
    toastMessageWaitingQueue: BZToastMessage[];
    
    loading:boolean;
    loadingViewOptions:BZLoadingViewOptions;

    pushTaskToToastWaitingMessageQueue(toast: BZToastMessage);
    makeToast(toast: BZToastMessage);
    processToastMessageWaitingQueue()
    clearToastMessageQueue()
    clearProcessQueue()

    toggleLoading()
    toggleLoadingWithText(text:string)
    toggleLoadingWithLoadingView(view:any)
    hideLoading()
    setLoadingViewOptions(options:any)
}

declare class ModalProvider {

    public static shared: ModalProvider;


    renderToastView: (((props: any) => any) | undefined);
    store: ModalStore;


    /**
     * @param render 自定义Toast视图
     * 
     * 设置自定义Toast视图
     */
    setRenderToastView(render: (((props: any) => any) | undefined));
}

declare interface BZStorage {
    setItem: (key:any,value:any,onError?:(e)=>void) => Promise<any>;
    removeItem: (key:any,onError?:(e)=>void) => Promise<any>;
    removeMultiItems: (keys: any[],onError?:(e)=>void) => Promise<any>;
    removeAllItems: () => void;
    getItem: (key: any,onError?:(e)=>void) => Promise<any>;
}

declare interface BZNumberFormatter {
    converToBigUnit: (num:number) => string;
}

declare interface BZTimFormatter {
    getLocalDay: (d:number) => string;
}

declare const BZApp: AppProvider;
declare const BZStyle: StyleProvider;
declare const BZNavigation: NavigationProvider;
declare const BZModal: ModalProvider;
declare const BZToast: ModalStore;

declare const BZTimeFormatter:any;
declare const BZNumberFormatter:BZNumberFormatter;
declare const BZStorage:BZStorage;

declare const font: (v: number) => number;
declare const getPixel:(dp: number) => number;
declare const sw: number;
declare const sh: number;
declare const ww: number;
declare const wh: number;
declare const isPad: boolean;
declare const isAndroid: boolean;
declare const NullChecker: (target: any) => boolean;
declare const TypeChecker: (target: any, kind: keyof TypeKind) => boolean;
declare const EmptyFunc: () => any;
declare const LOG: {
    info: (...args) => void;
    warn: (...args) => void;
    error: (...args) => void;
};
declare const di: (...args) => void;
declare const dw: (...args) => void;
declare const de: (...args) => void;

declare const Space = 6;
declare const Space1 = 8;
declare const Space2 = 12;
declare const Space3 = 14;
declare const Space4 = 16;
declare const Space5 = 18;
declare const Space6 = 22;
declare const Space7 = 24;
declare const Space8 = 28;
declare const Space9 = 36;

declare const h1 = 32;
declare const h2 = 20;
declare const h3 = 18;
declare const h4 = 16;
declare const body = 14;
declare const caption = 12;
declare const footer = 11;

declare const radius = 4;
declare const radius1 = 8;
declare const radius2 = 12;
declare const radius3 = 16;
declare const radius4 = 20;
declare const radius5 = 24;
declare const radius6 = 30;