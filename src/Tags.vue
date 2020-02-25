<template>
    <div class="tags" :class="{'focus': state}" ref="tags" v-click-outside="hide">
        <div class="tags-input">
            <ul class="tags-actives" :class="{'active': state}">
                <li v-for="(tag,index) of value" @click="(state == true)?removeTag(index):setFocus()" :key="index" class="tag" v-bind:style="{'border-left':'6px ' + stringToColour(tag) + ' solid'}">{{tag}} <span class="fa-wrapp"><i class="fa fa-times"></i></span></li>
                <li class="tag-field">
                    <input v-if="event == 'space'" type="text" placeholder="Especificar etiqueta" tabindex="-1" ref="tagfield" v-model="filtertag" @focus="show" @keyup.space="updateData" >
                    <input v-else type="text" placeholder="Especificar etiqueta" tabindex="-1" ref="tagfield" v-model="filtertag" @focus="show" @keydown.enter.prevent="updateData" >
                </li>
            </ul>
        </div>
        <div v-show="state" class="all-tags">
            <div class="filter-tags">
                <small class="filter-tags__content">Etiquetas existentes (clic para añadir).</small>
                <!-- <input class="filter-tags__input" placeholder="Filtrar" v-model="filter" type="text" name="filter" id="filter"> -->
            </div>
            <hr class="separador">
            <ul class="tags__list">
                <li class="tag" @click="addTag(item.name), filtertag = ''" v-for="(item, index) of all_filtered" :key="index" v-bind:style="{'border-left':'6px ' + stringToColour(item.name) + ' solid'}">{{item.name}} <!--span v-if="item.users" class="badge badge-light badge-pill h-100 ml-1">{{item.users}}</span--> </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
    name: 'VueTags',
    props: {
        all: {
            type: Array,
            required: true,
        },
        value: {
            type: Array,
            required: true,
        },
        event: {
            type: String,
        }
    },
    data(){
        return {
            state: false,
            is_open: false,
            filtertag:'',
            tags: [],
            filter: ''
        }
    },
    computed:{
        all_filtered(){
            return this.all.filter(el => el.name.toUpperCase().indexOf(this.filtertag.toUpperCase()) >= 0)
        }
    },
    methods:{
        updateData(e){
            e.preventDefault();
            if(this.filtertag != ' ' && this.filtertag != ''){
                this.addTag(this.filtertag)
            }
            this.filtertag = ''
            return false;
        },
        removeTag(index){
            this.value.splice(index,1)
        },
        addTag(tag){
            if(this.value.indexOf(tag) == -1){
                this.value.push(tag)
            }
        },
        setFocus(){
            this.$refs.tagfield.focus()
        },
        hide() {
            this.state = false
            this.$emit('close', true)
            this.filtertag = ''
            if(this.is_open){
                this.$emit('change', true)
                this.is_open = false
            }
            console.log('close')
        },
        show() {
            this.state = true
            this.$emit('open', true)
            this.is_open = true
            console.log('open')
        },
        stringToColour(str) {
          var hash = 0;
          for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
          }
          var colour = '#';
          for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
          }
          return colour;
        }
    },
    directives: {
        clickOutside: {
            bind: function (el, binding, vnode) {
                el.clickOutsideEvent = function (event) {
                if (!(el == event.target || el.contains(event.target))) {
                    vnode.context[binding.expression](event);
                }
                };
                document.body.addEventListener('click', el.clickOutsideEvent)
            },
            unbind: function (el) {
                document.body.removeEventListener('click', el.clickOutsideEvent)
            },
        }
    }
}
</script>
<style lang="scss">
.tags{
    position: relative;
    background-color: white;
    border-radius: 5px;
    width: 100%;
    &.focus {
        color: #495057;
        background-color: #fff;
        border-color: #80bdff;
        outline: 0;
        -webkit-box-shadow: 0 0 0 .2rem rgba(0,123,255,.25);
        box-shadow: 0 0 0 .2rem rgba(0,123,255,.25);
        border-radius: 5px;
        transition: all .2s ease;
    }
    .tags-input{
        border: 1px solid #ced4da;
        padding: 10px;
        width: 100%;
        padding: 0;
        border-radius: 5px;
    }
    .tag-field{
        flex: 1 1 60px;
        input{
            width: calc(100% - 5px);
            font-size: 13px;
            padding: 7px 10px;
            border: 0;
            margin-left: 2px;
            font-size: 15px;
        }
    }

    .tags-actives{
        padding: 0;
        li{
            list-style: none;
        }
        display: flex;
        flex-wrap: wrap;
        flex-flow: row wrap;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .all-tags{
        border: 1px solid #ced4da;
        border-top: 0;
        padding: 8px;
        position: absolute;
        z-index: 1000;
        width: 100%;
        background-color: white;

        ul{
            display: flex;
            flex-wrap: wrap;
            flex-flow: row wrap;
            justify-content: flex-start;
            align-items: flex-start;
            padding: 0;
            .tag{
                cursor: pointer;
                user-select: none;
            }
        }
    }
    .tag{
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-start;
        padding: 2px 10px 2px 5px;
        border-radius: 3px;
        margin: 7px 2px 2px 7px;
        background-color: #dedfe4;
        color: rgb(33, 37, 41);
        font-size: 14px;
        line-height: 20px;
    }
    .tags-actives{
        width: 100%;
        margin-bottom: 0;
        &.active{
            .tag{
                cursor: pointer;
                user-select: none;
                input{
                    display: block;
                }
                .fa-wrapp{
                    cursor: pointer;
                    user-select: none;
                    display: inline-block;
                }
            }
        }
    }
}
.tags__list{
    max-height: 50vh;
    overflow: hidden;
    overflow-y: auto;
}
.filters {
    .tag{
        margin: 4px 4px;
    }
    .tags {
        background-color: #f2f2f2;
        .tag-field input{
              height: 32px;
              line-height: 10px;
              font-size: 13px;
              background-color: #f2f2f2;
        }
    }
}
.fa-wrapp{
    display: none;
    height: 1rem;
    margin-left: 5px;
}
.filter-tags{
    display: flex;
    align-items: center;
    justify-content: space-between;
   .filter-tags__input{
        width: 20%;
        font-size: 12px;
        border-radius: 3px;
    }    
}
.separador{
    margin: 5px 0;
}
</style>
