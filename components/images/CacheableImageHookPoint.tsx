import React, { useEffect } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import imageCacheStore from './CacheManger';

const CacheableImageHookPoint = (props) => {

    useEffect(() => {
        imageCacheStore.prepareCache();
    },[])

    return <View />
}

export default observer(CacheableImageHookPoint);