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
        this.on_type_manager('call', '0')
        this.page = 1
        this.cur_page.string = '1'
        this.total_page.string = '1'
        this.dowork_node.active = false
    },

    // 额度记录type渲染
    on_type_manager: function (event, index) {
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
            AudioManager.sfxPlay('btn')
        }
        
        cc.log('======查询: ', this.type)
        var day_val = 0
        switch (this.type) {
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

                for (var i in lim_logs) { // lim_logs []
                    var lim_log = lim_logs[i]
                    var m_prefab = cc.instantiate(this.limit_prefab)
                    m_prefab.getChildByName('num').getComponent(cc.Label).string = lim_log.id + ''
                    var time = lim_log.create_time
                    var date_str = Utils.on_time_to_string(time)
                    m_prefab.getChildByName('time').getComponent(cc.Label).string = date_str + ''
                    m_prefab.getChildByName('type').getComponent(cc.Label).string = (lim_log.type === 2 ? '投注(飞禽走兽多人版)' : '派彩(飞禽走兽多人版)')
                    m_prefab.getChildByName('pre_money').getComponent(cc.Label).string = lim_log.before_gold + ''
                    if (lim_log.type === 1) {
                        m_prefab.getChildByName('get').getComponent(cc.Label).string = '+' + lim_log.gold
                    } else {
                        m_prefab.getChildByName('post').getComponent(cc.Label).string = lim_log.gold                        
                    }
                    m_prefab.getChildByName('ed_mobey').getComponent(cc.Label).string = lim_log.after_gold + ''
                    this.limit_content.addChild(m_prefab)
                }
                cc.log('==== 总页数: ', res.data.page)
                this.total_page.string = res.data.page + '' // 总页数

            } else {
                cc.warn('**** 额度记录请求后端数据出错啦O(∩_∩)O~~ 请检查一下哦')
            }
        }.bind(this))
    },

    // page_button
    on_page_button: function (event, key) {
        if (!key) {
            return
        }
        AudioManager.sfxPlay('btnclick')
        if (key == '-1') {
            if (this.page === 1) {
                cc.log('==== 已经是首页了哦O(∩_∩)O')
                return
            }
            cc.log('====== 查询上一页')
            this.page --

            cc.log('当前页面是', this.page)
            this.cur_page.string = this.page + ''
            this.on_search(-1)
        } else if (key === '1') {
            if (this.page == parseInt(this.total_page.string)) {
                cc.log('==== 已经是最后一页了哦O(∩_∩)O')
                return
            }
            cc.log('====== 查询下一页')
            this.page ++
            cc.log('当前页面是', this.page)
            this.cur_page.string = this.page + ''
            this.on_search(-1)
        }
    },

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
        if (data == '1') {
            this.init_dowork_pour()
        }
    },

    init_dowork_pour: function() {
        this.on_pour_work_types('call', '0')
    },

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

    on_pour_work_search: function () {
        AudioManager.sfxPlay('btn') // sfx
        cc.log('===== 有效投注查询', this.pour_type)
        if (!false) {
            Utils.on_show_dialog('没有交易记录')
        }
    },

    update (dt) {},
});
