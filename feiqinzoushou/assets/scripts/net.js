if (window.io == null) { // h5
    window.io = require("socket-io");
}

var net = {
    socket_io: null,
        
    connect: function(url) {
        var self = this;
        
        var opts = {
            'reconnection':true,
            'force new connection': true,
            'transports':['websocket', 'polling']
        }

        this.socket_io = window.io.connect(url, opts);

        // 监听地城的系统事件
        this.socket_io.on('reconnect', function () {
            console.log(' ****** reconnection');
        });

        // 连接成功
        this.socket_io.on('connect', function (data) {
            console.log("****** socketio connect ok");
            self.socket_io.connected = true;
            // self.socket_io.emit('connector.entryHandler.entry', {token: '74dd8141409943298c797c488e9d07f8'});
        });
        
        // 断开连接
        this.socket_io.on('disconnect', function (data) {
            console.log("****** disconnect");
            self.socket_io.connected = false;
            // self.close();
        });
        
        // 连接失败
        this.socket_io.on('connect_failed', function () {
            console.log('****** connect failed');
        });

        // 自己定义,如果你向要收那种事件的数据，你就监听这个事件
        this.socket_io.on('your_echo', function (data) {
            console.log("your_echo", data);
        });

        // 自定义事件 自己定义,如果你向要收那种事件的数据，你就监听这个事件
        // this.socket_io.on('connector.entryHandler.entry', function (res) {
        //     console.log(' ****** 自定义事件 ')
        // })

    },

    // 发送数据: 事件 + 数据data;
    send: function (event, data) {
        if (this.socket_io.connected) {
            this.socket_io.emit(event, data);
        }
    },

    // 关闭socket
    close: function () {
        if (this.socket_io && this.socket_io.connected) {
            this.socket_io.connected = false;
            this.socket_io.disconnect(); // API
            this.socket_io = null;
        }
    },
};

module.exports = net;
