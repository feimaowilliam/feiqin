
var Utils = require('Utils')
var Game = require('Game')
var AudioManager = require('AudioManager')

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
        is_local: true, // 本地打钩, 测试时候关掉
        game_lobby_win_url: '', // 大厅win url
        game_lobby_native_url: '', /// 大厅原生url
        game_url: '', // 飞禽走兽连接不包token
        game_script: {
            type: Game,
            default: null,
            tool: 'Game脚本组件'
        },
        u_avatar: {
            type: cc.Sprite,
            default: null,
            tool: '当前自己头像Node'
        },
        u_name: {
            type: cc.Label,
            default: null,
            tooltip: '当前自己昵称'
        },
        start_splash: {
            type: cc.Node,
            default: null,
            tooltip: '进入房间大节点'
        },
        btn_enter_romm: {
            type: cc.Button,
            default: null,
            tooltip: '进入房间按钮'
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // document title
        document.title = conf.title

        this.is_transfer = cc.sys.localStorage.getItem('is_transfer')
        cc.log(' ==== 是否回归前台key:', this.is_transfer)
        if (this.is_transfer === 'true') {
            this.start_splash.active = false // 屏蔽进入房间遮罩
        }

        this.btn_enter_romm.interactable = false
        this.btn_enter_romm.node.getChildByName('enter_room').getComponent(cc.Label).string = 'Loading ...'
        
        // 登录链接socketio => pomelo
        cc.log(' **** pomelo: ', pomelo)
        pomelo.init({host: conf.socketUrl, port: conf.socketPort}, function (res) {
            // 初始化后建立登录请求
            cc.log(' **** pomelo socket init callback: ', res)
            conf.is_connect = true // socket true

            var token = ''
            if (this.is_local) { // 本地测试
                conf.token = '74dd8141409943298c797c488e9d07f8'
            } else { // 线上测试
                // get [token] from url
                token = Utils.getRequest()['token']
                if (token == undefined || token == null || token == '') { // url没token 找storage
                    var token_buf = cc.sys.localStorage.getItem('token')
                    if (token_buf == undefined || token_buf == null || token_buf == '') { // storage 也没token return
                        cc.warn('从url获取token失败，请再试试哦O(∩_∩)O')
                        return
                    }
                    token = token_buf
                }

                // url或者storage有token
                cc.log('【palyer token is】 ', token)
                conf.token = token
                cc.sys.localStorage.setItem('token', token)
            }

            // 用户登录
            pomelo.request('connector.entryHandler.entry', {token: conf.token}, function (res) {
                console.log(' ******* connector.entryHandler.entry callback: ', res)
                if (res.code == 200) { // 登录成功
                    cc.log('entry ok')

                    // user avatar // http://sy0.img.it168.com/article/0/683/683201.jpg // avatar微信提供
                    Utils.load(this.u_avatar, res.data.avatar)
                    // user name
                    this.u_name.string = Utils.on_str_omit(res.data.username + '')

                    if (this.is_transfer === 'true') {
                        this.game_script.onSplashClose(null, -1) // -1代表是回归前台不要进入音效
                        cc.sys.localStorage.setItem('is_transfer', false)
                        return
                    }

                    // 进入房间按钮开启
                    this.btn_enter_romm.interactable = true
                    this.btn_enter_romm.node.getChildByName('enter_room').getComponent(cc.Label).string = 'Enter Room'
                } else if (res.code == 500) { // 登录失败
                    cc.log('entry error')
                }
            }.bind(this))
        }.bind(this))

        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log(' ****  **** 切回后台--')
        })
        
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log(' ******** 切回前端--')
            cc.sys.localStorage.setItem('is_transfer', true)
            location.href = this.game_url + '?token=' + conf.token + ''
        })

        // pomelo.on('close', function () {
        //     console.log(' ****  **** close')
        //     conf.is_connect = false // socket false
        // })

        // pomelo.on('disconnect', function () {
        //     console.log(' ****  **** disconnect')
        //     conf.is_connect = false // socket false
        // })

        // pomelo.on('heartbeat', function () {
        //     console.log(' ****  **** heartbeat timeout')
        // })
    },

    start () {

    },

    // 退出游戏
    on_btn_back: function () {
        AudioManager.sfxPlay('btn') // sfx

        // net test
        // location.href = 'http://baidu.com'
        // window.close()

        // 退出登录
        pomelo.request('game.roomHandler.out', function (res) {
            if (res.code === 200) { // 200
                cc.log(res.msg)
                // Utils.on_show_dialog('游戏大厅正在维护中...\n敬请期待！')
                // 跳转到大厅
                if (cc.sys.os === cc.sys.OS_WINDOWS) { // window
                    location.href = this.game_lobby_win_url
                } else { // cc.sys.OS_IOS, cc.sys.OS_ANDROID
                    location.href = this.game_lobby_native_url
                }
            } else { // 500
                cc.warn(res.msg)
            }
        }.bind(this))
    },

    // update (dt) {},
});
