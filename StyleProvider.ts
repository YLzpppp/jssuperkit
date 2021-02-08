import { FlexStyle,ShadowStyle } from './style';

class StyleProvider {

    public static shared:StyleProvider = new StyleProvider()


    flex = FlexStyle;
    shadow = ShadowStyle;

    constructor(){}
    
}

export default StyleProvider;