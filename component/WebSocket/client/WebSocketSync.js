

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
    var init = exports.init = function init (callback) {
        websocket = new WebSocket(wsUrl);
        websocket.onopen = function (res) {
            console.log("socket connect: " + res.timeStamp)
        };
    }
    
    
    
    return exports;
}