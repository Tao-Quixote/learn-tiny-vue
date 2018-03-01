import { observe } from './observe.js'

/**
 * @todo 虽然设置将 vm.$options.data 中的键一一设置到了 vm._data 中
 * @todo 但是响应是写在 vm.$options.data 中的
 * @todo Observers、Watchers 也是做在 vm.$options.data 中的
 * 
 * @param {*} Vue Vue 类
 */
export default function (Vue) {
  // 在 Vue 的原型链上写入属性 $data
  Object.defineProperty(Vue.prototype, '$data', {
    get () {
      return this._data
    },
    set (newData) {
      if (newData !== this._data) {
        this._setData(newData)
      }
    }
  })

  Vue.prototype._initState = function () {
    this._initData()
  }

  Vue.prototype._initData = function () {

    /**
     * @todo 单文件组件中，Vue 实例的 data 属性是一个 function
     */
    var dataFn = this.$options.data
    // get function data from Vue.$options.data
    /**
     * data () {
     *  return {
     *    a: 'xx'
     *  }
     * }
     */
    /**
     * @todo 非但文件组件中，dataFn 其实是一个对象
     * @todo 这里的写法兼融了 单文件组件和非单文件组件
     */
    var data = this._data = dataFn ? ( typeof dataFn == 'function' ? dataFn() : dataFn ) : {}

    /**
     * 遍历 data 的属性，设置为 this 的属性，
     * 并且从 this._data 中获取/设置值
     * @todo set setters/getters
     */
    var keys = Object.keys(data)
    var i, key
    i = keys.length
    while (i--) {
      key = keys[i]
      this._proxy(key)
    }
    /**
     * @todo observe data
     * @todo 将 this.$options.data 设置为响应式，并设置 Observers & Watchers
     */
    observe(data, this)
  }

/**
 * @todo set key&val as this's key&val
 * @todo 将 data 中的 key value 设置为 vm 的 key value，并且从 this._data 中获取/设置值
 * 
 * @todo 正是这一步，使得我们可以在 Vue 组件中使用 this.xxx 来调用定义在 data 中的属性
 * @todo 猜测：methods 中的方法应该也是通过类似的方式设置到 Vue 实例上的
 * 
 * @param {*} key 
 */
	Vue.prototype._proxy = function (key) {
		// need to store ref to self here
		// because these getter/setters might
		// be called by child scopes via
		// prototype inheritance.
		var self = this
		Object.defineProperty(self, key, {
			configurable: true,
			enumerable: true,
			get: function proxyGetter () {
				return self._data[key]
			},
			set: function proxySetter (val) {
				self._data[key] = val
			}
		})
  }
}
