import React, { useMemo } from 'react';
import { Image, ImageStyle, View, StyleSheet ,useColorScheme} from 'react-native';
import { observer } from 'mobx-react';
import imageCacheStore from './CacheManger';

const CacheableImage = (props: {
    url: string;
    style?: ImageStyle[];
    disableCache?: boolean;
    resizeMode?: "contain" | "cover" | "stretch" | "repeat" | "center" | undefined
}) => {

    const schema = useColorScheme();

    const defaultBackgroundColor = useMemo(() => schema === 'dark' ? '#666666' : '#666666',[schema]);

    const disableCache = props?.disableCache ?? false;

    const imageUrl = useMemo(() => {
        if (!imageCacheStore.cacheReady) {
            return "";
        }
        if (disableCache) {
            return props.url;
        }
        let item: any = imageCacheStore.getCacheItem(props.url);
        if (item != -1) {
            return "file://" + item.path;
        }
        return props.url;
    }, [props.url, disableCache, imageCacheStore.cacheReady]);

    const imageStyle = useMemo(() => props?.style ?? [styles.container], [props.style]);

    return (
        <View style={[{backgroundColor: defaultBackgroundColor,overflow:'hidden'},...imageStyle]}>
            <Image source={{ uri: imageUrl }} style={styles.container} resizeMode={props?.resizeMode} />
        </View>
    )
}

export default observer(CacheableImage);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})