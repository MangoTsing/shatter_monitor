import { ERRORTYPES } from '../common/errorType'
export interface SendType {
    [key: string]: string | number | unknown
    type?: ERRORTYPES
    msg?: string
    url?: string
    line?: number
    col?: number
    name?: string
    stack?: unknown // 堆栈储存
    time?: number // 发送请求时间
    // fetch
    fetchTimeline?: number // fetch 请求时间线
    request?: {
      httpType?: string
      method: string
      url: string
      data: unknown
    }
    response?: {
      status: number
      data: string
    }
    // vue
    componentName?: string
    propsData?: unknown
}