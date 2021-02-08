import DefaultIcons from './components/svgicon/DefaultIcons';

class AppProvider {

    public static shared:AppProvider = new AppProvider()

    /**
     *  提供默认SvgIcons图标以及用户自定义图标
     */
    icons:any = DefaultIcons;

    //日志输出筛选： info -> 0 , warning -> 1 ,error -> 2
    debugLevel = 2;

    constructor(){
        console.log('AppProvider Constructed')
    }

    setDebugLevel(level:number){
        this.debugLevel = level;
    }
    
}

export default AppProvider;