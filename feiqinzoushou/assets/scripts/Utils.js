var AudioManager = require('AudioManager');

var Utils = {
    // deep clone
    deepClone: function (obj) {
        var _obj = JSON.stringify(obj),
        objClone = JSON.parse(_obj);
        return objClone
    },

    // str more than 4 return ...
    on_str_omit: function (str) {
        if (str.length <= 4) {
            return str + ''
        }
        str = str.slice(0, 4) + '...'
        return str
    },

    // load remote png
    load: function (sprite_node, url) {
        cc.loader.load({url: url, type: 'png'}, function(err, ret) {
            if (err) {
                console.log(' **** remte png load error :', err)
                return
            }
            // ret is cc.Texture2D这样对象
            sprite_node.spriteFrame.setTexture(ret)
            // this.sprite.node.setContentSize(ret.getContentSize()); // 使用这个图片的大小
        })
    },

    /**
     * get from url
     * return {}
     */
    getRequest: function () {
        var url = window.location.search // 获取?后字符串
        var theRequest = new Object() // {}
        if (url.indexOf('?') != -1) {
            var str = url.substr(1)
            var strs = str.split('&')
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1])
            }
        }
        return theRequest 
    },

    // list is empty?
    on_list_is_empty: function (list) {
        for (var i in list) {
            return 1 // 不空返回1
        }
        return -1 // 空返回-1
    },

    // list pre num is 0?
    on_list_num_is_zero: function (list) {
        for (var key in list) {
            if (list[key] !== 0) {
                return 1 // 有一项不是0 返回1
            }
        }
        return -1 // 所有项都是0 返回-1
    },

    /**
     * param two {}
     * return list 1num = 1num + 2num
     *  */
    on_list_add_num: function (l_obj, r_obj) {
        for (var key in r_obj) {
            l_obj[key] = parseInt(l_obj[key]) + parseInt(r_obj[key]) + ''
        }
        return l_obj
    },

    // sort small => big
    on_sort_rank: function (arr) {
        arr.sort(function (lhs, rhs) {
            if (lhs < rhs) {
                return -1
            } else if (lhs > rhs) {
                return 1
            } else {
                return 0
            }
        })
        return arr
    },

    // 通过时间戳获取整理好的时间格式字符串 2019-0-25 21:22格式
    on_time_to_string: function (time) {
        var date = new Date(time)
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ''
    },

    // time trans => 2019time seconds
    on_time_trans: function (time) {
        var date = new Date(time)
        return date.getSeconds()
    },

    on_top_zoo_sprite_index: function (num) {
        var index = 0;
        switch (num) {
            case 26:
            case 27:
            case 28:
                index = 0
                break
            case 30:
            case 31:
                index = 1
                break
            case 33:
            case 34:
                index = 2
                break
            case 2:
            case 3:
            case 4:
                index = 3
                break
            case 1:
            case 12:
            case 18:
            case 29:
                index = 4
                break
            case 15:
            case 32:
                index = 5
                break
            case 19:
            case 20:
            case 21:
                index = 6
                break
            case 16:
            case 17:
                index = 7
                break
            case 13:
            case 14:
                index = 8
                break
            case 9:
            case 10:
            case 11:
            case 12:
                index = 9
                break
            case 5:
            case 6:
            case 7:
            case 8:
            case 22:
            case 23:
            case 24:
            case 25:
                index = 10
                break
        }
        return index
    
    },

    // return screen zoo index
    on_return_zoo_index: function (num) {
        if (num <= 4) {

        } else if (num >= 5 && num <= 8) {
            num = 5
        } else if (num >= 9 && num <= 21) {
            num -= 3
        } else if (num >= 22 && num <= 25) {
            num = 19
        } else if (num >= 26 && num <= 34) {
            num -= 6
        }
        return num - 1
    },

    on_return_zoo_recond_list: function (zoo_buf) {
        // 整理后历史记录动物原始表
        var zoo_recond_list = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
            5: [],
            6: [],
            7: [],
            8: [],
            9: [],
            10: [],
        },
        zoo_buf = zoo_buf.reverse()
        for (var index in zoo_buf) {
            index = parseInt(index)
            for (var key in zoo_recond_list) {
                zoo_recond_list[key].push(0)
                if (index === 0) {
                    zoo_recond_list[key][index] = 1
                } else {
                    zoo_recond_list[key][index] = zoo_recond_list[key][index - 1] + 1
                }
            }
            switch (zoo_buf[index]) {
                case 1:
                    var len = zoo_recond_list['6'].length
                    zoo_recond_list['6'][len - 1] = 0
                    break
                case 2:
                    var len = zoo_recond_list['4'].length
                    zoo_recond_list['4'][len - 1] = 0
                    break
                case 3:
                    var len = zoo_recond_list['5'].length
                    zoo_recond_list['5'][len - 1] = 0
                    break
                case 4:
                    var len = zoo_recond_list['3'].length
                    zoo_recond_list['3'][len - 1] = 0
                    break
                case 5:
                    var len = zoo_recond_list['2'].length
                    zoo_recond_list['2'][len - 1] = 0
                    break
                case 6:
                    var len = zoo_recond_list['1'].length
                    zoo_recond_list['1'][len - 1] = 0
                    break
                case 7:
                    var len = zoo_recond_list['7'].length
                    zoo_recond_list['7'][len - 1] = 0
                    break
                case 8:
                    var len = zoo_recond_list['8'].length
                    zoo_recond_list['8'][len - 1] = 0
                    break
                case 9:
                    var len = zoo_recond_list['10'].length
                    zoo_recond_list['10'][len - 1] = 0
                    break
                case 10:
                    var len = zoo_recond_list['9'].length
                    zoo_recond_list['9'][len - 1] = 0
                    break
                case 11:
                    var len = zoo_recond_list['0'].length
                    zoo_recond_list['0'][len - 1] = 0
                    break
            }
        }
        for (var key in zoo_recond_list) {
            zoo_recond_list[key].reverse()
        }
        return zoo_recond_list
    },

    on_return_species_record_list: function (zoo_buf) {
        var species_record_list = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: [],
        },
        zoo_buf = zoo_buf.reverse()
        for (var index in zoo_buf) {
            index = parseInt(index)
            for (var key in species_record_list) {
                species_record_list[key].push(0)
                if (index === 0) {
                    species_record_list[key][index] = 1
                } else {
                    species_record_list[key][index] = species_record_list[key][index - 1] + 1
                }
            }
            switch (zoo_buf[index]) {
                case 1:
                case 2:
                case 3:
                case 4:
                    var len = species_record_list['4'].length
                    species_record_list['4'][len - 1] = 0
                    break
                case 5:
                    var len = species_record_list['2'].length
                    species_record_list['2'][len - 1] = 0
                    break
                case 6:
                    var len = species_record_list['1'].length
                    species_record_list['1'][len - 1] = 0
                    break
                case 7:
                case 8:
                case 9:
                case 10:
                    var len = species_record_list['3'].length
                    species_record_list['3'][len - 1] = 0
                    break
                case 11:
                    var len = species_record_list['0'].length
                    species_record_list['0'][len - 1] = 0
                    break
            }
        }
        for (var key in species_record_list) {
            species_record_list[key].reverse()
        }
        return species_record_list
    },
    
    on_foot_wing_png: function (num) {
        var index = 0
        switch (num) {
            case 1:
                index = 6
                break
            case 2:
                index = 4
                break
            case 3:
                index = 5
                break
            case 4:
                index = 3
                break
            case 5:
                index = 2
                break
            case 6:
                index = 1
                break
            case 7:
                index = 7
                break
            case 8:
                index = 8
                break
            case 9:
                index = 10
                break
            case 10:
                index = 9
                break
            case 11:
                index = 0
                break
        }

        return index
    },

    // show dialog
    on_show_dialog: function (tip) {
        var tip = (tip == null || tip == undefined || tip == '' ? '提示' : tip)
        var target = cc.find('Canvas/dialog_box')
        target.active = true
        target.getChildByName('tips').getComponent(cc.Label).string = tip + ''
    },

    // hide dialog
    on_hide_dialog: function () {
        AudioManager.sfxPlay('btn') // sfx
        cc.find('Canvas/dialog_box').active = false
    }
}

module.exports = Utils