var Utils = require('Utils')
var AudioManager = require('AudioManager')

cc.Class({
    extends: cc.Component,

    properties: {
        btn_sprites: {
            type: cc.Sprite,
            default: [],
            tooltip: '三小按钮精灵集'
        },
        key_btn_frame: {
            type: cc.SpriteFrame,
            default: null
        },
        non_btn_frame: {
            type: cc.SpriteFrame,
            default: null
        },
        view_msg: {
            type: cc.Node,
            default: [],
            tooltip: '按钮对应的界面集'
        },

        zoo_png_content: {
            type: cc.Node,
            default: null,
            tooltip: '动物小图content'
        },
        zoo_new_prefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '动物小图new框'  
        },
        zoo_png_prefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '动物小图'
        },
        zoo_png_frames: {
            type: cc.SpriteFrame,
            default: [],
            tootip: '动物小图精灵图集'
        },
        foot_lab: {
            type: cc.Label,
            default: null,
            tooltip: '足数量'
        },
        wing_lab: {
            type: cc.Label,
            default: null,
            tooltip: '翅膀数量'
        },
        silv_shark_lab: {
            type: cc.Label,
            default: null,
            tooltip: '银鲨数量'
        },
        gold_shark_lab: {
            type: cc.Label,
            default: null,
            tooltip: '金鲨数量'
        },
        paidui_lab: {
            type: cc.Label,
            default: null,
            tooltip: '派对数量'
        },
        zoo_top_num_content: {
            type:cc.Node,
            default: null,
            tooltip: '动物上面3只动物数量总节点'
        },
        zoo_bottom_num_content: {
            type:cc.Node,
            default: null,
            tooltip: '动物下面8只动物数量总节点'
        },
        species_top_num_content: {
            type: cc.Node,
            default: null,
            tooltip: '种类上面3只动物数量总节点'
        },
        species_bottom_num_content: {
            type: cc.Node,
            default: null,
            tooltip: '种类下面2只动物数量总节点'
        },
        n_while: {
            type: cc.Prefab,
            default: null,
            tooltip: '白色字预制体'
        },
        n_red: {
            type: cc.Prefab,
            default: null,
            tooltip: '红色字预制体'
        },
        n_yellow: {
            type: cc.Prefab,
            default: null,
            tooltip: '黄色字预制体'
        },
        n_green: {
            type: cc.Prefab,
            default: null,
            tooltip: '绿色字预制体'
        },
        zoo_round: {
            type: cc.Node,
            default: null,
            tooltip: '动物项局数'
        },
        species_round: {
            type: cc.Node,
            default: null,
            tooltip: '种类项局数'
        },
        zoo_key_frames: {
            type: cc.SpriteFrame,
            default: [],
            tooltip: '动物Key图集'
        }
        
    },

    onLoad () {
        this.init_key_ui()
        this.on_clean_zoo()
        this.on_clean_species()
        this.on_more_btn_manager('call', '0')
        this.init_round()
    },

    start () {

    },

    init_round: function (inx) {
        var arr = []
        for (var i = 1; i <= 200; i++) {
            arr.unshift(i)
        }
        var round_node = (inx == 1 ? this.zoo_round : this.species_round)
        for (var i in arr) {
            var n_fab = cc.instantiate(this.n_while)
            round_node.addChild(n_fab)
            n_fab.getChildByName('lab').getComponent(cc.Label).string = arr[i] + ''
        }
    },

    init_key_ui: function () {
        this.foot_num = 0
        this.wing_num = 0
        this.silv_shark_num = 0
        this.gold_shark_num = 0
        this.paidui_num = 0
        this.foot_lab.string = '0'
        this.wing_lab.string = '0'
        this.silv_shark_lab.string = '0'
        this.gold_shark_lab.string = '0'
        this.paidui_lab.string = '0'
        this.zoo_png_content.removeAllChildren()
    },

    on_clean_zoo: function () {
        this.zoo_round.removeAllChildren()
        for (var i in this.zoo_top_num_content.children) {
            this.zoo_top_num_content.children[i].removeAllChildren()
        }
        for (var i in this.zoo_bottom_num_content.children) {
            this.zoo_bottom_num_content.children[i].removeAllChildren()
        }
    },

    // 复位种类的表和UI
    on_clean_species: function () {
        this.species_round.removeAllChildren()
        for (var i in this.species_top_num_content.children) {
            this.species_top_num_content.children[i].removeAllChildren()
        }
        for (var i in this.species_bottom_num_content.children) {
            this.species_bottom_num_content.children[i].removeAllChildren()
        }
    },

    // 渲染
    on_more_btn_manager: function (event, index) {
        AudioManager.sfxPlay('btnclick')

        if (!index) {
            return
        }
        for (var i in this.btn_sprites) {
            this.btn_sprites[i].spriteFrame = this.non_btn_frame
        }
        this.btn_sprites[index].spriteFrame = this.key_btn_frame
        for (var i in this.view_msg) {
            this.view_msg[i].active = false
        }
        this.view_msg[index].active = true
        if (index == 0) {
            this.on_zoos_tradition_boardcast()
        } else if (index == 1) {
            this.on_zoos_zoo_boardcast()
        } else {
            this.on_zoos_species_boardcast()
        }
    },

    // 传统记录
    on_zoos_tradition_boardcast: function () {
        pomelo.request('game.betsHandler.log', {number: 200}, function (res) {
            if (res.code === 200) {
                this.init_key_ui()
                cc.log('请求动物记录拿到数据啦O(∩_∩)O', res.msg)
                var png_datas = res.data.roundlist
                cc.log('【更多】【传统】动物记录数组数据: ', png_datas)
                for (var i in png_datas) {
                    var z_prefab = cc.instantiate(this.zoo_png_prefab)
                    this.zoo_png_content.addChild(z_prefab)
                    // var png_i = Utils.on_top_zoo_sprite_index(png_datas[i])
                    var png_i = parseInt(png_datas[i]) - 1
                    z_prefab.getComponent(cc.Sprite).spriteFrame = this.zoo_png_frames[png_i]
                    if (i == 0) {
                        var z_new = cc.instantiate(this.zoo_new_prefab)
                        z_prefab.addChild(z_new)
                        z_new.setPosition(cc.v2(0.5, 6))
                        z_new.setContentSize(cc.size(60, 56))
                    }
                    this.on_species_calculator(png_i)
                    this.on_flesh_species_num()
                }
            } else {
                cc.warn('【更多】【传统】动物记录出错啦O(∩_∩)O~~', res.msg)
            }
        }.bind(this))
    },

    // 动物记录
    on_zoos_zoo_boardcast: function () {
        pomelo.request('game.betsHandler.log', {number: 200}, function (res) {
            if (res.code === 200) {
                cc.log('请求动物记录拿到数据啦O(∩_∩)O', res.msg)
                var png_datas = res.data.roundlist
                cc.log('【更多】【动物】动物记录数组数据: ', png_datas)
                this.on_clean_zoo()
                this.init_round(1)
                var zoo_buf = Utils.deepClone(png_datas)
                var zoo_png_list = Utils.on_return_zoo_recond_list(zoo_buf)
                cc.log('整理后的动物表 【】', zoo_png_list)
                for (var key in zoo_png_list) {
                    var zoo_num_content = null
                    key = parseInt(key)
                    var new_key = key
                    zoo_num_content = (key >= 0 && key <= 2 ? this.zoo_top_num_content : this.zoo_bottom_num_content)
                    var z_array = zoo_png_list[key]
                    var n_buf = (key === 0 ? this.n_red : key === 1 ? this.n_yellow : key === 2 ? this.n_while : this.n_green)
                    key = (key >= 3 ? key - 3 : key)
                    for (var i in z_array) {
                        var n_fab = cc.instantiate(n_buf)
                        zoo_num_content.getChildByName(key + '').addChild(n_fab)
                        if (z_array[i] === 0) {
                            n_fab.getChildByName('lab').active = false
                            n_fab.getChildByName('png').active = true
                            n_fab.getChildByName('png').getComponent(cc.Sprite).spriteFrame = this.zoo_key_frames[new_key]
                        } else {
                            n_fab.getChildByName('lab').active = true
                            n_fab.getChildByName('png').active = false
                            n_fab.getChildByName('lab').getComponent(cc.Label).string = z_array[i]
                        }
                    }
                }
            } else {
                cc.warn('【更多】【动物】动物记录请求出错啦O(∩_∩)O~~', res.msg)
            }
        }.bind(this))
    },

    on_zoos_species_boardcast: function () {
        this.init_round(2)
        pomelo.request('game.betsHandler.log', {number: 200}, function (res) {
            if (res.code === 200) {
                cc.log('请求动物记录拿到数据啦O(∩_∩)O', res.msg)
                var png_datas = res.data.roundlist
                cc.log('【更多】【种类】动物记录数组数据: ', png_datas)
                var png_key_datas = Utils.deepClone(png_datas)
                cc.log('【DATE】', png_key_datas)
                this.on_clean_species() // 先复位
                this.init_round(2) // 刷新局数
                var zoo_buf = Utils.deepClone(png_datas)
                var species_png_list = Utils.on_return_species_record_list(zoo_buf)
                cc.log('整理后的种类表 【】', species_png_list)
                for (var key in species_png_list) {
                    var species_num_content = null
                    key = parseInt(key)
                    var new_key = key
                    species_num_content = (key >= 0 && key <= 2 ? this.species_top_num_content : this.species_bottom_num_content)
                    var s_array = species_png_list[key]
                    var n_buf = (key === 0 ? this.n_red : key === 1 ? this.n_yellow : key === 2 ? this.n_while : this.n_green)
                    key = (key >= 3 ? key - 3 : key)
                    for (var i in s_array) {
                        var n_fab = cc.instantiate(n_buf)
                        species_num_content.getChildByName(key + '').addChild(n_fab)
                        n_fab.getChildByName('lab').getComponent(cc.Label).string = s_array[i]
                        if (s_array[i] === 0) {
                            n_fab.getChildByName('lab').active = false
                            n_fab.getChildByName('png').active = true
                            if (new_key <= 2) {
                                n_fab.getChildByName('png').getComponent(cc.Sprite).spriteFrame = this.zoo_key_frames[new_key]
                            } else {
                                var index = Utils.on_foot_wing_png(png_key_datas[i])
                                n_fab.getChildByName('png').getComponent(cc.Sprite).spriteFrame = this.zoo_key_frames[index]
                            }
                        } else {
                            n_fab.getChildByName('lab').active = true
                            n_fab.getChildByName('png').active = false
                            n_fab.getChildByName('lab').getComponent(cc.Label).string = s_array[i]
                        }
                    }
                }
            } else {
                cc.warn('【更多】【种类】动物记录请求出错啦O(∩_∩)O~~', res.msg)
            }
        }.bind(this))
    },

    on_species_calculator(index) {
        if (index >= 0 && index <= 3) {
            this.wing_num += 1
        } else if (index === 4) {
            this.silv_shark_num += 1
        } else if (index === 5) {
            this.gold_shark_num += 1
        } else if (index >= 6 && index <= 9) {
            this.foot_num += 1
        } else if (index == 10) {
            this.paidui_num += 1
        } else {
            cc.warn('传统统计5个种类时候传的index不在0到10范围呀呀呀~~')
        }
    },
    
    on_flesh_species_num: function () {
        this.foot_lab.string = this.foot_num + ''
        this.wing_lab.string = this.wing_num + ''
        this.silv_shark_lab.string = this.silv_shark_num + ''
        this.gold_shark_lab.string = this.gold_shark_num + ''
        this.paidui_lab.string = this.paidui_num + ''
    },

    update (dt) {},
});
