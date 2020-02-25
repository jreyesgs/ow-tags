import Tags from './Tags.vue'

Tags.install = (Vue, options = {}) => {
    if (options.plyr) {
        Tags.props.options.default = () => { return { ...options.plyr } }
    }
    if (options.emit) {
        Tags.props.emit.default = () => { return [...options.emit] }
    }
    Vue.component(Tags.name, Tags)
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(Tags)
}

export default Tags