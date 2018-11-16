export default {
  props: {
    defaultRoute: {
      type: String,
      default: '/',
    },
  },
  render(h) {
    this.slotContent = this.slotContent || h(this.defaultRouteComponent)
    return h(
      'frame',
      {
        on: {loaded: this.onFrameLoaded},
      },
      [this.slotContent]
    )
  },
  created() {
    this.defaultRouteComponent = this.$navigator._resolveComponent(
      this.$props.defaultRoute
    )
  },
  methods: {
    onFrameLoaded({object}) {
      if (object.__defined__custom_currentEntry) {
        // don't try do define the property multiple times
        return
      }
      object.__defined__custom_currentEntry = true

      const self = this
      let _currentEntry = object._currentEntry
      Object.defineProperty(object, '_currentEntry', {
        get() {
          return _currentEntry
        },
        set(value) {
          _currentEntry = value
          if (value && value.resolvedPage) {
            self.$navigator._updatePath(
              value.resolvedPage.__path || value.resolvedPage.path || ''
            )
          }
        },
      })
    },
  },
}
