import { getLocationHref } from 'utils'
import { ERRORTYPES } from '../../common/errorType'
import { ViewModel } from '../types/vueType'
import { SendType } from '../types/sendType'
import { ERRORNAMETYPES } from '../../common/errorType'
function formatComponentName(vm: ViewModel) {
  if (vm.$root === vm) return 'root'
  const name = vm._isVue ? (vm.$options && vm.$options.name) || (vm.$options && vm.$options._componentTag) : vm.name
  return (
    (name ? 'component <' + name + '>' : 'anonymous component') +
    (vm._isVue && vm.$options && vm.$options.__file ? ' at ' + (vm.$options && vm.$options.__file) : '')
  )
}

export function handleVueError(err: Error, vm: ViewModel, info: string): SendType {
  const componentName = formatComponentName(vm)
  const propsData = vm.$options && vm.$options.propsData
  const data: SendType = {
    type: ERRORTYPES.VUE_ERROR,
    msg: `${err.message}(${info})`,
    url: getLocationHref(),
    componentName: componentName,
    propsData: propsData || '',
    name: ERRORNAMETYPES['VueError'],
    stack: err.stack || []
  }
  return data
}