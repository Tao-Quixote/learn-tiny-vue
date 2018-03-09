import dirOn from './directives/on.js'
import dirText from './directives/text.js'
import dirModel from './directives/model.js'

/**
 * @todo 这里使用了大量的尾调用优化
 */

const onRE = /^v-on:|^@/ // 事件绑定正则 v-on: 或者 @
const modelRE = /^v-model/ // v-model 正则
const textRE = /^v-text/ // v-text 正则
const dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/ // v-x 正则，匹配 v- 开头的指令

/**
 * @todo 该方法会遍历 el 上的属性，对 v-x 开头对属性进行专门处理，最后存放到 dirs 数组中
 * @todo 最后返回一个将 el 上 v-x 指令绑定到 dom 上的方法
 * @param {*} el 
 * @param {*} attrs 
 */
export const compileDirectives = function (el, attrs) {
  if (!attrs) return undefined // 无 attrs 不执行，直接返回
  const dirs = []

  let i = attrs.length

  // 遍历属性
  while (i--) {
    const attr = attrs[i]
    const name = attr.name
    const value = attr.value
    let arg = name
    if (name.match(dirAttrRE)) { // 判断是否为 v-x 开头的指令
      if (onRE.test(name)) { // 是否为 v-on: 或者 @ 的指令
        arg = name.replace(onRE, '') // 获取指令的值
				pushDir('on', dirOn) // 设置该指令的定义(实现)
			} else if (modelRE.test(name)) {
        arg = name.replace(modelRE, '')
				pushDir('model', dirModel)
			} else if (textRE.test(name)) {
        arg = name.replace(textRE, '')
				pushDir('text', dirText)
			}
    }

    // 将一个 dom 指令 push 到 dirs 数组中
    function pushDir(dirName, def) {
      dirs.push({
        el: el,
        name: dirName,
        rawName: name,
        def: def,
        arg: arg,
        value: value,
        rawValue: value,
        expression: value
      })
    }
  }
  // 如果有 Vue 指令则返回绑定 指令 到 dom 的方法
  // 返回到 compile 方法中执行
  if (dirs.length) return makeNodeLinkFn(dirs)
}

/**
 * @todo 循环遍历 指令 数组，调用每一个指令的 _bindDir() 方法
 * @todo 将指令绑定到 dom 上
 * @param {Array} directives Array full of directives
 */
function makeNodeLinkFn (directives) {
  return function nodeLinkFn (vm, el) {
    // reverse apply because it's sorted low to high
    var i = directives.length
    while (i--) {
      // vm._bindDir 会调用 this._directives.push(new Directive(descriptor, this, el))
      // 即将指令到实例推到 vm._directives 数组中
      vm._bindDir(directives[i], el)
    }
  }
}

// only for the root element
/**
 * @todo 根据 根挂载点是否有子元素，返回不同的编译方法
 * @param {HTMLDOMElement} el Vue app 的根挂载点
 * @param {Object} options 传入 Vue 类构造函数的参数
 */
export const compile = function (el, options) {
  if (el.hasChildNodes()) { 
    return function (vm, el) {
      // 编译 根挂载点
      const nodeLink = compileNode(el, options)
      // 编译子节点
      const childLink = compileNodeList(el.childNodes, options)
      // 这里到 nodeLink 和 childLink 都是 makeNodeLinkFn 中返回到 nodeLinkFn 方法的引用
      // compileNode() & compileNodeList() 最后都会把每一个 dom 节点上的指令的描述符
      // 放到一个数组中，然后返回一个会遍历指令数组的方法 nodeLinkFn()
      // 最后执行 nodeLinkFn() 时，会调用 this._directives.push(new Directive(descriptor, this, el))
      // 将即将指令到实例推到 vm._directives 数组中
      nodeLink && nodeLink(vm, el)
      childLink && childLink(vm, el)
      // 最后，遍历调用每一个指令的 _bind() 方法，
      // 每个 指令类 中的 bind() 方法负责实现该指令绑定到指定 dom 的功能
      vm._directives.forEach((v) => {
        // 每一个指令的 _bind() 方法是在 directive.js 中实现的
        // vm._directives 数组中存放的是 directive 类的实例
        v._bind()
      })
    }
  } else {
    return function (vm, el) {
      // 编译 el 上的指令
      compileNode(el, options)
      // 遍历调用指令的 _bind() 方法
      vm._directives.forEach((v) => {
        v._bind()
      })
    }
  }
}

/**
 * @todo 循环遍历子节点
 * @todo 这里使用了递归，会一直遍历到最内层的节点
 * 
 * @param {*} nodeList 
 * @param {*} options 
 */
function compileNodeList (nodeList, options) {
  const links = [] // 递归时也使用这个数组存储 directives
  for (var i=0; i<nodeList.length; i++) {
    const el = nodeList[i]
    let link = compileNode(el, options) // 编译子节点
    link && links.push(link)
    if (el.hasChildNodes()) {
      link = compileNodeList(el.childNodes, options) // 编译子节点的子节点
      link && links.push(link)
    }
  }

  return function (vm, el) {
    let i = links.length
    while (i--) {
      links[i](vm, el)
    }
  }
}

/**
 * 
 * @param {HTMLDOMElement} el 根挂载点
 * @param {*} options {
  *  el: '',
  *  vue-router,
  *  vuex,
  *  components: {},
  *  template: '<App/>',
  *  ...
  * }
 */
function compileNode (el, options) {
  // 对单个 dom 元素的属性进行处理，主要用于获取 v-x 指令
  return compileDirectives(el, el.attributes)
}
