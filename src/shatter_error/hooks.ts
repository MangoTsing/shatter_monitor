import { SendType } from './types/sendType'
import { HooksClassType, HooksTypes } from '../types/index'

export default class Hooks implements HooksTypes, HooksClassType {
    public options

    constructor(options) {
        this.options = options
    }
    
    beforeSendData?(params: SendType): boolean | Event | PromiseLike<Event> {
        if (!this.options.beforeSendData) return true

        try {
            return this.options.beforeSendData(params)
        } catch (e) {
            throw e
            return false
        }
    }

}