import { ERRORTYPES, ERRORNAMETYPES } from '../../common/errorType'
export interface SendType {
    [key: string]: string | number | unknown
    type?: ERRORTYPES
    msg?: string
    url?: string
    line?: number
    col?: number
    name?: ERRORNAMETYPES
    stack?: unknown // 堆栈储存
    
    // fetch
    fetchTimeline?: number // fetch 请求时间线
    request?: {
      httpType?: string
      method: string
      data?: unknown
    }
    response?: {
      status: number
      data: string
    }
    // vue
    componentName?: string
    propsData?: unknown
}