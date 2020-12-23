import { VueInstance, ViewModel } from '../types/vueType'
import { handleVueError } from './helper'
import { ErrorForShatter } from '../index'
import { InitOptions } from 'types/index'
import { SendType } from '../types/sendType'
import { isError } from 'utils'

export class ShatterErrorVue {
    static install(Vue: VueInstance, options: InitOptions): void {
      const shatter = new ErrorForShatter(options)
      
      if (Vue.config.globalProperties) {
        Vue.config.globalProperties.$report = shatter.report
      } else {
        Vue.prototype.$report = shatter.report
      }

      const asyncErrorHandler = (err: any) => { // 改成不抛出错误，直接 report 上报
        let errString
        if (typeof err === 'object') {
          if (isError(err)) {
            throw err
          } else {
            errString = JSON.stringify(err)
          }
        } else {
          errString = err
        }
        throw new Error(errString)
      }
      Vue.mixin({
        beforeCreate() {
          const methods = this.$options.methods || {}
          Object.keys(methods).forEach(key => {
            const fn = methods[key]
            this.$options.methods[key] = function(...args: any) {
              const ret = fn.apply(this, args)
              if (ret && typeof ret.catch === 'function') {
                return ret.catch(asyncErrorHandler)
              } else { // 默认错误处理
                return ret
              }
            }
          })
        }
      })
      
      if (Vue.config.errorHandler) {
        const oldHandler = Vue.config.errorHandler
        Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string): void {
          const errorData: SendType = handleVueError.apply(null, [err, vm, info])
          shatter.report(errorData)
          oldHandler.call(this, err, vm, info)
        }
      } else {
        Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string): void {
          const errorData: SendType = handleVueError.apply(null, [err, vm, info])
          shatter.report(errorData)
          if (options.debug) {
            throw err
          }
        }
      }
    }
}