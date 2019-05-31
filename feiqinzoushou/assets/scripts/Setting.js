var Utils = require('Utils')
var Game = require('Game')
var AudioManager = require('AudioManager')

cc.Class({
    extends: cc.Component,

    properties: {
        // box
        music_box: {
            type: cc.Sprite,
            default: null
        },
        sfx_box: {
            type: cc.Sprite,
            default: null
        },
        broadcast_box: {
            type: cc.Sprite,
            default: null
        },

        // open_close
        box_open_frame: {
            type: cc.SpriteFrame,
            default: null
        },
        box_close_frame: {
            type: cc.SpriteFrame,
            default: null
        },

        // slider
        music_slider: {
            type: cc.Slider,
            default: null
        },
        sfx_slider: {
            type: cc.Slider,
            default: null
        },

        // progress
        music_progress: {
            type: cc.ProgressBar,
            default: null
        },
        sfx_progress: {
            type: cc.ProgressBar,
            default: null,
        },

        // progress bar sp
        music_bar_sp: {
            type: cc.Node,
            default: null
        },
        sfx_bar_sp: {
            type: cc.Node,
            default: null
        },

        // music & sfx splash
        music_splash: cc.Node,
        sfx_splash: cc.Node,

        // counter筹码
        counter_node: cc.Node,
        pour_no: cc.SpriteFrame,
        pour_yes: cc.SpriteFrame,

        // Game脚本组件、
        game_scene_counter: {
            type: Game,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    onEnable () {
        // 定义
        this.music_is_tak = conf.music_is_tak
        this.sfx_is_tak = conf.sfx_is_tak
        this.music_volume = conf.music_volume
        this.sfx_volume = conf.sfx_volume
        this.broadcast_is_tak = conf.broadcast_is_tak
        this.counter_data = Utils.deepClone(conf.counter_data)
        // 初始化
        this.init()
    },

    start () {

    },

    // 初始化
    init: function () {
        // music
        var sp_frame = (this.music_is_tak == true ? this.box_open_frame : this.box_close_frame)
        this.music_box.spriteFrame = sp_frame
        var m_volume = 0.8
        if (conf.music_volume !== undefined || conf.music_volume !== null || conf.music_volume !== '') {
            m_volume = conf.music_volume
        }
        this.music_slider.progress = m_volume
        this.music_progress.progress = m_volume
        // music bar sp
        this.music_bar_sp.active = this.music_is_tak
        // splash init
        this.music_splash.active = (this.music_is_tak == false ? true : false)

        // sfx
        var sp_frame = (this.sfx_is_tak == true ? this.box_open_frame : this.box_close_frame)
        this.sfx_box.spriteFrame = sp_frame
        var x_volume = 0.8
        if (conf.sfx_volume !== undefined || conf.sfx_volume !== null || conf.sfx_volume !== '') {
            x_volume = conf.sfx_volume
        }
        this.sfx_slider.progress = x_volume
        this.sfx_progress.progress = x_volume
        // sfx bar sp
        this.sfx_bar_sp.active = this.sfx_is_tak
        // splash init
        this.sfx_splash.active = (this.sfx_is_tak == false ? true : false)

        // broadcast tak
        var sp_frame = (this.broadcast_is_tak == true ? this.box_open_frame : this.box_close_frame)
        this.broadcast_box.spriteFrame = sp_frame

        // counter
        this.on_counter_init()
    },

    // music box manager
    on_music_manager: function () {
        AudioManager.sfxPlay('btnclick') // sfx

        var sp_frame = (this.music_is_tak == true ? this.box_close_frame : this.box_open_frame)
        this.music_box.spriteFrame = sp_frame
        this.music_is_tak = !this.music_is_tak

        // set mute
        var volume = (this.music_is_tak == false ? 0 : this.music_volume)
        cc.audioEngine.setVolume(conf.bgmID, volume)

        // music bar sp
        this.music_bar_sp.active = this.music_is_tak
        // splash
        this.music_splash.active = (this.music_is_tak == false ? true : false)
    },

    // sfx box manager
    on_sfx_manager: function () {
        AudioManager.sfxPlay('btnclick') // sfx

        var sp_frame = (this.sfx_is_tak == true ? this.box_close_frame : this.box_open_frame)
        this.sfx_box.spriteFrame = sp_frame
        this.sfx_is_tak = !this.sfx_is_tak

        // set mute
        if (this.sfx_is_tak == false) {
            // this.sfx_volume = 0
        } else {
            this.sfx_volume = this.sfx_progress.progress;
        }
        
        // sfx bar sp
        this.sfx_bar_sp.active = this.sfx_is_tak
        // splash
        this.sfx_splash.active = (this.sfx_is_tak == false ? true : false)
    },

    // music slider
    on_music_slider_event: function (sender, eventType) {
        this.music_progress.progress = sender.progress
        this.music_volume = sender.progress
        cc.audioEngine.setVolume(conf.bgmID, sender.progress)
    },

    // sfx slider
    on_sfx_slider_event: function (sender, eventType) {
        this.sfx_progress.progress = sender.progress
        this.sfx_volume = sender.progress
        
    },

    // broadcast manager
    on_broadcat_manager: function () {
        AudioManager.sfxPlay('btnclick') // sfx
        var sp_frame = (this.broadcast_is_tak == true ? this.box_close_frame : this.box_open_frame)
        this.broadcast_box.spriteFrame = sp_frame
        this.broadcast_is_tak = !this.broadcast_is_tak
    },

    // 筹码初始化
    on_counter_init: function () {
        for (var i in this.counter_node.children) {
            this.counter_node.children[i].getComponent(cc.Sprite).spriteFrame = this.pour_no
        }
        for (var i in this.counter_data) {
            this.counter_node.getChildByName(this.counter_data[i] + '').getComponent(cc.Sprite).spriteFrame = this.pour_yes
        }
    },

    // 筹码管理
    on_counter_set: function (event, data) {
        AudioManager.sfxPlay('btnclick') // sfx

        var data = parseInt(data)
        if (this.counter_data.indexOf(data) != -1) { // 筹码库有了
            var index = this.counter_data.indexOf(data)
            cc.log('*******index', index)
            this.counter_data.splice(index, 1)
            this.counter_node.getChildByName(data + '').getComponent(cc.Sprite).spriteFrame = this.pour_no
            //=========
            cc.log('//=========', this.counter_data)
            return
        }
        // 筹码库没有 判断筹码库是否已经满6个
        if (this.counter_data.length >= 6) {
            cc.log('筹码数组已经满6个啦')
            return
        }
        // 往筹码库加选择筹码
        this.counter_data.push(data)
        this.counter_node.getChildByName(data + '').getComponent(cc.Sprite).spriteFrame = this.pour_yes
        //=========
        cc.log('//=========', this.counter_data)
    },

    // 确定
    on_comfirm: function () {
        AudioManager.sfxPlay('btn') // sfx

        if (this.counter_data.length != 6) {
            Utils.on_show_dialog('请选择6个筹码')
            cc.log('请选择6个筹码啦啦~~')
            return
        }
        conf.music_is_tak = this.music_is_tak
        conf.sfx_is_tak = this.sfx_is_tak;
        conf.music_volume = this.music_volume;
        conf.sfx_volume = this.sfx_volume;
        conf.broadcast_is_tak = this.broadcast_is_tak;
        conf.counter_data = Utils.on_sort_rank(this.counter_data)
        cc.sys.localStorage.setItem('musicTak', conf.music_is_tak)
        cc.sys.localStorage.setItem('sfxTak', conf.sfx_is_tak)
        cc.sys.localStorage.setItem('musicVolume', conf.music_volume)
        cc.sys.localStorage.setItem('sfxVolume', conf.sfx_volume)
        cc.sys.localStorage.setItem('broadcastSet', conf.broadcast_is_tak)
        cc.sys.localStorage.setItem('counterData', JSON.stringify(conf.counter_data))
        this.game_scene_counter.on_pours_set_num()

        this.node.active = false
    },

    // 取消
    on_cancel: function () {
        AudioManager.sfxPlay('btn')
        if (conf.music_is_tak == false) {
            cc.audioEngine.setVolume(conf.bgmID, 0)
        } else {
            cc.audioEngine.setVolume(conf.bgmID, conf.music_volume)
        }
        this.node.active = false
    },

    update (dt) {
        
    },
});
