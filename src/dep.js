let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 *
 * @constructor
 */

export default function Dep () {
  this.id = uid++
  this.subs = []
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null

/**
 * Add a directive subscriber.
 * 
 * @todo 添加订阅
 *
 * @param {Directive} sub
 * @todo 注意这里的 sub 是 Directive 类型，即添加的订阅都是 “指令/watcher”，
 * @todo 所以下面的 notify() 中也是通过调用 指令 的 update() 方法来更新 Dom 的
 */

Dep.prototype.addSub = function (sub) {
  this.subs.push(sub)
}

/**
 * Remove a directive subscriber.
 * 
 * @todo 移除订阅
 * @todo 注意这里的 sub 是 Directive 类型，即添加的订阅都是 “指令”
 *
 * @param {Directive} sub
 */

Dep.prototype.removeSub = function (sub) {
  this.subs.$remove(sub)
}

/**
 * Add self as a dependency to the target watcher.
 */

Dep.prototype.depend = function () {
  Dep.target.addDep(this)
}

/**
 * Notify all subscribers of a new value.
 * 
 * @todo 通知 vm.$options.data 中某个 key 的所有订阅，有新值，注意更新
 * @todo 每个 响应式 数据的订阅 都是 指令，所以每次给数据 set 新值时都会调用 notify()
 * @todo notify() 会在内部调用所有 订阅(指令的watcher) 的 update() 方法
 * @todo 指令 watcher 的 update() 方法是定义在 Watcher 类中的
 */

Dep.prototype.notify = function () {
  // stablize the subscriber list first
  var subs = this.subs
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update()
  }
}
