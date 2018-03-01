import { toArray } from './util.js'
import lifecycle from './lifecycle.js'
import state from './state.js'

class Vue {
  constructor (options) {
    this.init(options)
  }

  /**
   * 初始化的入口
   */
  init (options) {
    this._directives = []
    this._watchers = []

    const el = document.querySelector(options.el)

    options._containerAttrs = toArray(el.attributes) // get attrs of el

    this.$options = options
    // merge options
    for (let k in options.methods) {
      this[k] = options.methods[k]
    }
    /**
     * @todo _initState 方法是通过 mixin 的方式，
     * @todo 在下面的 state(Vue) 中挂载到 Vue 的原型链上的
     */
    this._initState()

    /**
     * @todo 同理，通过 mixin 的方式往 Vue 的原型链上挂在属性和方法
     */
    this._compile(el, options)
  }
}

// mixin lifecycle
/**
 * @todo handle state/data
 * @todo 处理 this.$options.data，设置到 vm._data，设置 getters/setters
 * @todo 设置 Observers、Watchers
 */
state(Vue)
lifecycle(Vue)

/**
 * @todo set as a property of window
 */
window.Vue = Vue // for debug
