<template>
  <div class="wrapper" ref="wrapper">
      <div class="content">
        <slot></slot>
      </div>

  </div>
</template>

<script>
    import BScroll from 'better-scroll'
    export default {
        name: "Scroll",
        props: {
            probeType: {
                type: Number,
                default: 0
            },
            pullUpLoad: {
                type:Boolean,
                default: false
            }    
        },
        data() {
            return {
                scroll: null,
                message: '哈哈哈'
            }
        },
        mounted() {
            //1.创建BScroll对象
            this.scroll = new BScroll(this.$refs.wrapper, {
                click:true,
                probeType: this.probeType,
                pullUpLoad: this.pullUpLoad
            })

            //2.监听滚动的位置
            if (this.probeType === 2 || this.probeType === 3) {
                this.scroll.on('scroll',(position) => {
                    // console.log(position);
                    //将滚动的位置发送出去
                    this.$emit('scroll',position)
                })
            }
            
            //3.监听scroll滚动到底部
            if (this.pullUpLoad) {
                this.scroll.on('pullingUp', () => {
                this.$emit('pullingUp')
                // console.log('监听滚到底部');
            })
            }
            
        },
        methods: {
            //自己封装的scrollTo
            scrollTO(x, y, time=500) {
                 this.scroll && this.scroll.scrollTo(x, y, time)
            },
            //自己封装的finishPullUp
            finishPullUp() {
                this.scroll.finishPullUp()
            },
            
            //加载完刷新
            refresh() {
                // console.log('-----')
                this.scroll && this.scroll.refresh()
            },
            //获取滚动条的高度
            getScrollY() {
                return this.scroll ? this.scroll.y : 0
            }
        },
    }
</script>

<style>

</style>