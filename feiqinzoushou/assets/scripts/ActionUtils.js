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
        // this.on_coin_player_to_zoo(true, '8') // 自己投注小动物
        // this.on_coin_player_to_zoo(false, '6') // 玩家共同体人投注小动物
        
        // this.on_coin_player_to_zoo('0', '9') // 玩家队列投注小动物
        // this.on_coin_player_to_zoo('1', '8')

        this.scheduleOnce(function () {
            // this.on_coin_bigzoo_to_player([1, 2, 3], '0', 50)
            // this.on_coin_bigzoo_to_player([4, 5, 6], '1', 50)
            // this.on_coin_bigzoo_to_player([7, 8, 9], '5', 50)

            // this.on_coin_bigzoo_to_player([1, 2, 3], true, 50)
            // this.on_coin_bigzoo_to_player([4, 5, 6], false, 50)
            
            // this.on_coin_bigzoo_to_player('1')
            // this.on_coin_bigzoo_to_player('2')
            // this.on_coin_bigzoo_to_player('3')
            // this.on_coin_bigzoo_to_player('4')
            // this.on_coin_bigzoo_to_player('5')
        }.bind(this), 2)
         
    },

    /**
     * v1+1
     * 玩家下注动物金币播放
     * @param {*} player_index 玩家序号/座位号
     * @param {*} zoo_index 底层动物序号
     */
    on_coin_player_to_zoo: function (player_index, zoo_index) { // 当player_index true:自己 | false:归一玩家
        if (!zoo_index) {
            cc.log('玩家下注动物金币播放传的动物序号参数出错啦~~')
            return
        }
        AudioManager.sfxPlay('coin') // sfx

        // 获取投注玩家节点坐标(相对)
        var p_pos = cc.v2(0, 0)
        if (player_index === true) { // 自己
            p_pos = this.self_play.getPosition()
        } else if (player_index === false) { // 共同玩家
            p_pos = this.other_play.getPosition()
        } else {
            p_pos = this.play_list_node.getChildByName(player_index + '').getPosition()
            // p_pos = p_pos.convertToWorldSpaceAR(0, 0)
        }

        // 获取小动物节点的坐标(相对)
        var z_pos = this.zoo_list_node.getChildByName(zoo_index + '').getPosition()
        // z_pos = z_pos.convertToWorldSpaceAR(0, 0)

        // 一组金币组四个
        var coin_group = []
        // 一起生成四个预制体
        for (var i = 0; i < 4; i++) {
            // 生成金币预制体
            var new_pos = cc.v2(0, 0)
            new_pos.x = p_pos.x - 24
            new_pos.y = p_pos.y - 20
            coin_group[i] = cc.instantiate(this.coin)
            this.node.addChild(coin_group[i])
            coin_group[i].setPosition(new_pos)
        }

        // 初始金币暂停时间
        var d1_time = cc.delayTime(0.04)

        // 金币move
        var coin_group_move = cc.callFunc(function () {
            // 每颗金币间隔时间
            this.c_run_time = 0
            for (var i in coin_group) {
                var action_group = cc.sequence([cc.delayTime(this.c_run_time), cc.moveTo(this.c2z_duration, z_pos).easing(cc.easeOut(3.5))])
                coin_group[i].runAction(action_group)
                this.c_run_time += 0.05
            }
            this.c_run_time = 0
        }.bind(this))

        // time between coin and zoo
        var d2_time = cc.delayTime(this.c2z_duration - 0.2)

        // 小动物move
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

    /**
     * v1+1
     * 开奖金币从大动物飞往获奖玩家
     * @param {*} zooArr 开奖小动物序号数组
     * @param {*} player_index 玩家序号/座位号
     * @param {*} win_coin 派彩赢了多少金币/整型可以是小数
     */
    on_coin_bigzoo_to_player: function (zooArr, player_index, win_coin) { // 当player_index true:自己 | false:归一玩家
        if (zooArr.length == 0) {
            cc.log('开奖金币从大动物飞往玩家传的小动物序号参数出错啦~~')
            return
        }
        
        // 动作一: zoos array background shake
        for (var i in zooArr) {
            var shake_action = cc.repeat(cc.sequence([cc.fadeTo(0.3, 120), cc.fadeOut(0.3)]), 3)
            var num = parseInt(zooArr[i]) - 1 + ''
            var shake_node = this.zoo_list_node.getChildByName(num).getChildByName('shake')
            shake_node.runAction(shake_action)
        }

        if (player_index === null) {
            // 该轮没有玩家赢
            return
        }

        // 获取玩家节点坐标(相对)
        var p_pos = cc.v2(0, 0)
        if (player_index === true) { // 自己获奖
            p_pos = this.self_play.getPosition()
        } else if (player_index === false) { // 别人共同体获奖
            p_pos = this.other_play.getPosition()
        } else {
            p_pos = this.play_list_node.getChildByName(player_index + '').getPosition()
        }

        p_pos.x -= 24
        p_pos.y -= 20
        // 获取大动物中心, 这里用coin_move父节点代替
        var zb_pos = this.node.getPosition()

        // 动作二: 等待小动物背景闪烁完成 0.6 * 3 = 1.8 + 0.2 = 2.0
        var d0_time = cc.delayTime(2.0)

        var coin_group = []

        // 动作三: 一起生成四颗金币
        var coins_init = cc.callFunc(function () {
            for (var i = 0; i < 4; i++) {
                // 生成金币预制体
                coin_group[i] = cc.instantiate(this.coin)
                this.node.addChild(coin_group[i])
                coin_group[i].setPosition(zb_pos)
            }
        }.bind(this))

        // 动作四: 初始完金币停留时间
        var d1_time = cc.delayTime(0.02)

        // 动作五: 金币飞向获奖玩家
        var coin_group_move = cc.callFunc(function () {
            AudioManager.sfxPlay('coin') // sfx

            // 每颗金币间隔时间
            this.c_rerun_time = 0
            for (var i in coin_group) {
                var action_group = cc.sequence([cc.delayTime(this.c_rerun_time), cc.moveTo(this.c2z_duration, p_pos).easing(cc.easeOut(3.5))])
                coin_group[i].runAction(action_group)
                this.c_rerun_time += 0.05
            }
            this.c_rerun_time = 0
        }.bind(this))

        // 动作六： 销毁金币
        this.scheduleOnce(function () {
            for (var i in coin_group) {
                coin_group[i].removeFromParent()
            }
            coin_group = []
        }.bind(this), 3.2)

        // 派彩判断
        if (player_index === false) { // 共同体不派彩
            var re_move = cc.sequence([d0_time, coins_init, d1_time, coin_group_move])
            this.node.runAction(re_move)
        } else { // 自己和序列要派彩
            // 【简单版本要注释掉】 动作七: 准备派彩
            var d2_time = cc.delayTime(0.1)

            // 【简单版本要注释掉】 动作七：派彩
            var pai_fab = null // 广域的派彩节点
            var payout_in = cc.callFunc(function () {
                pai_fab = cc.instantiate(this.payout_prefab)
                this.node.addChild(pai_fab)
                pai_fab.setPosition(p_pos)

                // 玩家获得的金币变量强制设定为整形浮点数
                if (typeof(win_coin) == 'string') {
                    win_coin = parseFloat(win_coin)
                }

                // 派彩随机数字效果
                var s_index = 0
                this.schedule(function () {
                    // 随机赋值一个(0, win_coin) 之间的整数小数
                    if (player_index === true) { // 自己派彩
                        this.self_play.getChildByName('coin').getComponent(cc.Label).string = '+' + parseFloat((Math.random() * win_coin).toFixed(2))
                    } else { // 序列派彩
                        this.play_list_node.getChildByName(player_index + '').getChildByName('coin').getComponent(cc.Label).string = '+' + parseFloat((Math.random() * win_coin).toFixed(2))
                    }
                    if (s_index === 7) {
                        pai_fab.getChildByName('coin').getComponent(cc.Label).string = '+' + parseFloat(win_coin.toFixed(2))
                    }
                    s_index ++
                }, 0.05, 7, 0)

                // 派彩玩家金币效果\
                var lab_money = ''
                if (player_index === true) { // 自己金币效果
                    lab_money = this.self_play.getChildByName('coin').getComponent(cc.Label)
                } else { // 序列金币效果
                    lab_money = this.play_list_node.getChildByName(player_index + '').getChildByName('coin').getComponent(cc.Label)
                }
                var o_mon_str = parseFloat(lab_money.string) // 本金
                var c_index = 0
                this.schedule(function() {
                    // 随机赋值一个(本金, 本金 + win_coin) 之间的整形小数
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

            // 【简单版本要注释掉】 动作八: 派彩停留时间
            var d3_time = cc.delayTime(0.8)

            // 【简单版本要注释掉】 动作九： 派彩淡出和销毁
            var payout_out = cc.callFunc(function () {
                var up2_dir = cc.v2(0, 25)
                var action_out = cc.spawn(cc.moveBy(0.4, up2_dir), cc.fadeOut(0.4))
                pai_fab.runAction(action_out)
                this.scheduleOnce(function () {
                    pai_fab.removeFromParent()
                    pai_fab = null
                }.bind(this), 0.5)
            }.bind(this))

            //【完整版】== 要以下两行
            var re_move = cc.sequence([d0_time, coins_init, d1_time, coin_group_move, d2_time, payout_in, d3_time, payout_out])
            this.node.runAction(re_move)
        } // 自己和序列玩家派彩 | 玩家共同体不派彩

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
        // str
        ptn.getComponent(cc.Label).string = num.toFixed(1)
        // fadeOut
        var fad = cc.fadeOut(3.0).easing(cc.easeIn(3.0))
        ptn.runAction(fad)
        // remove
        if (ptn) {
            this.scheduleOnce(function () {
                ptn.removeFromParent()
            }.bind(this), 3)
        }
    }

})
