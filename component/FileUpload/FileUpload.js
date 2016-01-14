

/**
 * 預覽圖片
 * 1. 在 Client 端先預先瀏覽即將要上傳的圖片, 確定後再將圖片上傳至 Server 端
 * 2. 使用 FileReader API 達到預覽效果
 * 3. 降低資料傳輸(以往將資料傳送到Server端產生了圖片網址後在回傳Client端)
 */

var FileUploadModule = function () {
    
    var exports = {};
    
    /**
     * 初始化
     * @params file_id {string}: 給定 input[type='file'] 的 DOM ID
     * @params preview_id {string}: 給定顯示圖片的 DOM ID (支援<DIV>,<IMG>)
     *         若DOM 元素為<img> 則設定為 src
     *         若DOM 元素為<div> 則設定為 background-image
     */
    var init = exports.init = function init ( file_id, preview_id) {
         console.log("action: init")
         if (typeof file_id != "string"){
             console.log("error: file_id not string")
             return;
         }
         
         if (typeof preview_id != "string"){
             console.log("error: preview_id not string")
             return;
         }
         
         var file_upload = document.getElementById(file_id);
         
         if (file_upload.tagName != "INPUT"){
             console.log("error: not INPUT")
             return;
         }
         
         // 註冊事件監聽
         file_upload.addEventListener("change", function() {
             preview(this, preview_id);
         })
    }
    
    
    /**
     * 預覽圖片
     * @params event {object}: 指定 input[type='file']的 this 物件
     * @params preview_id {string}: init中的 preview_id
     */
    var preview = exports.preview = function preview(event, preview_id) {
        console.log("action: preview")
        if (event.files.length > 0) {
            var preview = document.getElementById(preview_id);
            var file = event.files[0];
            
            
            // 記錄檔案資訊
            var fileInfo = {
                file_name: file.name, //檔名
                file_size_bytes: file.size, //檔案大小(bytes)
                file_type: file.type  //檔案類型
            }
            //console.log(" ============== ")
            //console.log("檔名: " + file.name)
            //console.log("大小: " + file.size)
            //console.log("類型: " + file.type)
            
            if (file && file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif") { 
                
                // 建立 FileReader 物件
                var reader = new FileReader();
                
                reader.onloadend = function (e) {
                    // 判斷 preview 的類別顯示圖片
                    if (preview.tagName == "DIV"){
                         preview.style.backgroundImage = "url('" + e.target.result + "')";
                    } else if (preview.tagName == "IMG"){
                        preview.src = e.target.result;
                    }
                    
                    // 檔案大小，把 Bytes 轉換為 KB
                    fileInfo.file_size_kb = format_float(e.total / 1024, 2);

                    // 將 fileInfo 暫存在 localStorage 供後續使用
                    fileInfo.base64 = e.target.result
                    localStorage.setItem("fileUploadResult", JSON.stringify(fileInfo))
                }
                reader.readAsDataURL(file);
            }
        }
        else {
            console.log("error: file not found")
        }
    }
    
    
    
    /**
     * 格式化
     * @params num {number}: 要轉換的數字
     * @params pos {number}: 指定小數幾位做四捨五入
     */
    var format_float = function format_float(num, pos) {
        var size = Math.pow(10, pos);
        return Math.round(num * size) / size;
    }
    
    return exports
}