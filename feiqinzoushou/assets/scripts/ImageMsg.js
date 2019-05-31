var ImageMsg = {
    /**
     * 
     * @param {*} url 远程图片路径
     * @param {*} node 精灵组件
     */
    fill: function (url, node) {
        cc.loader.load(url, function (err, ret) {
            if (err) {
                cc.error('self log :' + err)
                return
            }
            node.spriteFrame.setTexture(ret)
        })
    }
}

module.exports = ImageMsg
