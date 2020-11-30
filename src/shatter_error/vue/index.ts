import { VueInstance, ViewModel } from '../types/vueType'
import { handleVueError } from './helper'
import { ErrorForShatter } from '../index'
import { InitOptions } from 'types/index'
import { SendType } from '../types/sendType'

export class ShatterErrorVue {
    static install(Vue: VueInstance, options: InitOptions): void {
      const shatter = new ErrorForShatter(options)
      Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string): void {
        const errorData: SendType = handleVueError.apply(null, [err, vm, info])
        shatter.report(errorData)
      }
    }
}