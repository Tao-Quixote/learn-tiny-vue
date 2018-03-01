import Dep from  './dep.js'

function Observer(value) {
  this.value = value
  this.dep = new Dep()
  // TODO: support Array
  this.walk(value)
}

// Instance methods

/**
 * @todo 遍历 Vue.$options.data 中所有到属性
 * 
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 *
 * @param {Object} obj Vue.$options.data，即每个组件中的 data 方法/对象
 */

Observer.prototype.walk = function (obj) {
  var keys = Object.keys(obj)
  for (var i = 0, l = keys.length; i < l; i++) {
    this.convert(keys[i], obj[keys[i]])
  }
}


/**
 * @todo 调用 defineReactive 方法
 * @todo 将 Vue.$options.data 中到每一个属性设置为响应式的
 * 
 * Convert a property into getter/setter so we can emit
 * the events when the property is accessed/changed.
 *
 * @param {String} key
 * @param {*} val
 */

Observer.prototype.convert = function (key, val) {
  // this.value === Observer.value === Vue.$options.data
  defineReactive(this.value, key, val)
}


/**
 * Add an owner vm, so that when $set/$delete mutations
 * happen we can notify owner vms to proxy the keys and
 * digest the watchers. This is only called when the object
 * is observed as an instance's root $data.
 *
 * @param {Vue} vm
 */
Observer.prototype.addVm = function (vm) {
  (this.vms || (this.vms = [])).push(vm)
}

/**
 * 导出 observe 方法
 * @param {*} value Vue.$options.data
 * @param {*} vm Vue 实例
 */
export function observe (value, vm) {
  const ob = new Observer(value)
  ob.addVm(vm)
  return ob
}

/**
 * data () {
 *  return {
 *    a: 'xx'
 *  }
 * }
 */
/**
 * Define a reactive property on an Object.
 * obj === Observer.value === Vue.$options.data === vm._data
 * 每一个 key value 都有一个单独的 new Dep()
 * 
 * @todo 对于 data 中的每一个属性，调用 defineReactive() 函数时，
 * @todo 由于设置的 getters/setters 中包含对 var dep = new Dep() 的引用
 * @todo 所以这里形成了闭包，每个 getter/setter 中都包含对其对应 dep 的引用
 * @todo 每次 get/set 时都能拿到对应对 dep
 * 
 * @todo 这里对闭包用的很牛逼，点赞！！！
 *
 * @param {Object} obj
 * @param {String} key
 * @param {*} val
 */
export function defineReactive (obj, key, val) {
  var dep = new Dep()

  var property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }

  var getter = property && property.get
  var setter = property && property.set

  /**
   * @todo 为 Vue.$options.data 中的 key 设置 getter/setter
   * @todo 在 getter/setter 中，会设置 依赖 & 通知依赖更新
   */
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      console.log(`observer.get`)
      var value = getter ? getter.call(obj) : val
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      console.log(`observer.set:${newVal}`)
      var value = getter ? getter.call(obj) : val
      if (newVal === value) {
        return
      }
      val = newVal
      dep.notify()
    }
  })
}
