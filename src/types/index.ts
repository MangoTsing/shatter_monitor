import { SendType } from '../shatter_error/types/sendType'

type CANCEL = null | undefined | boolean

export interface InitOptions extends BlockEventTypes, HooksTypes {

    /**
     * dsn服务器地址
     */
    dsn: string


    /**
     * 唯一key
     */
    appkey: string


    /**
     * 默认关闭，打印调试信息
     */
    debug?: boolean

    
    /**
     * 仅使用创建 img 标签方式打点
     */
    onlyImg?: boolean


    /**
     * 默认20，最大100
     */
    //maxBreadcrumbs?: number
    

    /**
     * 使用的 shatter monitor
     */
    usage?: string | string[]
    
}
  
export interface HooksTypes {
    /**
     * 钩子函数，在每次发送事件前会调用
     *
     * @params params 发送参数
     * 
     * ps: 如果返回 false 时，将忽略本次上传
     */
    beforeSendData?(params: SendType): boolean | Event | PromiseLike<Event> | CANCEL

}

export interface BlockEventSingleTypes{

    /**
     * 禁止上传 console.error 信息
     */
    blockConsole?: boolean


    /**
     * 禁止上传 Unhandledrejection 信息
     */
    blockPromise?: boolean

    
    /**
     * 禁止上传 error 事件
     */
    blockError?: boolean


    /**
     * 禁止上传资源加载信息
     */
    blockSource?: boolean


    /**
     * 禁止上传 xhr 信息
     */
    blockXhr?: boolean


    /**
     * 禁止上传 fetch 信息
     */
    blockFetch?: boolean

    /**
     * 禁止全局 addeventlistener 使用 try...catch
     */
    blockTry?: boolean

}
  
export interface BlockEventTypes extends BlockEventSingleTypes{
      
    /**
     * 禁止上传所有 xhr 信息
     */
    blockHttpRequest?: boolean

    
    /**
     * 仅上传 xhr 信息，禁止对其他原生事件监听及处理
     */
    onlyHttpRequest?: boolean

}

export interface HooksClassType {
    options: InitOptions
}