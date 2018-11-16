# NativeScript-Vue-Navigator

NativeScript-Vue-Navigator is a simple router implementation that is suitable for NativeScript-Vue. 

## Quick Start

```shell
$ npm install --save nativescript-vue-navigator
```

```diff
// main.js
import Vue from 'nativescript-vue'
...
+import Navigator from 'nativescript-vue-navigator'
+import {routes} from './routes'
+Vue.use(Navigator, { routes })

new Vue({
  - render: h => h('frame', App),
  + render: h => h(App),
}).$start()
```

```js
// routes.js
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'

export const routes = {
  '/home': {
    component: HomePage,
  },
  '/login': {
    component: LoginPage,
  },
}
```

```diff
// App.vue
<template>
+  <Navigator :defaultRoute="isLoggedIn ? '/home' : '/login'"/>
</template>
```

### Attaching extra data to a route

```diff
// routes.js
import HomePage from './components/HomePage'
import LoginPage from './components/LoginPage'

export const routes = {
  '/home': {
    component: HomePage,
+   // we are using `meta` as a good practice, but you are free to use something else
+   meta: { needsAuth: true }
  },
  '/login': {
    component: LoginPage,
+   meta: { needsAuth: false }
  },
}
```

```xml
<!-- anywhere in your templates -->
<Label :text="$navigator.route.meta.needsAuth" />
```
```js
// or in any vue component
export default {
  methods: {
    doStuff() {
      if(this.$navigator.route.meta.needsAuth) {
        // do stuff
      }
    }
  }
}
```
