

/**
 * 同步通訊機制
 * 1. Client 端互相傳遞與接收資料 (ex: 聊天室功能)
 * 2. 使用 WebSocket API 達到溝通效果
 * 3. Server 端位址暫用 << ws://echo.websocket.org >> , 要是有自建的 socket server 可將 URL 換成 server 的位址
 */

var WEBSOCKETSYNC = function () {
    var exports = {};
    var websocket;
    var wsUrl = "ws://echo.websocket.org/";
    
    
    /**
     * 初始化
     * @params id {string}: 給定 input[type='file'] 的 DOM ID
     * @params preview_id {string}: 給定顯示圖片的 DOM ID (支援<DIV>,<IMG>)
     *         若DOM 元素為<img> 則設定為 src
     *         若DOM 元素為<div> 則設定為 background-image
     */
    var init = exports.init = function init(callback) {
        websocket = new WebSocket(wsUrl);
        
        // 當連線建立時會被觸發的事件
        websocket.onopen = function (res) {
            //console.log("socket connect: " + res.timeStamp)
            writeToScreen("socket connect: " + res.timeStamp);
        };

       // 連線中斷時會被觸發的事件
        websocket.onclose = function (res) {
            //console.log("disconnected")
            writeToScreen("disconnected");
        };
        
        // 接收 Server 端傳過來的資訊
        websocket.onmessage = function (evt) {
            onMessage(evt)
        };
        
        // 接收錯誤時會被觸發的事件
        websocket.onerror = function (evt) {
            onError(evt)
        };
    }
    
    
    var writeToScreen = function writeToScreen(message) {
        var pre = document.createElement("p");
        pre.style.wordWrap = "break-word";
        pre.innerHTML = message;
        document.body.appendChild(pre);
    }
    
    
    var onMessage = function onMessage(evt) {
        writeToScreen('<span style="color:blue;">RESPONSE:'+evt.data+'</span>');
        //websocket.close();
    }
    
    
    var onError = function onError(evt) {
        writeToScreen('<span style="color:red;">ERROR:</span>' + evt.data);
    }
    
    
    var sendMessage = exports.sendMessage = function sendMessages(message) {
        writeToScreen("SENT: " + message);
        websocket.send(message);
    }
    
    return exports;
}