import { VueInstance, ViewModel } from '../types/vueType'
import { handleVueError } from './helper'
import { ErrorForShatter } from '../index'
import { InitOptions } from 'types/index'
import { SendType } from '../types/sendType'

export class ShatterErrorVue {
    static install(Vue: VueInstance, options: InitOptions): void {
      const shatter = new ErrorForShatter(options)
      const asyncErrorHandler = (err: any) => {
        const errString = typeof err === 'object' ? JSON.stringify(err) : err
        throw new Error(errString)
      }
      Vue.mixin({
        beforeCreate() {
          const methods = this.$options.methods || {}
          Object.keys(methods).forEach(key => {
            let fn = methods[key]
            this.$options.methods[key] = function(...args: any) {
              let ret = fn.apply(this, args)
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
        }
      }
    }
}