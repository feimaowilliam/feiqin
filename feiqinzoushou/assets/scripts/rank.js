cc.Class({
    extends: cc.Component,

    properties: {
        rank_content: {
            type: cc.Node,
            default: null,
            tooltip: '周盈利内容总结点'
        },
        rank_prefab: {
            type: cc.Prefab,
            default: null,
            tooltip: '周盈利每行预制体'
        },
        rank_icons_frames: {
            type: cc.SpriteFrame,
            default: [],
            tooltip: '冠亚季军图标'
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.on_reflash()
    },

    onEnable () {
        pomelo.request('game.rankHandler.profit', {}, function (res) {
            if (res.code === 200) {
                this.on_reflash()

                cc.log('**** ', res.msg)
                var rank_list = res.data.rankList
                for (var i in rank_list) { // []
                    var r_prefab = cc.instantiate(this.rank_prefab)

                    if (i >= 0 && i <= 3) {
                        r_prefab.getChildByName('rk').getComponent(cc.Sprite).spriteFrame = this.rank_icons_frames[i]
                    }
                    
                    r_prefab.getChildByName('num').getComponent(cc.Label).string = parseInt(i) + 1 + '' // 排号
                    r_prefab.getChildByName('name').getComponent(cc.Label).string = rank_list[i].username + '' // 昵称
                    r_prefab.getChildByName('profit').getComponent(cc.Label).string = rank_list[i].profit + '' // 盈利
                    
                    this.rank_content.addChild(r_prefab);
                }
            } else {
                cc.warn('**** 周盈利排行榜请求后端数据出错啦O(∩_∩)O~~ 请检查一下哦')
            }
        }.bind(this))
    },

    // 清除数据
    on_reflash: function () {
        this.rank_content.removeAllChildren()
    }

    // update (dt) {},
});
