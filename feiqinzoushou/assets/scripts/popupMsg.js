var AudioManager = require('AudioManager')
var Utils = require('Utils')

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // 弹窗的管理
    pop_up_window_show_hide: function (event, data_box) {
        AudioManager.sfxPlay('btn') // sfx

        // william ******* 功能开放要删除下面 limit record
        // if (data_box == 'record') {
        //     Utils.on_show_dialog('该功能正在维护中...\n敬请期待！')
        //     return
        // }

        this.node.getChildByName(data_box).active = !this.node.getChildByName(data_box).active
    }

    // update (dt) {},
});
