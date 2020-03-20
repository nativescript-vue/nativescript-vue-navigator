import Navigator from './components/Navigator'

export default function install(Vue, {routes}) {
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
      defaultPath: '/'
    },
    computed: {
      route() {
        return routes[this.path || this.defaultPath]
      },
    },
    methods: {
      _resolveComponent(defaultPath) {
        if(defaultPath) this.defaultPath = defaultPath

        if (this.route) {
          return this.route.component
        }
        return false
      },
      _updatePath(path, id = 'navigator') {
        if(id === 'navigator') {
          this.path = path
        }
        this.$set(this.paths, id, path)
      },

      navigate(to, options) {
        const matchedRoute = routes[to]

        if (!matchedRoute) {
          if (TNS_ENV === 'development') {
            throw new Error(`Navigating to a route that does not exist: ${to}`)
          }
          return false
        }

        options = Object.assign({ frame: 'navigator' }, options)

        return this.$navigateTo(matchedRoute.component, options)
      },
      back(options, ...args) {
        options = Object.assign({ frame: 'navigator' }, options)
        return this.$navigateBack.call(this, options, ...args)
      }
    },
  })
}
