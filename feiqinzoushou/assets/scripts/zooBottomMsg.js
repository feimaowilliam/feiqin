var Game = require('Game')
var Utils = require('Utils')
var ActionUtils = require('ActionUtils')
var AudioManager = require('AudioManager');

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
        self_coin: {
            type: cc.Label,
            default: null,
            tooltip: '自己实时金币数'
        },
        game_script: {
            type: Game,
            default: null
        },
        ActionComponent: {
            type: ActionUtils,
            default: null,
            tooltip: '金币动画组件'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {

    },

    // 点击底部小动物图回调函数
    zoo_list_event_callback: function (event, z_index) {
        if (conf.state === 2) {// 游戏状态 1:下注阶段 2.开奖展示阶段
            // 开奖阶段
            cc.warn('O(∩_∩)O啊呀呀, 已经开奖了, 下一轮吧~~~')
            return
        }

        AudioManager.sfxPlay('btnclick') // sfx

        if (!z_index) {
            cc.log('点底层的小动物序号出错啦')
            return
        }
        cc.log('点击了O(∩_∩)O底层小动物序号:', z_index)

        //  渲染每只小动物的下注额
        var zoo_pour_com = this.node.getChildByName(z_index + '').getChildByName('tag_num').getChildByName('num').getComponent(cc.Label)
        var num = parseInt(zoo_pour_com.string)
        num += parseInt(conf.pour_key)
        zoo_pour_com.string = num + ''

        // 往投注列表加数据
        var index = (parseInt(z_index) + 1) + ''
        conf.pour_zoo_list[index] = num
        // conf.pour_zoo_list[(parseInt(z_index) + 1) + ''] = num

        // 总下注 => 调用game脚本渲染总下注牌子
        conf.total_pour += parseInt(conf.pour_key)
        this.game_script.on_fresh_total_pour(1) // 1渲染 2归零
    },

    // 发送投注列表
    on_send_pour_list: function () {
        if (conf.total_pour === 0) { // 投注为空
            cc.warn('客官不能空投注哦, 请选择有效的投注方式哦')
            Utils.on_show_dialog('未选中有效的下注动物')
            // this.on_clean_pour_list()
            return
        }
        if (Utils.on_list_num_is_zero(conf.pour_zoo_list) === -1) { // 没有选小动物所有num是0, 会返回-1
            cc.warn('O(∩_∩)O啊啊啊, 还没选择小动物投注呢~~~')
            // this.on_clean_pour_list()
            return
        }
        if (conf.self_coin - conf.total_pour < 0) {
            cc.warn('O(∩_∩)O啊啊啊, 余额不够你得充值了~~~')
            // this.on_clean_pour_list()
            return
        }
        // 【cto】玩家选择动物进行下注请求
        pomelo.request('game.betsHandler.in', conf.pour_zoo_list, function (res) {
            if (res.code !== 200) {
                Utils.on_show_dialog(res.msg)
                cc.warn(' **** 玩家选择动物进行下注请求game.betsHandler.in返回code出错啦,请看大大框 ', res.code)
                return
            }
            cc.log(' ==== pour_zoo_list：', conf.pour_zoo_list)
            // 下注成功
            // 自己下注小动物数据
            conf.pour_zoo_down = Utils.on_list_add_num(conf.pour_zoo_down, conf.pour_zoo_list)
            // 自己总投注数据同步
            conf.total_down = conf.total_pour

            for (var i in conf.pour_zoo_list) {
                if (conf.pour_zoo_list[i] !== 0) {
                    this.ActionComponent.on_coin_player_to_zoo(true, (parseInt(i) - 1) + '') // 自己投注小动物
                }
            }

            // 所有玩家小动物列表和UI渲染
            for (var i in conf.total_pour_zoo_list) {
                // 列表
                var t_num = parseInt(conf.total_pour_zoo_list[i])
                var c_num = parseInt(conf.pour_zoo_list[i])
                t_num += c_num
                conf.total_pour_zoo_list[i] = t_num
                // UI
                var index = parseInt(i) - 1 + ''
                this.node.children[index].getChildByName('bet').getChildByName('num').getComponent(cc.Label).string = t_num + ''
            }

            // 返回用户金币
            conf.self_coin -= res.data.gold
            this.self_coin.string = conf.self_coin
            // 自己小动物投注列表数据复位
            conf.pour_zoo_list = Utils.deepClone(conf.pour_zoo_list_init)

            // 小动物，总投注牌，自己投注列表归零
            // this.on_clean_pour_list()
        }.bind(this))
    },

    // 渲染自己每只小动物下注UI
    reflash_zoo_list_ui: function () {
        for (var i in this.node.children) {
            var z_node = this.node.children[i]
            var key = (parseInt(i) + 1) + ''
            z_node.getChildByName('tag_num').getChildByName('num').getComponent(cc.Label).string = conf.pour_zoo_down[key] + ''
        }
    },

    // 小动物，总投注，投注列表归零
    on_clean_pour_list: function () {
        // 小动物num归零
        for (var i in this.node.children) {
            this.node.children[i].getChildByName('tag_num').getChildByName('num').getComponent(cc.Label).string = '0'
        }
        // 总投注归零
        this.game_script.on_fresh_total_pour(-1) // 1加上去 -1 归零
        // 投注列表复位, 真实投注复位
        conf.pour_zoo_list = Utils.deepClone(conf.pour_zoo_list_init)
        conf.pour_zoo_down = Utils.deepClone(conf.pour_zoo_list_init)
    },

    // 所有玩家小动物, 所有玩家投注列表归零
    on_clean_total_pour_list: function () {
        // 所有玩家小动物UI归零
        for (var i in this.node.children) {
            this.node.children[i].getChildByName('bet').getChildByName('num').getComponent(cc.Label).string = '0'
        }
        // 所有玩家小动物列表归零
        conf.total_pour_zoo_list = Utils.deepClone(conf.total_pour_zoo_list_init)
        cc.log('所有玩家小动物表;', conf.total_pour_zoo_list)
    }

    // update (dt) {},
});
