import modalStore from './modal/ModalStore';

class ModalProvider {
    
    public static shared:ModalProvider = new ModalProvider();


    renderToastView:(((props:any) => any) | undefined);
    store:ModalStore = modalStore;


    /**
     * @param render 自定义Toast视图
     * 
     * 设置自定义Toast视图
     */
    setRenderToastView(render:any){
        this.renderToastView = render;
    }
}

export default ModalProvider;