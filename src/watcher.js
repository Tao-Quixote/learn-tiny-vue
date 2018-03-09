import Dep from './dep.js'

let uid = 0

/**
 * 
 * @param {Object} vm Vue 实例
 * @param {String} expOrFn 指令的值，如 v-on:click="pop", v-on:click 的值为 “pop”
 * @param {String} expOrFn v-text="name" 中 v-text 指令的值为 name，watcher 需要知道更新谁的值，就从 expOrFn(name) 中取
 * @param {Function} cb Directive.prototype._update 方法
 */
export default function Watcher (vm, expOrFn, cb) {
  vm._watchers.push(this) // 将 watcher 存放到 vm._watchers 数组中
  this.vm = vm // 保存对 Vue 实例的引用
  this.expOrFn = expOrFn // 指令的值
  this.expression = expOrFn // 指令的值
  this.cb = cb // 指令类的实例的 _update 方法
  this.id = ++uid // uid for batching
  this.deps = []
  this.depIds = new Set()

  // TODO: support expression, like: "'Hello' + user.name"
  this.getter = () => {
    return vm[expOrFn]
  }

  /**
   * @todo 通过 Observe 中设置的 getter、setter 来获取/设置值
   * @param {Object} vm Vue 实例
   * @param {*} value 要设置的值
   */
  this.setter = (vm, value) => {
    return vm[expOrFn] = value
  }

  // 缓存老数据，用于与新设置的值比较
  this.value = this.get()
}

// 向外部暴露的 run 方法的调用
Watcher.prototype.update = function () {
  this.run()
}

/**
 * @todo 获取新旧数据进行比较，如果新旧数据不一致，则调用 watcher 初始化时传入的 cb 方法
 * @todo cb 其实为指令向外暴露的 _update() 方法
 */
Watcher.prototype.run = function () {
  const value = this.get()
  const oldValue = this.value

  if (value !== oldValue) {
    this.cb.call(this.vm, value, oldValue)
  }
}

/**
 * @todo 将 Dep.target 设置为当前 watcher
 */
Watcher.prototype.get = function () {
  Dep.target = this
  const value = this.getter.call(this.vm, this.vm)
  Dep.target = null
  return value
}


Watcher.prototype.set = function (value) {
  return this.setter.call(this.vm, this.vm, value)
}

/**
 * 将该 watcher 添加到每个响应式数据的依赖(dep)中 dep.addSub(this)
 * @param {Dep} dep 依赖实例
 */
Watcher.prototype.addDep = function (dep) {
  if (!this.depIds.has(dep.id)) {
    this.deps.push(dep)
    this.depIds.add(dep.id)
    dep.addSub(this)
  }
}
