window.conf = {
    title: '飞禽走兽多人版',

    // key: val
    url: '',
    reUrl: '',
    onLine: true, // 默认有网
    is_connect: false, // socket是否处于连接状态 默认false
    
    token: '',
    // token: '74dd8141409943298c797c488e9d07f8',

    // gameUrl: "wjs.ssssgame.com/chinesePoker/", // william
    // socketUrl: "192.168.1.176", // 啊威本地的
    // socketPort: "3010",

    socketUrl: "47.105.168.156", // 线上的
    socketPort: "20510",

    room_player_num: 0, // 房间人数
    userId: '', // 自己的id
    self_coin: 0, // 自己的金币

    // socketUrl: "114.116.4.24", // 线上的
    // socketPort: "3010",

    state: 0, // 游戏状态 1:下注阶段 2.开奖展示阶段
    second: 0, // 倒计时秒数
    end_zoo_id: 1, // 后端服务器推送开奖id 1到34

    // socket url:port
    // socket_url: '192.168.1.172:3010', // 啊威的
    // socket_url: '127.0.0.1:6081', // william

    // audioId 返回的是一个number
    bgmID: 0,

    // ori set 
    music_is_tak: true,
    sfx_is_tak: true,
    broadcast_is_tak: true,
    music_volume: 0.8,
    sfx_volume: 0.8,

    // 筹码管理
    counter_data: [],
    pour_key: '1', // 默认下注1
    total_pour: 0,
    total_down: 0,

    // 赢的玩家的信息
    win_pkg: {},
    // 开奖小动物数组
    win_zoo_list: [],

    // 投注动物原始表 从1开始, 总共12只
    pour_zoo_list_init: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
    },

    // 投注动物表 初始是空
    pour_zoo_list: {
        
    },

    // 投注动物表 真事下注数据
    pour_zoo_down: {},

    // 所有投注动物原始表 从1开始, 总共12只
    total_pour_zoo_list_init: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
    },

    // 所有投注动物表 初始是空
    total_pour_zoo_list: {
        
    },

    // 获取md5.min.js 资源 conf.crypto.md5(str);
    md5Sign: require('md5.min'),

    urlUtil: function () {
        var url = window.location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },

    setSign: function (params) {
        // 按字典排序
        var raw = function (args) {
            var keys = Object.keys(args);
            keys = keys.sort()
            var newArgs = {};
            keys.forEach(function (key) {
                if (key == 'sign') {
                return;
                }
                newArgs[key] = args[key];
            });
    
            var string = '';
            for (var k in newArgs) {
                string += k + '=' + newArgs[k];
            }
            //签名规则
            string += '85517e12b21adace2ebe37f5da85aada';
            return string;
        };
        //md5加密
        var string = conf.md5Sign(raw(params));
        params.sign = string;
        return params;
    },

}
