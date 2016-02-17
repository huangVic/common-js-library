
var socketSync = new WEBSOCKETSYNC();
socketSync.init()




function start(){
    
    var input = document.getElementById("inputText")
    
    document.body.addEventListener('keyup', function(e) {
        if (e.keyCode == 13){
            if (input.value != ""){
                socketSync.sendMessage(input.value)
                console.log("input.value: " + input.value)
                input.value = "";
            }
        }
    });
    
}



window.addEventListener("load", start, false);


