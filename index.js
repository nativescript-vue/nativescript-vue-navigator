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
      path: '',
    },
    computed: {
      route() {
        return this._resolveRoute(this.path)
      },
    },
    methods: {
      _resolveRoute(path) {
        return routes[path]
      },
      _resolveComponent(path) {
        const route = this._resolveRoute(path)
        if (route) {
          return route.component
        }
        return false
      },
      _updatePath(path) {
        this.path = path
      },

      navigate(to, options) {
        const matchedRoute = routes[to]

        if (!matchedRoute) {
          if (TNS_ENV === 'development') {
            throw new Error(`Navigating to a route that doesnt exist: ${to}`)
          }
          return false
        }

        this.$navigateTo(matchedRoute.component, options)
      }
    },
  })
}
