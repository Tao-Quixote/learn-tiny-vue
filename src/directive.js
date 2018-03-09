import { extend } from './util.js'
import Watcher from './watcher.js'

export default function Directive (descriptor, vm, el) {
  this.descriptor = descriptor
  this.vm = vm  // Vue 实例，多个组件时会用到
  this.el = el // 指令要挂载的 dom 元素
  this.expression = descriptor.expression // 指令中的值 @click="clickFn", 则 expression 的值为 clickFn
}

/**
 * @todo 在 指令类 的原型链上实现 _bind 方法，在 compile.js 中编译指令时使用
 * @todo 通过原型链上的 _bind 方法，通过 this 调用每一个实例的 bind 方法
 * 
 * @todo 每个 指令 的 _bind 方法只会在编译到时候调用一次
 */
Directive.prototype._bind = function () {

  var def = this.descriptor.def // 当前对应指令的 实现类，即具体实现，如 v-on、v-bind 等
  if (typeof def === 'function') {
    this.update = def
  } else {
    extend(this, def)
  }

  if (this.bind) this.bind() // 判断 | 调用指令的 bind() 方法
  if (this.update) this.update() // 判断 | 调用指令的 update() 方法

  /**
   * @todo 定义内部 _update 方法，在 watcher 中调用
   */
  if (this.update) {
    const dir = this
    this._update = function (val, oldVal) {
      dir.update(val, oldVal)
    }
  } else {
    this._update = function () {}
  }

  // 创建 watcher 实例
  var watcher = this._watcher = new Watcher(
    this.vm,
    this.expression,
    this._update
  )
  // v-model with inital inline value need to sync back to
  // model instead of update to DOM on init. They would
  // set the afterBind hook to indicate that.
  if (this.update) {
    this.update(watcher.value)
  }   
}
