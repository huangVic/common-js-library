var globalObject = new Object();
globalObject.version_number = 270136;


// ################# getParams() ################
// Get Url Patameters;
// globalObject.params = getParams();
function getParams(){
    var parameters = location.search.substring(1).split("&");
    var i = 0;
    var args = new Object();
    for (var i = 0; i < parameters.length; i++) {

        var p = parameters[i].split("=");
        if(p[0] == "previous"){
            var pString = "";
            for (var j = 1; j < p.length; j++) {
                if(pString==""){
                    pString = p[j];
                }else{
                    pString = pString +"=" +p[j];
                }
            }
            args[p[0]] = pString;
        }else{
            args[p[0]] = p[1];
        }

    }
    return args;
}

globalObject.params = getParams();


// ################# AJAX API: get, post, put, delete  ################
// implement the Ajax API
/***
    var data = {
        name: keyword
    };
    globalObject.api.POST('/API/NestedList/', data, function(response) {
        if(response.success_text == 'ok'){
           console.log(response);
        }
    });

    globalObject.api.GET(url, null, function(res) {
        console.log(res);
    });
*/
var ajaxSettings = {
    dataType: 'json'
};
var api_req = function(path, callback, settings) {
    settings = (!settings) ? {} : settings;

    return $.ajax(
        $.extend({}, ajaxSettings, {
            url: path,
            type: (settings.type) ? settings.type : 'GET',
            success: callback,
            error: function(xhr, status, errorThrown) {
                var message = 'Unknown error. Please try again later.';
                switch (status) {
                    case 'timeout':
                        message = 'Server timeout. Please try again later.';
                        break;
                    case 'error':
                    case 'parsererror':
                        message = 'Server experienced some difficulty. Please try again later.';
                        break;
                    case 'abort':
                        message = 'Aborted.';
                        break;
                }
               // console.log(message);
            }
        }, settings));
};
globalObject.api = {
    GET: function(path, data, callback, settings) {
        path = path.replace(/^([^\/])/g, '/$1');
        settings = settings || {};
        data = data || {};
        // fixed ie ajax cache
        if (navigator.userAgent.indexOf("MSIE") != -1) {
            $.extend(settings, {cache: false});
        }
        //$.extend(data, {'lang': userLang});
        return api_req(
            path, callback, $.extend({
            type: 'GET',
            data: data
        }, settings));
    },
    POST: function(path, data, callback, settings) {
        path = path.replace(/^([^\/])/g, '/$1');
        settings = settings || {};
        data = data || {};
        //$.extend(data, {'lang': userLang});
        return api_req(
            path, callback, $.extend({
            type: 'POST',
            data: data
        }, settings));
    },
    PUT: function(path, data, callback, settings) {
        path = path.replace(/^([^\/])/g, '/$1');
        settings = settings || {};
        data = data || {};

        return api_req(
            path, callback, $.extend({
            type: 'PUT',
            data: data
        }, settings));
    },
    DELETE: function(path, data, callback, settings) {
        path = path.replace(/^([^\/])/g, '/$1');
        settings = settings || {};
        data = data || {};
        //$.extend(data, {'lang': userLang});
        return api_req(
            path, callback, $.extend({
            type: 'DELETE',
            data: data
        }, settings));
    }
};


// ################# Decet a mobile device  ################
// return true if the current useragent is a mobile browser
function isMobile(){
    var mobiles = new Array
            (
                "midp", "j2me", "avant", "docomo", "novarra", "palmos", "palmsource",
                "240x320", "opwv", "chtml", "pda", "windows ce", "mmp/",
                "blackberry", "mib/", "symbian", "wireless", "nokia", "hand", "mobi",
                "phone", "cdm", "up.b", "audio", "sie-", "sec-", "samsung", "htc",
                "mot-", "mitsu", "sagem", "sony", "alcatel", "lg", "eric", "vx",
                "NEC", "philips", "mmm", "xx", "panasonic", "sharp", "wap", "sch",
                "rover", "pocket", "benq", "java", "pt", "pg", "vox", "amoi",
                "bird", "compal", "kg", "voda", "sany", "kdd", "dbt", "sendo",
                "sgh", "gradi", "jb", "dddi", "moto", "iphone", "android",
                "iPod", "incognito", "webmate", "dream", "cupcake", "webos",
                "s8000", "bada", "googlebot-mobile"
            )
    var userAgent = navigator.userAgent.toLowerCase();
    var isMobile = false;
    for (var i = 0; i < mobiles.length; i++) {
        if (userAgent.indexOf(mobiles[i]) > 0) {
            isMobile = true;
            break;
        }
    }
    return isMobile;
}


// ################# Local Storage  ################
// defined local storage variable
globalObject.storage = {};
globalObject.localStorage = {
    add_item: function(item, value) {
        if (item === null || item === '') {
            return;
        }
        if (!window.localStorage) {
            return globalObject.storage[item] = value;
        }
        return localStorage.setItem(item, value);
    },
    get_item: function(item) {
        if (item === null || item === '') {
            return;
        }
        if (!window.localStorage) {
            return globalObject.storage[item] ? globalObject.storage[item] : '';
        }
        return localStorage.getItem(item) || '';
    },
    delete_item: function(item) {
        if (item === null || item === '') {
            return;
        }
        if (!window.localStorage) {
            return delete globalObject.storage[item];
        }
        return localStorage.removeItem(item);
    }
};



// ################# Load File  ################
function loadFile(filename, callback) {
    var xmlhttp = new XMLHttpRequest();
    var number = (!filename.match(/\?/gi) ? '?' : '&') + globalObject.version_number;
    xmlhttp.open('GET', filename + number);
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
            callback(xmlhttp.responseText);
    }
    xmlhttp.send();
}
// ################# Load js/css File  ################
// loadJsCssFile('app.js', 'js', callbck);
function loadjscssfile(filename, filetype, callbck){
    var number = (!filename.match(/\?/gi) ? '?' : '&') + globalObject.version_number;
    if (filetype == "js"){        //if filename is a external JavaScript file
        var fileref = document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename + number);
    }
    else if (filetype == "css"){  //if filename is an external CSS file
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename + number);
    }
    if (typeof fileref != "undefined"){
        if (callbck && callbck != 'undefined') {
           callbck();
        }
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }
}




// ################# Image resize  ################
function resizeImage(img, w, h){
    var offset = 0;
    for(var i=0;i<5;i++)
    {
        if (!img.natureWidth){
            var g = new Image();
            g.src = img.src;
            img.naturalWidth = g.width;
            img.naturalHeight = g.height;
        }
        else{
            break;
        }
    }

    if (w){img.width=w; }
    if (h){img.height=h;}
    $(img).css('height',h+'px');
    $(img).css('width',w+'px');
    $(img).css('margin-top',0+'px');
    $(img).css('margin-bottom',0+'px');
    $(img).css('margin-left',0+'px');
    $(img).css('margin-right',0+'px');
    var ns = img.naturalWidth/img.naturalHeight;
    var s  = img.width/img.height;
    if (!s || !ns){
        return;
    }
    if (ns > s){
        var newHeight = img.naturalHeight*( img.width/img.naturalWidth);
        $(img).css('margin-top',(offset+parseInt((h-newHeight)/2))+'px');
        $(img).css('margin-bottom',(offset+parseInt((h-newHeight)/2))+'px');
        $(img).css('height',newHeight+'px');
        $(img).css('width',w+'px');
        img.height = newHeight;
    }
    else {
        var newWidth =  img.naturalWidth*( img.height/img.naturalHeight);
        $(img).css('margin-left',parseInt(((w-newWidth)/2))+'px');
        $(img).css('margin-right',parseInt(((w-newWidth)/2))+'px');
        $(img).css('width',newWidth+'px');
        $(img).css('height',h+'px');
        img.width = newWidth;
    }
}

function pageSingleImageResize(images,width,height){
    //images.onload = function(){resizeImage(images, width,height );};
    //newDate = new Date();
    //images.src = images.src+"?"+newDate.getTime();
    var imagesTemp = images.src;
    images.src = "";
    images.src = imagesTemp;
}




// ################# load html template   ################
globalObject.loadHandlebarsTemplate = {
    locadCommonTemplate: function(id_name, file_name, callbck){
        console.log('load handlebars template ... start');
        if(!id_name){
            id_name = 'handlebars-common-template';
        }
        if(!file_name){
            file_name = 'handlebarsTemplate.xml';
        }
        $('<script>', {id: id_name}).appendTo('head').ready(function(){
                //var html = "handlebarsTemplate.xml";
                $("#" + id_name ).load(file_name, function(data){
                    console.log('load handlebars template ... success');
                    if (callback && typeof(callback) === "function") {
                        callback();
                    };
                });
        });
    },
    loadIdTemplate: function( id, dataSet){
        var html;
        if( $("#" + id).length > 0 ){
            var source = $("#" + id).html();
            var template = Handlebars.compile(source);
            html = template(dataSet);
        }
        return html;
    }

}



// ################# Math Random  ################
// The Math.random() function returns a floating-point, pseudo-random number in the range [0, 1) that is, from 0 (inclusive) up to but not including 1 (exclusive)
globalObject.mathRandom = {
    usefloor: function (min,max) {
          // Returns a random integer between min (included) and max (excluded)
          // # Math.floor 最接近的整數，小於數字本身的數
           return Math.floor(Math.random()*(max-min+1)+min);
    },
    useceil: function (min,max) {
       // The Math.ceil() function returns the smallest integer greater than or equal to a given number.
       // # Math.ceil 最接近的整數，大於數字本身的數
       return Math.ceil(Math.random()*(max-min+1)+min-1);
    },
    useround: function (min,max) {
       // The Math.round() function returns the value of a number rounded to the nearest integer
       // # Math.round 最接近的整數，如果有小數點，四捨五入
       return Math.round(Math.random()*(max-min)+min);
    }
}
