# REAME

**该仓库中 tiny-vue 相关的代码来自 [tiny-vue](https://github.com/lihongxun945/tiny-vue)。源码所有权归原作者所有。**

**该仓库中 `src/videos/` 目录下的视频来自一个培训讲师，在这里对该视频作者以及该讲师表示感谢；如果该视频作者对于这里的使用有任何问题，请联系我: <web.taox@gmail.com>。如果侵犯了作者的权益，请联系我删除视频。**

该仓库的目的是保存自己在阅读源码过程中的心得体会。

在阅读源码的过程中，对于不好理解的地方，使用 <span style="color: red;">@todo</span> 添加了注释。

## 阅读源码顺序

从 `src/vue.js` 文件开始阅读。推荐在阅读源码的过程中配合作者在 [CSDN 博客中的博文](http://blog.csdn.net/lihongxun945/article/category/7259172) 进行阅读；并且推荐配合 `src/videos/` 目录下的视频，以便于更深入的理解。

* 1、从阅读 `src/Vue.js` 文件入手，配合 博文[八小时实现迷你版vuejs之二：vuejs 架构](http://blog.csdn.net/lihongxun945/article/details/78396197)、视频 `./videos/why.mp4`
* 2、博文[八小时实现迷你版vuejs三：实现数据响应化](http://blog.csdn.net/lihongxun945/article/details/78415262)、 `src/state.js`、`./videos/state.mp4` 配合阅读
* 3、`src/observe.js`、`src/dep.js` 配合 `./videos/dep.mp4` 阅读
* 4、`src/compile.js` 主要用于实现解析、生成 Dom 上定义的指令。`src/directive.js` 中实现了 Directive 类的定义以及在原型链上实现了 `_bind` 方法，供外部调用；在调用 `_bind` 方法时会给当前 指令 生成对应的 watcher。解析可参考作者的 [八小时实现迷你版vuejs四：实现compile和Directive](http://blog.csdn.net/lihongxun945/article/details/78489438)。视频 `videos/watcher.mp4`;
* 5、`src/watcher.js` 中实现了 Watcher 类，同时在原型链上实现了 getter/setter、更新指令的 update() 方法以及将自身添加到 Dep 实例中的方法。

Vue.js 文件是整个项目的入口文件，先是定义了 Vue 类；然后在类定义的下面，通过 `state()` 和 `lifecycle()` 两个方法的调用，分别实现了数据的响应式的定义以及 Vue 指令的定义。

Vue 整体项目非常大，我们不需要理解每一个细节，其实 Vue 只做了两件事情：数据更新时如何更新 Dom 以及 Dom 改变时如何更新数据，这两件事情是 Vue 整个项目的基石，理解了这两件事情，就好像是大楼搭好了架子，其他的只是如何装修的问题。

在该项目(tiny-vue)中，先是通过 state.js 中的 `Vue.prototype._proxy()` 方法将用户传入 data  一一绑定到 Vue 实例中；然后通过 Observe.js 中的 defineReactive 方法为 data 中所有的键值对设置 getter/setter，同时使用闭包为每一对 getter/setter 保存了独有的 Dep 实例，用于保存使用了该键值对的指令的 watcher；每次 set 新的值时，都会通过调用 `Dep.prototype.notify()` 提示所有依赖该值的 watcher 更新对应的指令，从而实现了当数据发生变化的时候达到更新视图的目的。

随后，通过 lifecycle() 方法的调用，通过 compile.js 中的 compile 方法，编译了挂载 Vue 的根元素及其自元素上所有的指令；然后在指令的 `_bind` 阶段，根据指令的描述对象生成指令实例保存在 Vue 实例中的 `directives` 数组中；在生成指令实例的过程中，在指令原型上注册了 `Directive.prototype._bind` 方法，该方法用于创建属于该指令自身的 watcher 以及调用对应的功能函数；最后 watcher.js 实现了watcher类以及监听数据变化并调用该指令依赖的数据的 getter/setter 方法，从而实现数据响应的目的。

以上两个步骤使 Vue 中的 数据/视图 自动更新达成了闭环。

在看完整个项目之后，再回来看原作者下面的这张图，对 Vue 实现响应式的原理就更清楚了：

![2](./imgs/2.png)

## LEARNER INFO 🐌

* [GitHub](https://github.com/Tao-Quixote)
* Email: <web.taox@gmail.com>

下面是源仓库中的 README 内容：

## What is this?

[中文版文档](./README.cn.md)

There is several detailed articles show how to write tiny-vue (in Chinese) [Write tiny-vue in 8 hours](http://blog.csdn.net/lihongxun945/article/category/7259172)

A dead simple implement of vuejs, use to learn the source code of vuejs (v1.0.28).
Vuejs source code is very elegant, but it's difficult for beginner to understand. You can try to learn this project, it will be very helpful to understand vuejs.
Most of lifecycle, modular and function name is same to vuejs, but all the code is rewrited (except `dep.js` and very few function implements)

There are two main part:

1. state: reactive state, listen to state's change, State -> Observer -> Dep -> Watcher
2. directive: support directive, you can add your own directives: Compile -> Directive -> directives

You can use it ike this:

```
<div id="a">
	<input v-model="message" />
	<button v-on:click="increase">Increase</button>
	<p v-text="message"></p>
</div>
<script>
	new Vue({
		el: "#a",
		data: {
			message: 1
		},
		methods: {
			increase () {
				this.message += 1
			}
		}
	})
</script>
```

## Supported Features

1. reactive data.
2. interal directives: `v-on:click`, `v-text`, `v-model`
3. two-way data binding
4. more feature is coming

## implements

![1](./imgs/1.png)
![2](./imgs/2.png)
![3](./imgs/3.png)
![4](./imgs/4.png)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
