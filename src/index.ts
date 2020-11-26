import { ErrorForShatter } from './shatter_error/index'
import { PerformanceForShatter } from './shatter_performance/index'
import { BehaviorForShatter } from './shatter_behavior/index'
import { InitOptions } from './types/index'
import { isString } from 'utils'
class ShatterInit {

    static shatterSupport = {
        ErrorForShatter,
        PerformanceForShatter,
        BehaviorForShatter
    }
    
    constructor(options: InitOptions){
        const { usage } = options
        const defaultShatter = 'ErrorForShatter'
        const staticShatterSupport = ShatterInit.shatterSupport
        const shatterArray = []

        if (usage === 'all') {
            shatterArray.push(...Object.keys(staticShatterSupport))
        } else if (Array.isArray(usage)){
            shatterArray.push(...usage)
        } else if (isString(usage)){
            shatterArray.push(usage)
        } else {
            shatterArray.push(defaultShatter)
        }

        shatterArray.forEach((item) => {
            new staticShatterSupport[item](options)
        })
    }
    
}

export { ErrorForShatter, PerformanceForShatter, BehaviorForShatter, ShatterInit }