import { useMemo } from 'react';
import { useColorScheme } from 'react-native';

interface PresetColor {
    title: string;
    body: string;
    caption: string;
    background: string;
    grayBackground: string;
    border: string;

    placeholder1: string;
    placeholder2: string;
    placeholder3: string;
}
const DefaultTitleColor = {
    light: '#000000',
    dark: '#FFFFFF'
};
const DefaultBodyColor = {
    light: '#191919',
    dark: '#FAFAFA'
};
const DefaultCaptionColor = {
    light: '#555555',
    dark: '#999999'
};
const DefaultBackgroundColor = {
    light: '#FFFFFF',
    dark: '#000000'
};
const DefaultGrayBackgroundColor = {
    light: '#E5E5E5',
    dark: '#323232'
}
const DefaultBorderColor = {
    light: '#E0E0E1',
    dark: '#2C2B2F'
}
const PlaceholderColor1 = {
    light: '#DDDDDD',
    dark: '#DDDDDD'
}
const PlaceholderColor2 = {
    light: '#CCCCCC',
    dark: '#CCCCCC'
}
const PlaceholderColor3 = {
    light: '#AAAAAA',
    dark: '#AAAAAA'
}

const useAdaptiveColor = (colors?:
    {
        lightColor: string;
        darkColor: string;
    },
    preset?: keyof PresetColor
) => {

    const schema = useColorScheme();
    const isDark = schema === 'dark';

    const color = useMemo(() => {
        if (preset) {
            switch (preset) {
                case 'title':
                    return isDark ? DefaultTitleColor.dark : DefaultTitleColor.light
                case 'body':
                    return isDark ? DefaultBodyColor.dark : DefaultBodyColor.light
                case 'caption':
                    return isDark ? DefaultCaptionColor.dark : DefaultBodyColor.light
                case 'background':
                    return isDark ? DefaultBackgroundColor.dark : DefaultBackgroundColor.light
                case 'border':
                    return isDark ? DefaultBorderColor.dark : DefaultBorderColor.light
                case 'grayBackground':
                    return isDark ? DefaultGrayBackgroundColor.dark : DefaultGrayBackgroundColor.light
                case 'placeholder1':
                    return isDark ? PlaceholderColor1.dark : PlaceholderColor1.light
                case 'placeholder2':
                    return isDark ? PlaceholderColor2.dark : PlaceholderColor2.light
                case 'placeholder3':
                    return isDark ? PlaceholderColor3.dark : PlaceholderColor3.light
                default:
                    return isDark ? (colors?.darkColor ?? 'black') : (colors?.lightColor ?? 'white');
            }
        } else {
            return isDark ? (colors?.darkColor ?? 'black') : (colors?.lightColor ?? 'white');
        }
    }, [isDark]);

    return color;

}

export default useAdaptiveColor;