import { SendType } from './sendType'

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
     * 默认20，最大100
     */
    maxBreadcrumbs?: number
}
  
export interface HooksTypes {
    /**
     * 钩子函数，在每次发送事件前会调用
     *
     * 如果返回 false 时，将忽略本次上传
     */
    beforeSendData?(event: SendType): PromiseLike<Event | null> | Event | CANCEL

}
  
export interface BlockEventTypes {
      
    /**
     * 禁止上传 console 信息
     */
    blockConsole?: boolean


    /**
     * 禁止上传 vue.warn 信息
     */
    blockVueWarn?: boolean

}

export interface HooksClassType {
    options: InitOptions
}