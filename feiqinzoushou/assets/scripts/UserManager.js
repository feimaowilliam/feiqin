var Utils = require('Utils')

window.Users = {
    /**
     * 玩家信息数组
     * 默认6个
     * pos位置 avatar玩家位置 name玩家名字 coin玩家金币 is_place是否占了座位
     */
    list: [
        {
            pos: 0,
            avatar: '',
            name: '',
            coin: 0,
            is_place: false
        }, {
            pos: 1,
            avatar: '',
            name: '',
            coin: 0,
            is_place: false
        }, {
            pos: 2,
            avatar: '',
            name: '',
            coin: 0,
            is_place: false
        }, {
            pos: 3,
            avatar: '',
            name: '',
            coin: 0,
            is_place: false
        }, {
            pos: 4,
            avatar: '',
            name: '',
            coin: 0,
            is_place: false
        }, {
            pos: 5,
            avatar: '',
            name: '',
            coin: 0,
            is_place: false
        }
    ],

    /**
     * 通过位置获取头像
     * @param {*} pos 玩家位置
     */
    getAvatarByPos: function (pos) {
        if (!pos) {
            cc.log('******* 通过位置获取头像时候传的位置传了个: ', pos)
            return
        }
        if (!User.list[pos].is_place) {
            cc.log('======= 该位置为空位')
            return
        }
        return User.list[pos].avatar
    },

    /**
     * 通过位置获取名字
     * @param {} pos 玩家座位
     */
    getNameByPos: function (pos) {
        if (!pos) {
            cc.log('******* 通过位置获取名字时候传的位置传了个: ', pos)
            return
        }
        if (!User.list[pos].is_place) {
            cc.log('======= 该位置为空位')
            return
        }
        return User.list[pos].name
    },

    /**
     * 获取玩家列表
     */
    getUserList: function () {
        return Utils.deepClone(Users.list)
    },

    /**
     * 往玩家列表里增加玩家 
     * @param {*} userInfo 新增玩家信息 json obj
     */
    addPlayerToUserlist: function (userInfo) {
        var index = parseInt(userInfo.pos)
        if (index < 0 || index > 5) {
            cc.log('======= 后端传的新加入玩家的座位号有误: ', userInfo.pos)
            return
        }
        if (User.list[index].is_place) { // 该位置已有玩家
            cc.log('======= ', index, ' 号位置已有玩家')
            return
        }
        User.list[index].pos = userInfo.pos
        User.list[index].avatar = userInfo.avatar
        User.list[index].name = userInfo.name
        User.list[index].coin = userInfo.coin
        User.list[index].is_place = true
        return
    },

    /**
     * 删除玩家
     * @param {} pos 待删除玩家的座位
     */
    deletePlayerByPos: function (pos) {
        index = parseInt(pos)
        if (index < 0 || index > 5) {
            cc.log('删除玩家时候传的座位出错啦啦啦~~', pos)
            return
        }
        if (!User.list[pos].is_place) {
            cc.log('======= ', pos, ' 该位置的玩家数据为空')
            return
        }
        User.list[index].pos = 0
        User.list[index].avatar = ''
        User.list[index].name = ''
        User.list[index].coin = 0
        User.list[index].is_place = false
        return
    }

}