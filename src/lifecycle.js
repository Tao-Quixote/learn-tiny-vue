import { compile } from './compile.js'
import Directive from './directive.js'

/**
 * @todo lifecycle 方法将 生命周期 的阶段混入到 Vue 原型中
 * @param {Vue} Vue Vue类
 */
export default function (Vue) {
  /**
   * @todo 在 Vue 原型上定义 _compile 方法
   * @todo 该方法主要用于 编译指令 directives
   *
    * @param {HTMLDomElement} el 挂载点
    * @param {Object} options {
    *  el: '',
    *  vue-router,
    *  vuex,
    *  components: {},
    *  template: '<App/>',
    *  ...
    * }
   */
  Vue.prototype._compile = function (el, options) {
    const linkFn = compile(el, options)
    if (linkFn) linkFn(this, el)
  }

  /**
   * @todo 在 Vue 的原型链上注册 _bindDir 函数
   * @todo 该方法用于在编译指令的时候，通过指令描述符对象生成指令实例并存放在 vm._directives 数组中
   * @param {Object} descriptor 指令的描述符对象
   * @param {HTMLDOMElement} el 当前指令绑定的 dom 元素
   */
  Vue.prototype._bindDir = function (descriptor, el) {
    this._directives.push(new Directive(descriptor, this, el))
  }
}
