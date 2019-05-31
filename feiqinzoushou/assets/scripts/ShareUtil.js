var ShareUtil = {
    share: function (userName, link, pngUrl, desc) {
        console.log("可以连接啦");
        pngUrl = pngUrl.indexOf("http") == -1 ? 'http://' + pngUrl : pngUrl;
        console.log(pngUrl + "/res/raw-assets/resources/images/logod.png");
        //分享到朋友圈
        wx.onMenuShareTimeline({
            title: userName + '的快乐比鸡',
            link: link,
            imgUrl: pngUrl + '/res/raw-assets/resources/images/logod.png',
            success: function () {
            },
            cancel: function () {
            }
        });
        //分享给朋友
        wx.onMenuShareAppMessage({
            title: userName + '的快乐比鸡',
            desc: desc,
            link: link,
            imgUrl: pngUrl + '/res/raw-assets/resources/images/logod.png',
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        });
        //分享到QQ
        wx.onMenuShareQQ({
            title: userName + '的快乐比鸡',
            desc: desc,
            link: link,
            imgUrl: + pngUrl + '/res/raw-assets/resources/images/logod.png',
            success: function () {
            },
            cancel: function () {
            }
        });
        //分享到腾讯微博
        wx.onMenuShareWeibo({
            title: userName + '的快乐比鸡',
            desc: desc,
            link: link,
            imgUrl: pngUrl + '/res/raw-assets/resources/images/logod.png',
            success: function () {
            },
            cancel: function () {
            }
        });
        //分享到QQ空间
        wx.onMenuShareQZone({
            title: userName + '的快乐比鸡',
            desc: desc,
            link: link,
            imgUrl: pngUrl + '/res/raw-assets/resources/images/logod.png',
            success: function () {
            },
            cancel: function () {
            }
        });
    }
}

module.exports = ShareUtil
