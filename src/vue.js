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
    /**
     * @todo 存放指令
     */
    this._directives = []
    /**
     * @todo 存放 watchers
     */
    this._watchers = []

    const el = document.querySelector(options.el)

    options._containerAttrs = toArray(el.attributes) // get attrs of el

    /**
     * @todo 将 options 中 methods 对象中存放的所有方法，
     * @todo 设置到 Vue 实例上作为一个属性，这里的 this 指向 Vue 实例
     */
    this.$options = options
    // merge options
    for (let k in options.methods) {
      this[k] = options.methods[k] // 循环遍历设置方法到 Vue 实例
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
