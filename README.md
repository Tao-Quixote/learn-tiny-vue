# REAME

**该仓库中 tiny-vue 相关的代码来自 [tiny-vue](https://github.com/lihongxun945/tiny-vue)。源码所有权归原作者所有。**

**该仓库中 `src/videos/` 目录下的视频来自一个培训讲师，在这里对该视频作者以及该讲师表示感谢；如果该视频作者对于这里的使用有任何问题，请联系我: <web.taox@gmail.com>。如果侵犯了作者的权益，请联系我删除视频。**

该仓库的目的是保存自己在阅读源码过程中的心得体会。

在阅读源码的过程中，对于不好理解的地方，使用 <span style="color: red;">@todo</span> 添加了注释。

## 阅读源码顺序

从 `src/vue.js` 文件开始阅读。推荐在阅读源码的过程中配合作者在 [CSDN 博客中的博文](http://blog.csdn.net/lihongxun945/article/category/7259172) 进行阅读；并且推荐配合 `src/videos/` 目录下的视频，以便于更深入的理解。

* 1、从阅读 `src/Vue.js` 文件入手，配合 博文[八小时实现迷你版vuejs之二：vuejs 架构](http://blog.csdn.net/lihongxun945/article/details/78396197)、视频 `src/videos/why.mp4`
* 2、博文[八小时实现迷你版vuejs三：实现数据响应化](http://blog.csdn.net/lihongxun945/article/details/78415262)、 `src/state.js`、`src/videos/state.mp4` 配合阅读
* 3、`src/observe.js`、`src/dep.js` 配合 `src/videos/dep.mp4` 阅读
* 未完...

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
