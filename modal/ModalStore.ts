import { makeAutoObservable } from 'mobx';


class ModalStore {

    toastMessageProcessQueue:BZToastMessage[] = [];
    toastMessageWaitingQueue:BZToastMessage[] = [];

    loading:boolean = false;
    loadingViewOptions:{
        text?:string;
        contentBackgroundColor?:string;
        loadingView?:any;
    } = {};

    constructor() { makeAutoObservable(this) }

    pushTaskToToastWaitingMessageQueue(toast:BZToastMessage){
        if(toast.text == undefined || toast.text.trim().length == 0){
            return;
        }
        let processQueueLength = this.toastMessageProcessQueue.length;
        let waitingQueueLength = this.toastMessageWaitingQueue.length;
        if(waitingQueueLength == 0){
            if(processQueueLength > 0){
                let queue = [...this.toastMessageWaitingQueue];
                queue.push(toast);
                this.toastMessageWaitingQueue = queue;
            }else{
                let queue = [...this.toastMessageProcessQueue];
                queue.push(toast);
                this.toastMessageProcessQueue = queue;
            }
        }else{
            let queue = [...this.toastMessageWaitingQueue];
            queue.push(toast);
            this.toastMessageWaitingQueue = queue;
        }
    }
    makeToast(toast:BZToastMessage){
        this.pushTaskToToastWaitingMessageQueue(toast);
    }
    processToastMessageWaitingQueue(){
        let processQueue = [...this.toastMessageProcessQueue];
        let waitingQueue = [...this.toastMessageWaitingQueue];
        let toast = waitingQueue.shift();
        if(toast) processQueue.push(toast);
        this.toastMessageProcessQueue = processQueue;
        this.toastMessageWaitingQueue = waitingQueue;
    }
    clearProcessQueue(){
        this.toastMessageProcessQueue = []
    }
    clearToastMessageQueue(){
        this.toastMessageWaitingQueue = [];
    }

    toggleLoading(){
        let options = {
            contentBackgroundColor: 'transparent'
        }
        this.loadingViewOptions = options;
        this.loading = true;
    }
    toggleLoadingWithText(text:string){
        let options = {
            text: text
        }
        this.loadingViewOptions = options;
        this.loading = true;
    }
    toggleLoadingWithLoadingView(view:any){
        let options = {
            loadingView: view
        }
        this.loadingViewOptions = options;
        this.loading = true;
    }
    hideLoading(){
        this.loading = false;
        this.loadingViewOptions = {};
    }
    setLoadingViewOptions(options:any){
        this.loadingViewOptions = options;
    }
}

const modalStore = new ModalStore();

export default modalStore;