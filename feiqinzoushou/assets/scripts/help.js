var AudioManager = require('AudioManager')

cc.Class({
    extends: cc.Component,

    properties: {
        scroll_target: {
            type: cc.PageView,
            default: null
        },

        // 点精灵组件
        dot_left: {
            type: cc.Sprite,
            default: null
        },
        dot_right: {
            type: cc.Sprite,
            default: null
        },

        // 点纹理
        key_dot_frame: {
            type: cc.SpriteFrame,
            default: null
        },
        unkey_dot_frame: {
            type: cc.SpriteFrame,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    
    on_left_page: function () {
        AudioManager.sfxPlay('btnclick') // sfx
        this.scroll_target.scrollToPage(0, 0.5)
    },

    on_right_page: function () {
        AudioManager.sfxPlay('btnclick') // sfx
        this.scroll_target.scrollToPage(1, 0.5)
    },

    update (dt) {
        var index = this.scroll_target.getCurrentPageIndex()
        if (index == 0) {
            this.dot_left.spriteFrame = this.key_dot_frame
            this.dot_right.spriteFrame = this.unkey_dot_frame
        } else {
            this.dot_left.spriteFrame = this.unkey_dot_frame
            this.dot_right.spriteFrame = this.key_dot_frame
        }
    },
});
