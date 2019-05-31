var AudioManager = require('AudioManager')
var Utils = require('Utils')

cc.Class({
    extends: cc.Component,

    properties: {
        btn_types_Nodes: {
            type: cc.Node,
            default: [],
            tooltip: 'types按钮node组'
        },
        key_color: new cc.Color(255, 186, 65, 255),
        non_color: new cc.Color(255, 255, 255, 255),
        page_edit: {
            type: cc.EditBox,
            default: null
        },
        zoo_frames: {
            type: cc.SpriteFrame,
            default: [],
            tooltip: '动物图集'
        },
        zoo_result_frames: { // 不要飞禽和走兽
            type: cc.SpriteFrame,
            default: [],
            tooltip: '结果项动物图集'
        },
        record_content: {
            type: cc.Node,
            default: null,
            tooltip: '记录content'
        },
        record_prefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '每条记录预制体'
        },
        record_detail_prefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '每条详情预制体'  
        },
        record_detail_down: {
            type: cc.SpriteFrame,
            default: null,
            tooltip: '详情下拉按钮小图'
        },
        cur_page: {
            type: cc.Label,
            default: null,
            tooltip: '当前页数'
        },
        total_page: {
            type: cc.Label,
            default: null,
            tooltip: '总页数'
        }

    },

    onLoad () {
        this.on_refresh()
        this.type = '0' // 今天 3天内 本周
        this.flag = null // 查看详情标志位 初始化为null
    },

    start () {

    },

    onEnable () {
        this.flag = null // 查看详情标志位 初始化为null
        this.on_refresh()
        // 初始渲染 今天第一
        this.on_type_manager('call', '0')
        // // 初始渲染 第一页
        // this.page_edit.string = '1'
        
        // init
        this.page = 1
        this.cur_page.string = '1' // 当前页
        this.total_page.string = '1' // 总页数
    },

    // 下注记录type渲染
    on_type_manager: function (event, index) { // 0今天 1近三天 2本周
        if (!index) {
            return
        }
        if (event.type == 'touchend') {
            AudioManager.sfxPlay('btnclick') // sfx
        }
        // 渲染按钮types
        for (var i in this.btn_types_Nodes) {
            this.btn_types_Nodes[i].color = this.non_color
        }
        this.btn_types_Nodes[index].color = this.key_color

        // 存组件key
        this.type = index
        console.log('type是: ', this.type)

    },

    // 查询
    on_search: function () {
        AudioManager.sfxPlay('btn') // sfx
        cc.log('====== 查询: ', this.type)
        var day_val = 0
        switch (this.type) { // this.type 0今天 1近三天 2本周
            case '0': day_val = 1; break
            case '1': day_val = 3; break
            case '2': day_val = 7; break
            default: day_val = 1; break
        }
        cc.log(' ==== 下注记录 day_val: ', day_val)
        pomelo.request('game.betsHandler.betsLog', {page: this.page, day: day_val}, function (res) {
            if (res.code === 200) { // 获取成功
                cc.log('**** ', res.msg)
                var bet_logs = res.data.betsLogs
                cc.log('==== 下注记录: ', bet_logs)

                if (Utils.on_list_is_empty(bet_logs) === -1) {
                    // 记录为空
                    Utils.on_show_dialog('没有下注记录')
                    return
                }

                // 清除数据
                this.on_refresh()

                for (var i in bet_logs) { // bet_logs []
                    var bet_log = bet_logs[i]
                    // 生成预制体
                    var r_prefab = cc.instantiate(this.record_prefab)

                    // 查看详情注册回调
                    this.on_prefab_callback(r_prefab, i)

                    // data
                    var time = bet_log.create_time
                    var date_str = Utils.on_time_to_string(time)
                    r_prefab.getChildByName('date').getComponent(cc.Label).string = date_str + ''

                    // 查询图
                    if (this.flag === i) {
                        r_prefab.getChildByName('btn_detail').getComponent(cc.Sprite).spriteFrame = this.record_detail_down
                    }

                    // r_prefab.getChildByName('btn_detail').on('click', function () {
                    //     this.flag = i
                    //     cc.log('**** 当前查询是 ==== ', i)
                    //     this.on_search()
                    // }.bind(this))

                    // 订单号 (要在详情才有)
                    // r_prefab.getChildByName('num').getComponent(cc.Label).string = bet_log.id + ''

                    // 玩法 (要在详情才有)

                    // 总投注
                    var betSum = bet_log.betSum
                    // if (betSum >= 0) {
                    //     betSum = '+' + betSum
                    // }
                    r_prefab.getChildByName('pour_total').getComponent(cc.Label).string = betSum + ''

                    // 派彩
                    var winSum = bet_log.winSum
                    if (winSum >= 0) {
                        winSum = '+' + winSum
                    }
                    r_prefab.getChildByName('paicai').getComponent(cc.Label).string = winSum + ''

                    // 有效投注(暂时屏蔽)

                    // 结果
                    var s_num = bet_log.result_code
                    s_num --
                    console.log('【【【【【', s_num)
                    r_prefab.getChildByName('result').getComponent(cc.Sprite).spriteFrame = this.zoo_result_frames[s_num]
                    
                    this.record_content.addChild(r_prefab)

                    /**
                     * 查看详情
                     * bet_log.bets_list 详情数组 (玩法,投注, 派彩)
                     * date_str 日期
                     * bet_log.id 订单号
                     * bet_log.result_code 结果
                     *  */
                    if (this.flag == i) {
                        this.on_search_detail(bet_log.bets_list, date_str, bet_log.round_id, bet_log.result_code)
                    }
                }

                // 底右页数显示
                // this.on_page_str(res.data.count)
                cc.log('==== 总页数: ', res.data.page)
                this.total_page.string = res.data.page + '' // 总页数

            } else {
                cc.warn('**** 下注记录请求后端数据出错啦O(∩_∩)O~~ 请检查一下哦')
            }
        }.bind(this))
    },

    // 查看详情注册回调
    on_prefab_callback: function (r_prefab, i) {
        r_prefab.getChildByName('btn_detail').on('click', function () {
            cc.log(' **** ', i)
            if (this.flag === i) {
                this.flag = null
            } else {
                this.flag = i
            }
            this.on_search()
        }, this)
    },

    /**
     * 每项详情查询
     * bets_list 详情数组 (玩法,投注, 派彩)
     * date_str 日期
     * odd_num 订单号
     * result_code 结果
     *  */
    on_search_detail: function (bets_list, date_str, odd_num, result_code) {
        for (var key in bets_list) { // bets_list 是{}
            var b_list = bets_list[key]
            var d_prefab = cc.instantiate(this.record_detail_prefab)
            // 日期
            d_prefab.getChildByName('date').getComponent(cc.Label).string = date_str + ''
            // 订单号
            d_prefab.getChildByName('num').getComponent(cc.Label).string = odd_num + ''
            // 玩法
            var i = parseInt(key) - 1
            d_prefab.getChildByName('play_rule').getComponent(cc.Sprite).spriteFrame = this.zoo_frames[i]
            // 投注
            d_prefab.getChildByName('pour_total').getComponent(cc.Label).string = b_list['number'] + ''
            // 派彩
            var win = b_list['win']
            if (win >= 0) {
                win = '+' + win
            }
            d_prefab.getChildByName('paicai').getComponent(cc.Label).string = win + ''
            // 结果
            var r_num = result_code - 1
            d_prefab.getChildByName('result').getComponent(cc.Sprite).spriteFrame = this.zoo_result_frames[r_num]
            this.record_content.addChild(d_prefab)
        }
    },

    // 页数显示
    on_page_str: function (count) {
        var n = parseInt(count / 10) // 基数
        var r = count % 10 // 余数
        if (r > 0) {
            n ++
        }
        if (n === 0 && r === 0) {
            this.page = 1
            this.cur_page.string = '1' // 当前页
            this.total_page.string = '1' // 总页数
        } else {
            this.cur_page.string = this.page + '' // 当前页
            this.total_page.string = n + '' // 总页数
        }
    },

    // page_button
    on_page_button: function (event, key) { // key: -1上一页   1下一页
        if (!key) {
            return
        }
        AudioManager.sfxPlay('btnclick') // sfx
        if (key == '-1') {
            if (this.page === 1) {
                cc.log('==== 已经是首页了哦O(∩_∩)O')
                return
            }
            cc.log('====== 查询上一页')
            this.page --

            cc.log('当前页面是', this.page)
            this.cur_page.string = this.page + '' // 刷新当前页数
            this.on_search()
        } else if (key === '1') {
            if (this.page == parseInt(this.total_page.string)) {
                cc.log('==== 已经是最后一页了哦O(∩_∩)O')
                return
            }
            cc.log('====== 查询下一页')
            this.page ++
            cc.log('当前页面是', this.page)
            this.cur_page.string = this.page + '' // 刷新当前页数
            this.on_search()
        }
    },

    // test
    // tt: function () {
    //     // test
    //     var t_node = cc.instantiate(this.record_prefab)
    //     // t_node.getChildByName('date').getComponent(cc.Label).string = 'BBOO'
    //     this.record_content.children.splice(2, 0, t_node)
    //     t_node._parent = this.record_content

    //     console.log('info:', this.record_content)
    // },

    onDisable: function () {
        this.flag = null
    },

    // refresh
    on_refresh: function () {
        this.record_content.removeAllChildren()
    },

    update (dt) {},
});
