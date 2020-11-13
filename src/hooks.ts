import { HooksTypes } from './types/index'

export default class Hooks {
    private options

    constructor(options) {
        this.options = options
    }

    beforSendData(params) {

        if (!this.options.beforSendData) return true

        try {
            return this.options.beforSendData(params)
        } catch (e) {
            throw e
            return false
        }
    }
}