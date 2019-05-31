var AudioManager = {

    // bgm 背景音乐
    bgmPlay: function (url) {
        cc.log('===== mc_tak', conf.music_is_tak)
        var volume = 0
        if (conf.music_is_tak === false) {
            volume = 0
        } else if (conf.music_volume) {
            volume = conf.music_volume
        }
        cc.loader.loadRes(url == undefined ? 'sounds/MapleStory' : url, cc.AudioClip, function (err, clip) {
            conf.bgmID = cc.audioEngine.play(clip, true, volume);
        });
    },

    // sfx 音效
    sfxPlay: function (url) {
        if (!url || !conf.sfx_is_tak || conf.sfx_volume === 0) {
            return
        }
        cc.loader.loadRes('sounds/' + url, cc.AudioClip, function (err, clip) {
            var sfxID = cc.audioEngine.play(clip, false, conf.sfx_volume);
        });
    }
}

module.exports = AudioManager
