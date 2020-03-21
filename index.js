import Navigator from './components/Navigator'

export default function install(Vue, {routes}) {
  let appRoot;
  const start = Vue.prototype.$start
  Vue.prototype.$start = function () {
    appRoot = this
    start.call(this)
  }
  Vue.component('Navigator', Navigator)

  Object.keys(routes).map(path => {
    routes[path].component.__path = path
  })

  Vue.mixin({
    mounted() {
      // attach the current path if set to the root element
      if (this.$options.__path) {
        this.$el.setAttribute('__path', this.$options.__path)
      }
    },
  })

  Vue.prototype.$navigator = new Vue({
    data: {
      path: false,
      paths: {},
      defaultPaths: {},
    },
    computed: {
      route() {
        return this.routes('navigator')
      },
      routes() {
        return id => routes[this.paths[id] || this.defaultPaths[id]]
      },
    },
    methods: {
      _resolveComponent(defaultPath, id) {
        if (defaultPath) {
          this.$set(this.defaultPaths, id, defaultPath)
        }

        if (this.routes(id)) {
          return this.routes(id).component
        }
        return false
      },
      _updatePath(path, id = 'navigator') {
        if (id === 'navigator') {
          this.path = path
        }
        this.$set(this.paths, id, path)
      },

      navigate(to, options) {
        const matchedRoute = routes[to]

        if (!matchedRoute) {
          if (TNS_ENV === 'development') {
            throw new Error(`[Navigator] Navigating to a route that does not exist: ${to}`)
          }
          return false
        }

        options = Object.assign({frame: 'navigator'}, options)

        return this.$navigateTo(matchedRoute.component, options)
          .catch(err => console.log(`[Navigator] Failed to navigate: ${err}`))
      },
      back(options, ...args) {
        options = Object.assign({frame: 'navigator'}, options)
        return this.$navigateBack.call(this, options, ...args)
      },
      modal(to, options) {
        return appRoot.$showModal({
          render: h => h(Navigator, {
            props: {
              id: options.id || 'navigatorModal',
              defaultRoute: to
            }
          })
        }, options).catch(err => console.log(`[Navigator] Failed to show modal: ${err}`))
      }
    },
  })
}
