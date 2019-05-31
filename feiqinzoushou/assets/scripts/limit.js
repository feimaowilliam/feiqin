var Utils = require('Utils')
var AudioManager = require('AudioManager')

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
        // 有效投注子节点
        dowork_node: {
            type: cc.Node,
            default: null,
            tooltip: '有效投注节点'
        },
        dowork_content: {
            type: cc.Node,
            default: null
        },
        pour_work_types_Nodes: {
            type: cc.Node,
            default: [],
            tooltip: '有效投注子界面按钮组'
        },
        //
        limit_content: {
            type: cc.Node,
            default: null,
            tooltip: '额度content'
        },
        limit_prefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '每条额度预制体'
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
        this.type = '0' // 额度记录的btn type
        this.pour_type = '0' // 有效投注的btn type
    },

    start () {

    },

    onEnable () {
        this.on_refresh()
        // 初始渲染 今天第一
        this.on_type_manager('call', '0')
        // 初始渲染 第一页
        // this.page_edit.string = '0'
        // init
        this.page = 1
        this.cur_page.string = '1' // 当前页
        this.total_page.string = '1' // 总页数
        // 子节点默认关闭
        this.dowork_node.active = false
    },

    // 额度记录type渲染
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
    on_search: function (key) {
        if (key !== -1) {
            AudioManager.sfxPlay('btn') // sfx
        }
        
        cc.log('======查询: ', this.type)
        var day_val = 0
        switch (this.type) { // this.type 0今天 1近三天 2本周
            case '0': day_val = 1; break
            case '1': day_val = 3; break
            case '2': day_val = 7; break
            default: day_val = 1; break
        }
        pomelo.request('game.userHandler.logs', {page: this.page, day: day_val}, function (res) {
            if (res.code === 200) { // 获取成功
                cc.log('**** ', res.msg)
                var lim_logs = res.data.logs
                cc.log('==== 额度记录: ', lim_logs)

                if (Utils.on_list_is_empty(lim_logs) === -1) {
                    // 记录为空
                    Utils.on_show_dialog('没有额度记录')
                    return
                }

                // 清除数据
                this.on_refresh()

                cc.log('XXXXXXXXXXXXXXOOOOOOOOOO', lim_logs)

                for (var i in lim_logs) { // lim_logs []
                    var lim_log = lim_logs[i]
                    // 生成预制体
                    var m_prefab = cc.instantiate(this.limit_prefab)

                    // 查看详情注册回调
                    // this.on_prefab_callback(m_prefab, i)

                    // date
                    // var time = lim_log.create_time
                    // var date_str = Utils.on_time_to_string(time)
                    // m_prefab.getChildByName('date').getComponent(cc.Label).string = date_str + ''

                    // 查询图
                    // if (this.flag === i) {
                    //     m_prefab.getChildByName('btn_detail').getComponent(cc.Sprite).spriteFrame = this.record_detail_down
                    // }

                    // m_prefab.getChildByName('btn_detail').on('click', function () {
                    //     this.flag = i
                    //     cc.log('**** 当前查询是 ==== ', i)
                    //     this.on_search()
                    // }.bind(this))

                    // 订单号 (要在详情才有)
                    m_prefab.getChildByName('num').getComponent(cc.Label).string = lim_log.id + ''

                    // date
                    var time = lim_log.create_time
                    var date_str = Utils.on_time_to_string(time)
                    m_prefab.getChildByName('time').getComponent(cc.Label).string = date_str + ''

                    // 类型
                    m_prefab.getChildByName('type').getComponent(cc.Label).string = (lim_log.type === 2 ? '投注(飞禽走兽多人版)' : '派彩(飞禽走兽多人版)')

                    // 交易前余额
                    m_prefab.getChildByName('pre_money').getComponent(cc.Label).string = lim_log.before_gold + ''

                    if (lim_log.type === 1) { // 加金币
                        // 收入
                        m_prefab.getChildByName('get').getComponent(cc.Label).string = '+' + lim_log.gold
                    } else { // 减金币
                        // 支出
                        m_prefab.getChildByName('post').getComponent(cc.Label).string = lim_log.gold                        
                    }

                    // 交易后金额
                    m_prefab.getChildByName('ed_mobey').getComponent(cc.Label).string = lim_log.after_gold + ''


                    // 总投注
                    // var betSum = lim_log.betSum
                    // m_prefab.getChildByName('pour_total').getComponent(cc.Label).string = betSum + ''

                    // 派彩
                    // var winSum = lim_log.winSum
                    // if (winSum >= 0) {
                    //     winSum = '+' + winSum
                    // }
                    // m_prefab.getChildByName('paicai').getComponent(cc.Label).string = winSum + ''

                    // 有效投注(暂时屏蔽)

                    // 结果
                    // var s_num = lim_log.result_code
                    // s_num --
                    // m_prefab.getChildByName('result').getComponent(cc.Sprite).spriteFrame = this.zoo_frames[s_num]
                    
                    this.limit_content.addChild(m_prefab)

                    /**
                     * 查看详情
                     * lim_log.bets_list 详情数组 (玩法,投注, 派彩)
                     * date_str 日期
                     * lim_log.id 订单号
                     * lim_log.result_code 结果
                     *  */
                    // if (this.flag == i) {
                    //     this.on_search_detail(lim_log.bets_list, date_str, lim_log.round_id, lim_log.result_code)
                    // }
                }

                // 底右页数显示
                // this.on_page_str(res.data.count)
                cc.log('==== 总页数: ', res.data.page)
                this.total_page.string = res.data.page + '' // 总页数

            } else {
                cc.warn('**** 额度记录请求后端数据出错啦O(∩_∩)O~~ 请检查一下哦')
            }
        }.bind(this))
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
            this.on_search(-1) // 不音效-1
        } else if (key === '1') {
            if (this.page == parseInt(this.total_page.string)) {
                cc.log('==== 已经是最后一页了哦O(∩_∩)O')
                return
            }
            cc.log('====== 查询下一页')
            this.page ++
            cc.log('当前页面是', this.page)
            this.cur_page.string = this.page + '' // 刷新当前页数
            this.on_search(-1) // 不音效-1
        }
    },

    // refresh
    on_refresh: function () {
        this.limit_content.removeAllChildren()
    },

    // 开&关 有效投注
    on_open_close_dowork_win: function (event, data) {
        AudioManager.sfxPlay('btn') // sfx
        if (!data) {
            cc.log('====== 有效投注开关操作有误, please checkout than try again')
            return
        }
        this.dowork_node.active = (data == '1' ? true : false)
        if (data == '1') { // 开启有效投注弹框
            this.init_dowork_pour()
        }
    },

    // 初始化有效投注弹窗
    init_dowork_pour: function() {
        // 接后端数据后要有下面这句***********************
        // this.dowork_content.removeAllChildren()
        
        this.on_pour_work_types('call', '0')
    },

    // 子界面有效投注按钮渲染
    on_pour_work_types: function (event, index) {
        if (!index) {
            return
        }
        AudioManager.sfxPlay('btnclick') // sfx
        for (var i in this.pour_work_types_Nodes) {
            this.pour_work_types_Nodes[i].color = this.non_color
        }
        this.pour_work_types_Nodes[index].color = this.key_color
        this.pour_type = index
        cc.log('===== 有效投注的type是; ', this.pour_type)
    },

    // 子界面有效投注查询
    on_pour_work_search: function () {
        AudioManager.sfxPlay('btn') // sfx
        cc.log('===== 有效投注查询', this.pour_type)

        // 没有交易记录下面这个是测试数据***********************
        if (!false) {
            Utils.on_show_dialog('没有交易记录')
        }
    },

    // 有效投注的三个

    update (dt) {},
});
