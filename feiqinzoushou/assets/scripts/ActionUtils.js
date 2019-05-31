var AudioManager = require('AudioManager');

var ActionUtils = cc.Class({
    extends: cc.Component,

    properties: {
        c2z_duration: 0.6, // 金币动画时间 player => zoo
        zoo_duration: 0.5, // 小动物变大变小时间
        coin: {
            type: cc.Prefab,
            default: null,
            tooltip: '金币预制体'
        },
        payout_prefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '派彩效果预制体'
        },
        profit_num: {
            type: cc.Prefab,
            default: null,
            tooltip: '自己大盈金币预制体'
        },
        profit_node: {
            type: cc.Node,
            default: null,
            tooltips: '底层派对时间节点'
        },
        self_play: {
            type: cc.Node,
            default: null,
            tooltip: '自己背景板'
        },
        other_play: {
            type: cc.Node,
            default: null,
            tooltip: '玩家体共同金币板'
        },
        all_other_play: {
            type: cc.Node,
            default: null,
            tooltip: '玩家体共同背景板'
        },
        play_list_node: {
            type: cc.Node,
            default: null,
            tooltip: '玩家列表父节点'
        },
        zoo_list_node: {
            type: cc.Node,
            default: null,
            tooltip: '小动物列表父节点'            
        },
    },

    onLoad () {
        this.scheduleOnce(function () {

        }.bind(this), 2)
         
    },

    on_coin_player_to_zoo: function (player_index, zoo_index) {
        if (!zoo_index) {
            cc.log('玩家下注动物金币播放传的动物序号参数出错啦~~')
            return
        }
        AudioManager.sfxPlay('coin') // sfx

        var p_pos = cc.v2(0, 0)
        if (player_index === true) {
            p_pos = this.self_play.getPosition()
        } else if (player_index === false) {
            p_pos = this.other_play.getPosition()
        } else {
            p_pos = this.play_list_node.getChildByName(player_index + '').getPosition()
        }

        var z_pos = this.zoo_list_node.getChildByName(zoo_index + '').getPosition()

        var coin_group = []
        for (var i = 0; i < 4; i++) {
            var new_pos = cc.v2(0, 0)
            new_pos.x = p_pos.x - 24
            new_pos.y = p_pos.y - 20
            coin_group[i] = cc.instantiate(this.coin)
            this.node.addChild(coin_group[i])
            coin_group[i].setPosition(new_pos)
        }

        var d1_time = cc.delayTime(0.04)
        var coin_group_move = cc.callFunc(function () {
            this.c_run_time = 0
            for (var i in coin_group) {
                var action_group = cc.sequence([cc.delayTime(this.c_run_time), cc.moveTo(this.c2z_duration, z_pos).easing(cc.easeOut(3.5))])
                coin_group[i].runAction(action_group)
                this.c_run_time += 0.05
            }
            this.c_run_time = 0
        }.bind(this))

        var d2_time = cc.delayTime(this.c2z_duration - 0.2)
        var zoo_func = cc.callFunc(function () {
            var mov_scale = cc.sequence([cc.scaleTo(this.zoo_duration, 1.3), cc.scaleTo(this.zoo_duration + 0.2, 1).easing(cc.easeOut(3.5))])
            var zoo_target = this.zoo_list_node.getChildByName(zoo_index + '').getChildByName('zoo')
            zoo_target.runAction(mov_scale)
        }.bind(this))

        var move = cc.sequence([d1_time, coin_group_move, d2_time, zoo_func])
        this.node.runAction(move)

        if (coin_group.length == 0) {
            return
        } else {
            this.scheduleOnce(function () {
                for (var i in coin_group) {
                    coin_group[i].removeFromParent()
                }
                coin_group = []
            }.bind(this), 1.3)
        }
        
    },

    on_coin_bigzoo_to_player: function (zooArr, player_index, win_coin) {
        if (zooArr.length == 0) {
            cc.log('开奖金币从大动物飞往玩家传的小动物序号参数出错啦~~')
            return
        }
        
        for (var i in zooArr) {
            var shake_action = cc.repeat(cc.sequence([cc.fadeTo(0.3, 120), cc.fadeOut(0.3)]), 3)
            var num = parseInt(zooArr[i]) - 1 + ''
            var shake_node = this.zoo_list_node.getChildByName(num).getChildByName('shake')
            shake_node.runAction(shake_action)
        }
        if (player_index === null) {

            return
        }
        var p_pos = cc.v2(0, 0)
        if (player_index === true) {
            p_pos = this.self_play.getPosition()
        } else if (player_index === false) {
            p_pos = this.other_play.getPosition()
        } else {
            p_pos = this.play_list_node.getChildByName(player_index + '').getPosition()
        }

        p_pos.x -= 24
        p_pos.y -= 20
        var zb_pos = this.node.getPosition()
        var d0_time = cc.delayTime(2.0)

        var coin_group = []
        var coins_init = cc.callFunc(function () {
            for (var i = 0; i < 4; i++) {
                // 生成金币预制体
                coin_group[i] = cc.instantiate(this.coin)
                this.node.addChild(coin_group[i])
                coin_group[i].setPosition(zb_pos)
            }
        }.bind(this))
        var d1_time = cc.delayTime(0.02)
        var coin_group_move = cc.callFunc(function () {
            AudioManager.sfxPlay('coin') // sfx
            this.c_rerun_time = 0
            for (var i in coin_group) {
                var action_group = cc.sequence([cc.delayTime(this.c_rerun_time), cc.moveTo(this.c2z_duration, p_pos).easing(cc.easeOut(3.5))])
                coin_group[i].runAction(action_group)
                this.c_rerun_time += 0.05
            }
            this.c_rerun_time = 0
        }.bind(this))
        this.scheduleOnce(function () {
            for (var i in coin_group) {
                coin_group[i].removeFromParent()
            }
            coin_group = []
        }.bind(this), 3.2)
        if (player_index === false) {
            var re_move = cc.sequence([d0_time, coins_init, d1_time, coin_group_move])
            this.node.runAction(re_move)
        } else {
            var d2_time = cc.delayTime(0.1)

            var pai_fab = null
            var payout_in = cc.callFunc(function () {
                pai_fab = cc.instantiate(this.payout_prefab)
                this.node.addChild(pai_fab)
                pai_fab.setPosition(p_pos)
                if (typeof(win_coin) == 'string') {
                    win_coin = parseFloat(win_coin)
                }

                var s_index = 0
                this.schedule(function () {
                    if (player_index === true) {
                        this.self_play.getChildByName('coin').getComponent(cc.Label).string = '+' + parseFloat((Math.random() * win_coin).toFixed(2))
                    } else {
                        this.play_list_node.getChildByName(player_index + '').getChildByName('coin').getComponent(cc.Label).string = '+' + parseFloat((Math.random() * win_coin).toFixed(2))
                    }
                    if (s_index === 7) {
                        pai_fab.getChildByName('coin').getComponent(cc.Label).string = '+' + parseFloat(win_coin.toFixed(2))
                    }
                    s_index ++
                }, 0.05, 7, 0)
                var lab_money = ''
                if (player_index === true) {
                    lab_money = this.self_play.getChildByName('coin').getComponent(cc.Label)
                } else {
                    lab_money = this.play_list_node.getChildByName(player_index + '').getChildByName('coin').getComponent(cc.Label)
                }
                var o_mon_str = parseFloat(lab_money.string)
                var c_index = 0
                this.schedule(function() {
                    lab_money.string = parseFloat((o_mon_str + Math.random() * win_coin).toFixed(2)) + ''
                    if (c_index === 7) {
                        lab_money.string = parseFloat((o_mon_str + win_coin).toFixed(2)) + ''
                    }
                    c_index ++
                }, 0.05, 7, 0)

                pai_fab.opacity = 0
                var up1_dir = cc.v2(0, 15)
                var action_in = cc.spawn(cc.moveBy(0.4, up1_dir), cc.fadeIn(0.4))
                pai_fab.runAction(action_in)
            }.bind(this))
            var d3_time = cc.delayTime(0.8)
            var payout_out = cc.callFunc(function () {
                var up2_dir = cc.v2(0, 25)
                var action_out = cc.spawn(cc.moveBy(0.4, up2_dir), cc.fadeOut(0.4))
                pai_fab.runAction(action_out)
                this.scheduleOnce(function () {
                    pai_fab.removeFromParent()
                    pai_fab = null
                }.bind(this), 0.5)
            }.bind(this))

            var re_move = cc.sequence([d0_time, coins_init, d1_time, coin_group_move, d2_time, payout_in, d3_time, payout_out])
            this.node.runAction(re_move)
        }

        //【简易版】== 要下面两行
        // var re_move = cc.sequence([d0_time, coins_init, d1_time, coin_group_move])
        // this.node.runAction(re_move)
    },

    // 当前玩家返利大显示
    on_show_profit_num: function (num) {
        if (num === 0) {
            return
        }
        var ptn = cc.instantiate(this.profit_num)
        this.profit_node.addChild(ptn)
        ptn.setPosition(0, 118)
        ptn.getComponent(cc.Label).string = num.toFixed(1)
        var fad = cc.fadeOut(3.0).easing(cc.easeIn(3.0))
        ptn.runAction(fad)
        if (ptn) {
            this.scheduleOnce(function () {
                ptn.removeFromParent()
            }.bind(this), 3)
        }
    }

})
