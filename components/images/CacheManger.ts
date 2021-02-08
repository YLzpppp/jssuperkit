import { makeAutoObservable } from 'mobx';
import RNFS from 'react-native-fs';
import Storage from '@react-native-community/async-storage';

const StorageKey = "CacheList";

interface CacheImageItem {
    path: string;
    url: string;
}

class ImageCacheStore {
    
    cacheReady:boolean = false;
    cachePath: string = RNFS.DocumentDirectoryPath + "Storage/ImageCacheDir";
    cacheList: CacheImageItem[] = [];
    cacheUrls: string[] = [];

    cachingQueue: string[] = [];

    constructor() { makeAutoObservable(this) };

    updateCacheList(cacheList: CacheImageItem[]) {
        this.cacheList = [...cacheList];
    }
    updateCacheUrls(cacheUrls:string[]){
        this.cacheUrls = [...cacheUrls];
    }

    private cacheImage(url: string) {
        let prefix = getUniquePrefix();
        let suffix: string = getImageSuffix(url);
        if (suffix.length > 0) {
            let localpath = this.cachePath + "/" + prefix + suffix;
            RNFS.downloadFile({
                fromUrl: url,
                toFile: localpath
            }).promise.then(result => {
                //download onSuccess callback
                let preUrls = [...this.cacheUrls];
                let preList = [...this.cacheList];
                preUrls.push(url);
                preList.push({ path: localpath, url: url });
                this.updateCacheUrls(preUrls);
                this.updateCacheList(preList);
                Storage.setItem(StorageKey, JSON.stringify(preList));
                //更新下载队列
                let ind = this.cachingQueue.indexOf(url);
                console.log('图片缓存成功')
                if (ind != -1) {
                    let prequeue = [...this.cachingQueue];
                    prequeue.splice(ind, 1);
                    this.cachingQueue = prequeue;
                }
            }).catch(error => {
                //just catch
                console.log('下载失败', error)
            });
        }
    }

    setCachePath(path: string) {
        this.cachePath = path;
    }

    getCacheItem(url: string) {
        let ind = this.cacheUrls.indexOf(url);
        if (ind != -1) {
            console.log("CacheableImage", "图片已缓存，使用本地缓存图片 || 本地路径: ", this.cacheList[ind].path)
            return this.cacheList[ind]
        }
        console.log("CacheableImage", "无本地缓存，执行下载")
        //否则无本地缓存，执行下载操作
        let prequeue = [...this.cachingQueue];
        if (prequeue.indexOf(url) == -1) {
            prequeue.push(url);
            this.cachingQueue = prequeue;
            console.log("CacheableImage", "下载队列添加图片下载任务: ", url)
            this.cacheImage(url);
        }else{
            console.log("CacheableImage", "相同URL图片已存在下载队列、🙅‍♀跳过下载")
        }
        return ind;
    }

    prepareCache() {
        //check dir
        RNFS.exists(this.cachePath).then(exist => {
            if (exist == false) {
                RNFS.mkdir(this.cachePath);
            } else {
                RNFS.readdir(this.cachePath).then(list => {
                    Storage.getItem(StorageKey).then(value => {
                        if (value != null) {
                            let CacheList = JSON.parse(value);
                            if (list.length != CacheList.length) {
                                //数据已经脏了，清空数据，重新缓存
                                for (let i of list) {
                                    RNFS.unlink(this.cachePath + "/" + i);
                                }
                            } else {
                                this.updateCacheList(CacheList);
                            }
                        }
                    })
                })
            }
        }).finally(() => {
            this.cacheReady = true;
        })
    }
}

function getUniquePrefix() {
    let now = new Date();
    let day = `${now.getFullYear()}${now.getUTCMonth() + 1}${now.getDate()}`;
    let output = day + Math.random().toString().replace("0.", "")
    return output;
}
function getImageSuffix(url) {
    let suffixs = [/.jpg/ig, /.png/ig, /.jpeg/ig];
    for (let i of suffixs) {
        let matchresult = url.match(i);
        if (matchresult != null) {
            return matchresult[0];
        }
    }
    return ""
}


const imageCacheStore = new ImageCacheStore();

export default imageCacheStore;