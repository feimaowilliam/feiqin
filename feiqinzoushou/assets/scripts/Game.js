var AudioManager = require('AudioManager');
var ActionUtils = require('ActionUtils');
var Utils = require('Utils');
// var net = require("net");

// 生成了一个类, 继承字 cc.Component 组件基类;
// 时给自己的脑袋执行的;
// 每行代码下去，你要知道意义是什么？
cc.Class({
    extends: cc.Component,

    properties: {
        // 调试模式 => 声音
        isDebug: false,
        start_splash: {
            type: cc.Node,
            default: null,
            tooltip: '开始游戏遮幕Node'
        },
        item_root: {
            type: cc.Node,
            default: null,
        },
        four_big_zoo: {
            type: cc.Node,
            default: [],
            tooltip: '4个变大框动物节点'
        },

        running_item: {
            type: cc.Node,
            default: null,
        },

        big_zoo_content: {
            type: cc.Node,
            default: null
        },

        big_zoo_prefab: {
            type: cc.Prefab,
            default: null
        },

        big_zoo_pngs: {
            type: cc.SpriteFrame,
            default: [],
            tooltip: '大动物图组'
        },
        // top more zoo spriteframe
        top_zoo_spriteframes: {
            type: cc.SpriteFrame,
            default: [],
            tooltip: '顶部动物图集'
        },
        // top more zoo node
        top_zoo_frame_node: {
            type: cc.Node,
            default: null,
            tooltip: '顶部更多栏目节点'
        },
        // 投注按钮集
        pours_node: {
            type: cc.Node,
            default: null
        },
        pour_btn_first_label: {
            type: cc.Label,
            default: null
        },
        key_frame: {
            type: cc.SpriteFrame,
            default: null
        },
        non_frame: {
            type: cc.SpriteFrame,
            default: null
        },
        total_pour_lab: {
            type: cc.Label,
            default: null
        },
        zoo_bottom_node: {
            type: cc.Node,
            default: null,
            tooltip: '底层小动物父节点'
        },

        pour_btn_block: {
            type: cc.Node,
            default: null,
            tooltip: '投注按钮遮罩'
        },
        status_ui: {
            type: cc.Node,
            default: null,
            tooltip: '状态UI'
        },
        status_str: {
            type: cc.Label,
            default: null,
            tooltip: '状态文字'
        },
        sec_splash: {
            type: cc.Node,
            default: null,
            tooltip: '倒计时遮罩'
        },
        sec_node: {
            type: cc.Node,
            default: null,
            tooltip: '倒计时节点'
        },
        sec_str: { // 倒计时秒数
            type: cc.Label,
            default: null,
            tooltip: '倒计时秒数'
        },
        wait_next_round_str: {
            type: cc.Node,
            default: null,
            tooltip: '等待下一轮字样'
        },
        room_player_num: {
            type: cc.Label,
            default: null,
            tooltip: '当前房间人数'
        },
        self_coin: {
            type: cc.Label,
            default: null,
            tooltip: '自己金币'
        },
        ActionComponent: {
            type: ActionUtils,
            default: null,
            tooltip: '动画action组件'
        }
        
    },

    onLoad () {
        pomelo.on('close', function () {
            console.log('】】】】】】】 close')
            conf.is_connect = false // socket false
        })
        pomelo.on('disconnect', function () {
            console.log('】】】】】】】 disconnect')
            conf.is_connect = false // socket false
        })

        // pomelo.on('heartbeat', function () {
        //     console.log('】】】】】】】 heartbeat timeout')
        // })

        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log(' **** **** 切回后台--')
        });   
        
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log(' **** **** 切回前端--')
            
            location.href = ''

            // if (conf.is_connect) { // 处于连接
            //     return
            // }
            // // 否则重连
            // pomelo.init({host: conf.socketUrl, port: conf.socketPort}, function (res) {
            //     console.log(' ******** 重连成功' )
            //     // 重连操作
            // })

            // pomeloConnect(reIp, rePort, ()=>{
            //     console.log('networkManger,123--重连成功---' )
            //     const token = cc.sys.localStorage.getItem('nodeToken');
            //     if(token){
            //         pomeloRequest("connector.entryHandler.reconnect",{token:token},function (err,soData) {
            //             cc.reconnectFun && cc.reconnectFun(err,soData);
            //         });
            //     }
            // });
        })

        // pomelo监听
        // pomelo.on('entry', function (data) {
        //     self.enterRoom(data);
        // });

        // // pomelo取消监听
        // pomelo.off('entry', function (data) {
        //     self.enterRoom(data);
        // });

        // pomelo请求
        // self.chilpBox.getChildByName("nd_giveUp").on(cc.Node.EventType.TOUCH_END, function (event) {
        //     let route = "game.gameHandler.giveUp";
        //     pomelo.request(route, {}, function (data) {
        //         console.log(data);
        //         if (data.code == 200) {
        //             console.log("拿到offer");
        //         } else if (data.code == 500) {
        //             console.log("争取拿到offer");
        //         }
        //     })
        // }, this);

        // 初始化conf配置信息 => setting
        this.set_init()

        // [cto] 房间人数广播
        pomelo.on('roomNumberChange', this.on_room_peaple_num.bind(this))

        // [cto] 通知新一轮的游戏开始 开始下注广播
        pomelo.on('newRound', this.on_new_round.bind(this))

        // [cto] 其他玩家下注广播
        pomelo.on('otherBitsList', this.on_pour_bc.bind(this))
        
        // [cto] 转圈开奖
        pomelo.on('endRound', this.on_round_strat.bind(this))

        // 断开连接
        pomelo.on("disconnect", function (data) {
            Utils.on_show_dialog('网络不给力，连接服务器失败,\n请检查网络是否正常.')
        });

        pomelo.on("close", function (data) {
            conf.online = false;
            cc.warn(' *********** 关闭socket ')
            // self.disconnect(data);
        });

        // cc.log('=======@@', conf.counter_data)
        // cc.log('========@@@@@@@', cc.sys.localStorage.getItem('counterData'))
    },

    // 引擎会调用 节点上的。组件实例.start方法;
    // 开始运行之前调用一次，初始化入口的好地方;
    // 初始化入口
    start () {
        if (this.isDebug) { // 声音
            this.start_splash.active = true
        } else {
            this.start_splash.active = false
        }

        // this----> 组件实例, this.node ---> 组件实例所在的节点;
        // 开始你的running item再哪个位置,随机生成一个位置;
        this.is_running = false;
        this.start_index = Math.random() * this.item_root.childrenCount;  // [0~28)
        this.start_index = Math.floor(this.start_index);
        this.running_item.setPosition(this.item_root.children[this.start_index].getPosition());
        if (this.start_index == 4 || this.start_index == 11 || this.start_index == 18 || this.start_index == 25) {
            this.running_item.scale = 1.5
        } else {
            this.running_item.scale = 1.0
        }

        // 移除大动物
        this.big_zoo_content.removeAllChildren();
        // 初始化中间大动物
        // this.onShowBigZooIndex(this.start_index);
    },

    // 初始化conf配置信息 => setting
    set_init: function () {
        // init music tak
        var m_tak = cc.sys.localStorage.getItem('musicTak')
        m_tak = JSON.parse(m_tak)
        cc.log('====== m_tak', m_tak)
        if (m_tak === true || m_tak === null || m_tak === undefined || m_tak === '') {
            cc.sys.localStorage.setItem('musicTak', true)
            conf.music_is_tak = true
        } else { // music tak false
            conf.music_is_tak = false
        }

        // init sfx tak
        var x_tak = cc.sys.localStorage.getItem('sfxTak')
        x_tak = JSON.parse(x_tak)
        cc.log('====== x_tak', x_tak)
        if (x_tak === true || x_tak === null || x_tak === undefined || x_tak === '') {
            cc.sys.localStorage.setItem('sfxTak', true)
            conf.sfx_is_tak = true
        } else { // sfx tak false
            conf.sfx_is_tak = false
        }

        // init music volume
        var m_vol = cc.sys.localStorage.getItem('musicVolume')
        m_vol = JSON.parse(m_vol)
        cc.log('====== m_vol', m_vol)
        if (m_vol === null || m_vol === undefined || m_vol === '') { // 没有存背景音乐音量
            cc.sys.localStorage.setItem('musicVolume', 0.8)
            conf.music_volume = 0.8
        } else { // 有存背景音乐音量
            conf.music_volume = m_vol
        }

        // init sfx volume
        var x_vol = cc.sys.localStorage.getItem('sfxVolume')
        x_vol = JSON.parse(x_vol)
        cc.log('====== x_vol', x_vol)
        if (x_vol === null || x_vol === undefined || x_vol === '') { // 没有存音效音量
            cc.sys.localStorage.setItem('sfxVolume', 0.8)
            conf.sfx_volume = 0.8
        } else { // 有存背景音乐音量
            conf.sfx_volume = x_vol
        }

        // init broadcast
        var bs_set = cc.sys.localStorage.getItem('broadcastSet')
        bs_set = JSON.parse(bs_set)
        cc.log('====== bs_set', bs_set)
        if (bs_set === true || bs_set === null || bs_set === undefined || bs_set === '') { // 没有存广播设置
            cc.sys.localStorage.setItem('broadcastSet', true)
            conf.broadcast_is_tak = true
        } else { // 有存广播设置
            conf.broadcast_is_tak = false
        }
        
        // 初始化筹码
        var coun_data = cc.sys.localStorage.getItem('counterData')
        coun_data = JSON.parse(coun_data)
        cc.log('====== coun_data', coun_data)
        if (coun_data === null || coun_data === undefined || coun_data === '' || coun_data.length === 0) {
            conf.counter_data = [1, 2, 50, 100, 200, 1000]
            // 渲染Game筹码按钮num
            this.on_pours_set_num()
            var c_data = JSON.stringify(conf.counter_data)
            cc.log('=======^^ ', conf.counter_data)
            cc.sys.localStorage.setItem('counterData', c_data)
        } else {
            conf.counter_data = Utils.deepClone(coun_data)
            cc.log('=============', conf.counter_data)
            // 渲染Game筹码按钮num
            this.on_pours_set_num()
        }

        // 初始化开奖id 1到34 默认是1
        conf.end_zoo_id = 1

        // 初始化玩家数据
        conf.room_player_num = 0  // 房间人数
        conf.userId = ''  // 用户userId
        conf.self_coin = 0  // 用户金币
        this.room_player_num.string = conf.room_player_num
        this.self_coin.string = conf.self_coin

        // 配置.初始化下注小动物表
        conf.pour_zoo_list = Utils.deepClone(conf.pour_zoo_list_init)
        // 配置.初始化下注小动物缓存表
        conf.pour_zoo_down = Utils.deepClone(conf.pour_zoo_list_init)

        // 配置.初始化所有玩家下注小动物表
        conf.total_pour_zoo_list = Utils.deepClone(conf.total_pour_zoo_list_init)
        cc.log('所有玩家投注列表', conf.total_pour_zoo_list)
        // 配置.初始话所有玩家下注小动物UI

        // 小动物，总下注，投注UI列表归零
        this.zoo_bottom_node.getComponent('zooBottomMsg').on_clean_pour_list()
        // 所有玩家小动物, 所有玩家投注UI列表归零
        this.zoo_bottom_node.getComponent('zooBottomMsg').on_clean_total_pour_list()

        // 配置conf的总投注为0
        conf.total_pour = 0
        // 配置conf的真实总投注为0
        conf.total_down = 0

        // 初始化赢的玩家的信息
        conf.win_pkg = {}
        // 初始化开奖小动物数组
        conf.win_zoo_list = []

        // 初始化遮罩
        this.pour_btn_block.active = false // 可以下注
        this.sec_splash.active = false // 倒计时遮罩屏蔽
        this.status_ui.active = false // 状态UI默认屏蔽
        this.sec_node.active = false // 倒计时节点屏蔽
    },

    // [cto] 房间人数广播
    on_room_peaple_num: function (res) {
        if (res.msg.code !== 200) {
            cc.warn('房间人数广播出错啦啦啦', res.msg.msg)
            return
        }
        // 成功拿到
        cc.log('当前房间总人数是:', res.msg.data.number)
        this.room_player_num.string = res.msg.data.number + ''
    },

    // 渲染Game筹码按钮
    on_pours_set_num: function () {
        // 渲染num
        conf.counter_data = Utils.on_sort_rank(conf.counter_data)
        for (var i in this.pours_node.children) {
            this.pours_node.children[i].name = conf.counter_data[i] + '';
            this.pours_node.children[i].getChildByName('num').getComponent('cc.Label').string = (conf.counter_data[i] == 1000 ? '1K' : conf.counter_data[i])
        }
        // 渲染筹码选中底图
        var pour_key_data = cc.sys.localStorage.getItem('pourKey') // pourKey: Game场景中选中筹码的key
        if (!pour_key_data) {
            conf.pour_key = this.pour_btn_first_label.string + ''
            cc.sys.localStorage.setItem('pourKey', this.pour_btn_first_label.string + '')
            cc.log('========= 本地没有存储pourkey,现在存进去 ', this.pour_btn_first_label.string)
        } else {
            conf.pour_key = pour_key_data + ''
        }
        for (var i in this.pours_node.children) {
            this.pours_node.children[i].getComponent(cc.Sprite).spriteFrame = this.non_frame
        }
        if (conf.pour_key == '1000') { // 本地存的投注按钮是1000
            for (var i in this.pours_node.children) {
                if(this.pours_node.children[i].getChildByName('num').getComponent(cc.Label).string == '1K') {
                    cc.log('======= 本地和localStorage已匹配, 投注的标号是: ', conf.pour_key)
                    this.pours_node.children[i].getComponent(cc.Sprite).spriteFrame = this.key_frame
                    break
                }
            }
        } else { // 本地存的投注按钮不是1000
            for (var i in this.pours_node.children) {
                if (this.pours_node.children[i].getChildByName('num').getComponent(cc.Label).string == conf.pour_key) {
                    cc.log('======= 本地和localStorage已匹配, 投注的标号是: ', conf.pour_key)
                    this.pours_node.children[i].getComponent(cc.Sprite).spriteFrame = this.key_frame
                    break
                }
            }
        }
        
    },

    // 【cto on】开始新一轮游戏 开始下注广播
    on_new_round: function (res) {
        if (res.code !== 200) {
            cc.log('注册新一轮的游戏开始返回code出错啦: ', res.code)
            return
        }
        cc.log(res.msg) // 开始新一轮游戏
        // this.block_and_sec_node.active = true // 时间和遮罩总结点开关

        // top zoo flesh
        this.on_top_zoo_flash()

        // 小动物，总投注，投注列表归零
        this.zoo_bottom_node.getComponent('zooBottomMsg').on_clean_pour_list()
        // 所有玩家小动物, 所有玩家投注列表归零
        this.zoo_bottom_node.getComponent('zooBottomMsg').on_clean_total_pour_list()

        var now_time = res.data.nowTime
        var end_time = res.data.endTime
        conf.second = parseInt((end_time - now_time) / 1000) // 毫秒

        if (isNaN(conf.second)) {
            cc.warn('新一轮游戏开始返回的时间戳isNaN啦')
            return
        }
        conf.state = 1 // 游戏状态 1:下注阶段 2.开奖展示阶段

        // 移除大动物
        this.big_zoo_content.removeAllChildren();

        this.wait_next_round_str.active = false // 等待下一轮文字屏蔽
        this.pour_btn_block.active = false // 可以投注
        this.sec_splash.active = false // 倒计时遮罩屏蔽
        this.status_ui.active = true // 状态UI打开
        this.status_str.string = '开始下注'
        this.sec_node.active = true // 倒计时节点
        // 倒计时
        this.count_down(conf.second)
    },

    // 投注按钮点击事件
    on_pour_btn_callback (event, data) {
        AudioManager.sfxPlay('btnclick') // sfx

        cc.log('@@@@@@: ', event)
        cc.log('======: 投注选中: ', event.target.name + '')
        if (!event) {
            cc.log('投注按钮回调函数出错啦 ~~')
            return
        }
        conf.pour_key = event.target.name + ''
        cc.sys.localStorage.setItem('pourKey', conf.pour_key)

        // 刷新投注按钮集
        for (var i in this.pours_node.children) {
            this.pours_node.children[i].getComponent(cc.Sprite).spriteFrame = this.non_frame
        }
        event.currentTarget.getComponent(cc.Sprite).spriteFrame = this.key_frame
        // for (var i in this.pours_node.children) {
        //     if (this.pours_node.children[i].getChildByName('num').getComponent(cc.Label).string == conf.pour_key) {
        //         cc.log('======= 本地和localStorage已匹配, 投注的标号是: ', conf.pour_key)
        //         this.pours_node.children[i].getComponent(cc.Sprite).spriteFrame = this.key_frame
        //         break
        //     }
        // }

    },

    // 开奖转圈
    on_round_strat: function (res) {
        if (res.code !== 200) {
            cc.warn('通知本轮游戏结果 endRound 返回code出错啦！', res.code)
            return
        }
        conf.state = 2 // 游戏状态 1:下注阶段 2.开奖展示阶段

        // 获取开奖信息成功 // willaim 正式发布要去掉开奖信息以免泄露
        cc.log(res.msg)
        cc.log('==== 开奖ls: ', res.data)

        // 刷新自己下注小动物ui和数据
        this.zoo_bottom_node.getComponent('zooBottomMsg').reflash_zoo_list_ui()
        conf.pour_zoo_list = Utils.deepClone(conf.pour_zoo_down)
        
        // 刷新总投注
        conf.total_pour = conf.total_down
        this.on_fresh_total_pour(2)

        conf.win_pkg = res.data.result // 保存开奖玩家信息
        cc.log('== 开奖玩家列表 ==')

        conf.win_zoo_list = res.data.rightBetsList // 保存开奖小动物信息

        this.pour_btn_block.active = true // 投注屏蔽
        this.sec_splash.active = false // 倒计时遮罩关闭
        this.status_ui.active = true // 开奖打开
        this.status_str.string = '开奖'
        this.sec_node.active = false // 倒计时节点关闭
        this.sec_str.string = '' // 倒计时文字清零

        // 小动物，总投注，投注列表归零
        // this.zoo_bottom_node.getComponent('zooBottomMsg').on_clean_pour_list()

        // 开始转圈
        if (res.data.showId < 1 || res.data.showId > 34) { // res.data.showId 1到34
            cc.warn(' ==== 开奖熟字不在1到34是: ', res.data.showId)
            return
        }
        // 保存开奖id 1到34
        conf.end_zoo_id = res.data.showId
        this.end_index = Utils.on_return_zoo_index(res.data.showId)
        // this.end_index = Math.floor(res.data.showId - 1); // end_index 从0开始
        console.log(" ==== end: ", res.data.showId);

        // end
        this.show_anim_result();
        // 移除大动物
        this.big_zoo_content.removeAllChildren();

        // william
        // // 获得一个抽奖的结果, 服务器传给我们的，
        // this.end_index = Math.random() * this.item_root.childrenCount;
        // this.end_index = Math.floor(this.end_index);
        // console.log("end: ", this.end_index + 1);
    },

    show_anim_result() {
        var round = Math.random() * 3 + 2; // 随机一个转的圈数;
        round = Math.floor(round); 

        // 撸直了;
        // 数组路径，for循环，循环的吧我们的环上的每个位置都push到 road_path里面来;
        this.road_path = []; 

        for(var j = 0; j < round; j ++) {
            for(var i = this.start_index; i < this.item_root.childrenCount; i ++) {
                this.road_path.push(this.item_root.children[i].getPosition());
            }

            for(var i = 0; i < this.start_index; i ++) {
                this.road_path.push(this.item_root.children[i].getPosition());
            }
        }

        // start ---> end;
        if (this.end_index >= this.start_index) {
            for(var i = this.start_index; i <= this.end_index; i ++) {
                this.road_path.push(this.item_root.children[i].getPosition());
            }
        }
        else {
            for(var i = this.start_index; i < this.item_root.childrenCount; i ++) {
                this.road_path.push(this.item_root.children[i].getPosition());
            }

            for(var i = 0; i <= this.end_index; i ++) {
                this.road_path.push(this.item_root.children[i].getPosition());
            }
        }
        // end

        this.v = 5000; // 开始的速度;
        this.a_v = this.v / (this.road_path.length - 1);
        this.running_item.setPosition(this.road_path[0]);
        this.next_step = 1;
        this.walk_to_next();
    },

    walk_to_next() {
        AudioManager.sfxPlay('round') // sfx

        if (this.next_step >= this.road_path.length) {
            this.start_index = this.end_index; // 下一次开始的位置
            this.is_running = false; // 动画结束
            this.onShowBigZooIndex(conf.end_zoo_id); // 显示大动物 1到34
            // 把[开奖]给屏蔽了
            this.status_ui.active = false

            // 等待下一轮文字显示
            this.scheduleOnce(function () {
                this.wait_next_round_str.active = true
            }.bind(this), 2)

            // 0.8秒
            this.scheduleOnce(function () {
                cc.log('开奖小动物闪烁啦O(∩_∩)O')
                if (Utils.on_list_is_empty(conf.win_pkg) === -1) {
                    cc.log('没有赢的玩家~~')
                    this.ActionComponent.on_coin_bigzoo_to_player(conf.win_zoo_list, null, 0) // params2 null 只会闪烁
                } else {
                    cc.log('有赢的玩家哟')
                    for (var i in conf.win_pkg) {
                        // william
                        if (i == conf.userId) { // 返金币给自己
                            // param1 开奖小动物数组  params2 true自己false玩家共同体   params3赢的金币
                            this.ActionComponent.on_coin_bigzoo_to_player(conf.win_zoo_list, true, conf.win_pkg[i])
                            this.ActionComponent.on_show_profit_num(conf.win_pkg[i])
                            conf.self_coin += parseInt(conf.win_pkg[i])
                        } else { // 返金币给玩家共同体
                            this.ActionComponent.on_coin_bigzoo_to_player(conf.win_zoo_list, false, conf.win_pkg[i])
                        }
                    }
                }
            }.bind(this), 0.8)
            // this.scheduleOnce(function () {
            //     for (var i in conf.win_pkg) {
            //         // william
            //         if (conf.win_pkg[i].userId == conf.userId) { // 返金币给自己
            //             // param1 开奖小动物数组  params2 true自己false玩家共同体   params3赢的金币
            //             this.ActionComponent.on_coin_bigzoo_to_player(conf.win_zoo_list, true, conf.win_pkg[i].value)
            //         } else { // 返金币给玩家共同体
            //             this.ActionComponent.on_coin_bigzoo_to_player(conf.win_zoo_list, false, conf.win_pkg[i].value)
            //         }
            //     }
            // }.bind(this), 0.8)
            return;
        }

        this.is_running = true;
        var src = this.running_item.getPosition();
        var dst = this.road_path[this.next_step];
        var dir = dst.sub(src);
        var len = dir.mag();  // 取模运算，向量的长度
        this.vx = this.v * dir.x / len;
        this.vy = this.v * dir.y / len;
        this.move_time = len / this.v;
        this.passed_time = 0;
    },

    // 其他玩家下注广播
    on_pour_bc: function (res) {
        var res = res.msg
        if (res.code != 200) {
            cc.warn('其他玩家下注广播响应参数有误, code是: ', res.code)
            return
        }
        cc.log(res.msg + '成功') // 其他玩家下注成功
        for (var i in res.data) {
            if (res.data[i] !== 0) {
                // 玩家共同体人投注小动物动画
                this.ActionComponent.on_coin_player_to_zoo(false, parseInt(i) - 1 + '')

                // 渲染所有玩家小动物表
                var t_coin = parseInt(conf.total_pour_zoo_list[i])
                var c_coin = parseInt(res.data[i])
                t_coin += c_coin
                conf.total_pour_zoo_list[i] = t_coin

                // 渲染所有玩家小动物UI
                var z_index = parseInt(i) - 1 + ''
                this.zoo_bottom_node.children[z_index].getChildByName('bet').getChildByName('num').getComponent(cc.Label).string = t_coin + ''
            }
        }
    },

    on_start_click () {
        AudioManager.sfxPlay('start') // sfx

        // 向服务器提交自己下注列表请求
        this.zoo_bottom_node.getComponent('zooBottomMsg').on_send_pour_list()

        // 总下注归零
        // this.on_fresh_total_pour(-1) // 1加上去 -1 归零

        // 获得一个抽奖的结果, 服务器传给我们的，
        // this.end_index = Math.random() * this.item_root.childrenCount;
        // this.end_index = Math.floor(this.end_index);
        // console.log("end: ", this.end_index + 1);
        // // end
        // this.show_anim_result();
        // // 移除大动物
        // this.big_zoo_content.removeAllChildren();
    },

    onShowBigZooIndex: function (index) { // index 1到34
        switch (index) {
            case 1: // 银鲨
            case 12: // 银鲨
            case 18: // 银鲨
            case 29: // 银鲨
                this.onShowBigZoo(0); // 银鲨 => 0
            break;

            case 2: // 燕子
            case 3: // 燕子
            case 4: // 燕子
                this.onShowBigZoo(1); // 燕子 => 1
            break;

            case 9: // 狮子
            case 10: // 狮子
            case 11: // 狮子
                this.onShowBigZoo(2); // 狮子 => 2
            break;

            case 13: // 熊猫
            case 14: // 熊猫
                this.onShowBigZoo(3); // 熊猫 => 3
            break;
            
            case 15: // 金鲨
            case 32: // 金鲨
                this.onShowBigZoo(4); // 金鲨 => 4
            break;
            
            case 16: // 猴子
            case 17: // 猴子
                this.onShowBigZoo(5); // 猴子 => 5
            break;
            
            case 19: // 兔子
            case 20: // 兔子
            case 21: // 兔子
                this.onShowBigZoo(6); // 兔子 => 6
            break;
            
            case 26: // 老鹰
            case 27: // 老鹰
            case 28: // 老鹰
                this.onShowBigZoo(7); // 老鹰 => 7
            break;
            
            case 30: // 鸽子
            case 31: // 鸽子
                this.onShowBigZoo(8); // 鸽子 => 8
            break;
            
            case 33: // 孔雀
            case 34: // 孔雀
                this.onShowBigZoo(9); // 孔雀 => 9
            break;

            case 5: // 飞禽派对
            case 22: // 飞禽派对
                this.onShowBigZoo(10); // 飞禽派对 => 10           
            break;

            case 6: // 走兽派对
            case 23: // 走兽派对
                this.onShowBigZoo(11); // 走兽派对 => 11          
            break;

            case 7: // 鲨鱼狂潮
            case 24: // 鲨鱼狂潮
                this.onShowBigZoo(12); // 鲨鱼狂潮 => 12
            break;

            case 8: // 至尊海陆空
            case 25: // 至尊海陆空
                this.onShowBigZoo(13); // 至尊海陆空 => 13
            break;
            
        }
    },

    // 显示大动物
    onShowBigZoo: function (index) {
        this.scheduleOnce(function () {
            AudioManager.sfxPlay('award') // sfx

            var bigzoo_prefab = cc.instantiate(this.big_zoo_prefab)
            bigzoo_prefab.getComponent(cc.Sprite).spriteFrame = this.big_zoo_pngs[index]
            this.big_zoo_content.addChild(bigzoo_prefab);
        }.bind(this), 0.8)
    },

    // 渲染总下注牌子
    on_fresh_total_pour: function (key) { // 1渲染 -1归零 2复位
        if (!key) {
            cc.log('渲染总下注牌子传的key出错啦~~')
            return
        }
        if (key === 1) { // 渲染
            this.total_pour_lab.string = parseInt(conf.total_pour) + ''
        } else if (key === -1) { // 归零
            this.total_pour_lab.string = '0'
            conf.total_pour = 0
            conf.total_down = 0
        } else if (key === 2) { // 复位同步到conf.total_down
            this.total_pour_lab.string = parseInt(conf.total_down) + ''
        }
        
    },

    // 进入房间 => 声音
    onSplashClose: function (event, key) {
        if (key !== -1) { // 不是-1都要进房音效
            AudioManager.sfxPlay('start') // sfx
        }

        // 进入房间请求
        pomelo.request('game.roomHandler.enter', {}, function (res) {
            if (res.code != 200) {
                cc.warn(' **** 进入房间请求返回code出错啦: ', res.code)
                return
            }
            
            conf.room_player_num = res.data.number  // 房间人数
            conf.userId = res.data.userId   // 用户userId
            cc.log(' ==== 当前用户的金币数是：', res.data.gold)
            conf.self_coin = res.data.gold  // 用户金币
            this.room_player_num.string = conf.room_player_num
            this.self_coin.string = conf.self_coin

            // 渲染已经投注过的小动物
            if (Utils.on_list_is_empty(res.data.betsList) === -1) { // 所有小动物是空表
                
            } else { // 所有小动物不是空表
                conf.total_pour_zoo_list = res.data.betsList // 之前所有玩家已经投注的小动物信息
                // 渲染UI
                for (var i in res.data.betsList) {
                    // 渲染所有玩家小动物表
                    var t_coin = parseInt(conf.total_pour_zoo_list[i])
                    var c_coin = parseInt(res.data.betsList[i])
                    t_coin += c_coin
                    conf.total_pour_zoo_list[i] = t_coin
    
                    // 渲染所有玩家小动物UI
                    var z_num = parseInt(i) - 1 + ''
                    this.zoo_bottom_node.children[z_num].getChildByName('bet').getChildByName('num').getComponent(cc.Label).string = t_coin + ''
                    
                }
            }

            // 【更多】栏目初始化
            try {
                this.on_top_zoo_flash()
            } catch (err) {
                cc.warn('点击更多按钮，获取更多信息接口报错啦啦啦啦O(∩_∩)O ', err)
            }

            cc.log(' ==== 游戏状态 1:下注阶段 2.开奖展示阶段 当前房间游戏状态是: ', res.data.gameState)
            conf.state = res.data.gameState // 游戏状态 1:下注阶段 2.开奖展示阶段

            this.pour_btn_block.active = (conf.state == 1 ? false : true) // 投注遮罩
            // this.block_and_sec_node.active = true // 时间和遮罩总结点开关
            
            var now_time = res.data.nowTime
            var end_time = res.data.endTime
            conf.second = parseInt((end_time - now_time) / 1000)  // 毫秒

            if (isNaN(conf.second)) {
                cc.warn('进入房间返回的时间戳isNaN啦')
                return
            }

            // 状态UI
            this.status_ui.active = true // 状态UI打开
            this.status_str.string = (conf.state == 1 ? '下注中' : '开奖中, 请等候...')
            // 倒计时set
            this.sec_splash.active = (conf.state == 1 ? false : true) // 倒计时遮罩 1下注无 2开奖有
            this.sec_node.active = (conf.state == 1 ? true : true) // 倒计时节点 1下注显示 2开奖也显示
            // 倒计时
            this.count_down(conf.second)
        }.bind(this))

        this.start_splash.active = false;
        AudioManager.bgmPlay() // bgm
    },

    // 【更多栏目】渲染
    on_top_zoo_flash: function () {
        // 更多栏目初始化请求
        pomelo.request('game.betsHandler.log', {number: 8}, function (res) {
            if (res.code === 200) { // 获取成功
                var array = res.data.roundlist
                cc.log('KK PP', array)
                for (var i in this.top_zoo_frame_node.children) {
                    var inx = parseInt(array[i])
                    inx -= 1
                    // inx = Utils.on_top_zoo_sprite_index(inx)
                    this.top_zoo_frame_node.getChildByName(i + '').getComponent(cc.Sprite).spriteFrame = this.top_zoo_spriteframes[inx]
                }
            } else {
                cc.warn('顶部更多栏目动物图初始化出错啦O(∩_∩)O~~')
            }
        }.bind(this))
    },

    // 提示弹框隐藏
    on_hide_dialog_box: function () {
        Utils.on_hide_dialog()
    },

    // 倒计时
    count_down: function (time) {
        var interval = 1;
        var repeat = time;
        var start_delay = 0;
        this.schedule(function() {
            this.sec_str.string = time + ''
            if (time === 0) {
                // 倒计时结束
                this.sec_splash.active = false
                // this.sec_node.active = false
                this.sec_str.string = ''
            }
            time --
        }.bind(this), interval, repeat, start_delay);
    },

    // 引擎会调用 组件实例.update
    // dt: 距离上一次刷新过去的时间, dt 计算出游戏世界发生了哪些变化;
    update (dt) {
        if (this.is_running === false) {
            return;
        }

        this.passed_time += dt;
        if (this.passed_time > this.move_time) {
            dt -= (this.passed_time - this.move_time);
        }

        // this.running_item.x += (this.vx * dt);
        // this.running_item.y += (this.vy * dt);

        if (this.passed_time >= this.move_time) {

            // 直接下
            this.running_item.setPosition(this.road_path[this.next_step])

            var run_v2 = this.running_item.getPosition()
            for (var i in this.four_big_zoo) {
                var b_zoo_pos = this.four_big_zoo[i].getPosition()
                if (b_zoo_pos.x == run_v2.x && b_zoo_pos.y == run_v2.y) {
                    this.running_item.scale = 1.5
                    break
                } else {
                    this.running_item.scale = 1.0
                }
            }

            this.next_step ++;
            this.v -= this.a_v;
            this.walk_to_next();
        }
    },

    onDestroy: function () {
        // [cto] 撤销房间人数广播
        pomelo.off('roomNumberChange', this.on_room_peaple_num)
        // [cto] 撤销新一轮监听
        pomelo.off('newRound', this.on_new_round)
        // [cto] 撤销其他玩家下注广播
        pomelo.off('otherBitsList', this.on_pour_bc)
        // [cto] 撤销转圈开奖
        pomelo.off('endRound', this.on_round_strat)
    }

});
