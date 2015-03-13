var snp_mainPanel = null;

(function() {
    var tag = document.createElement('script');
    tag.src = "http://a.vimeocdn.com/js/froogaloop2.min.js";
    tag.id = "vimeo_embedded";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    var e = document.createElement('script'); e.async = true;
    e.id="dailyMotion_embedded";
    e.src = document.location.protocol + '//api.dmcdn.net/all.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(e, s);
}());

function VideoPlayerApi()
{
    var player;
    var type;
    var video_id;
    var start_time;
    var endTime;
    var tiSeek=0;
    var startToSend=-1;
    var forcePausePlayer;
    var playerStarted = false;
    var iFrameId='iframe_player';
    var rates;
    var this_ytplayer = this;
    var set_rate;

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        this_ytplayer.rates = player.getAvailablePlaybackRates();
        player.playerReady = true;
      //event.target.playVideo();
        var wrapper = document.getElementById('YTPlayer_wrapper');
        if(wrapper)
        {
            wrapper.style.visibility = 'visible';
            /*
            if (event.data==undefined || event.data<0){
                if (video_id!=undefined && video_id.length>0){
                    if (player!=undefined){
                        if (start_time != undefined && !is_touch_device()) {
                            if(!videoInfo.marketEmbed){
                                player.playVideo();
                                if(forcePausePlayer){
                                    player.pauseVideo();
                                }
                            }

                        }
                        else{
                            player.pauseVideo();
                            player.stopVideo();
                            if(!is_touch_device())
                                player.loadVideoById(video_id, start_time);
                        }
                    }
                }else{
                    player.stopVideo();
                }
            }
            */
        }

    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.

    function onPlayerStateChange(event) {
    //console.log(event);
        var buf;
      if (event.data == YT.PlayerState.PLAYING ) {
            /*buf=player.getVideoUrl();
            buf=getUrlParameter(buf,"v");
            if (buf!=undefined && buf.length>0){
                buf='videoId,'+buf+',duration,'+player.getDuration();
                postMessageToParent('startPlaying',buf);
            }*/
            player.setPlaybackRate(set_rate);
            if (start_time != undefined && playerStarted==false){
                if(is_touch_device())
                {
                    var timeout = (navigator.userAgent.indexOf('Android') <0)? 1000:3000;
                    player.pauseVideo();
                    setTimeout(function(){
                        player.seekTo(start_time);
                        player.playVideo();
//                      alert('seekTo:'+start_time);
                    }, timeout);
                }
                else
                    player.seekTo(start_time);
                playerStarted=true;
            }

      }
        if (event.data == YT.PlayerState.unstarted) {
            if (player!=undefined && video_id!=undefined && video_id.length>0){
                player.playVideo();
            }
        }
    //console.log(player);
    }
    function onPlayerError(errorCode) {
      console.log("An error occured of type:" , errorCode);
      if (globalObject.handleYoutubeError){
        globalObject.handleYoutubeError(errorCode);
      }
      //if (player!=undefined)
        //player.stopVideo();
    }
    function stopVideo() {
        if (player!=undefined)
            player.stopVideo();
    }
    this.player = undefined;

    this.init = function(playerDiv, args, callback)
    {
        this_ytplayer.rates = ["1"];
        forcePausePlayer = args.forcePause;
        if(args.type.toLowerCase() == "youtube"){
            this_ytplayer.rates = ["0.25", "0.5", "1", "1.25", "1.5", "2"];
            var YTPlayerDiv = document.createElement('div');
            YTPlayerDiv.id = 'YTPlayer_wrapper';
            playerDiv.appendChild(YTPlayerDiv);
            this.player = player = new YT.Player(YTPlayerDiv.id, {
                    width:'100%',
                    height:'100%',
                    USE_HTML5: 'true',
                    html5: '1',
                    mediaPlaybackRequiresUserAction: 'no',
                    videoId: args.video_id,
                    playerVars: {'autoplay': args.autoPlay, 'autohide': 0,'rel': 0, 'showinfo': 0, 'egm': 0, 'showsearch': 0, 'start': (args.startTime)?args.startTime:0, 'end':args.endTime, 'theme':'dark', 'wmode': (args.wmode)?args.wmode:'opaque'},
                    events: {
                      'onReady': onPlayerReady,
                      'onStateChange': onPlayerStateChange,
                            'onError' : onPlayerError
                    }
            });
            this.player.playerReady = false;
            type = args.type.toLowerCase();
            video_id = args.video_id;
            start_time = (args.startTime)?args.startTime: 0;
            endTime = args.endTime;
            set_rate = args.set_rate;

        }else if(args.type.toLowerCase() == "vimeo"){
            tiSeek=0;
            if(!args.startTime)
                playerDiv.innerHTML = '<iframe id="'+iFrameId+'" src="http://player.vimeo.com/video/' +args.video_id +'?api=1&player_id='+iFrameId+'&autoplay=' +((args.autoPlay==0)?0:1)+'" style="visibility:visible" width=100% height=100% frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
            else if(is_touch_device())
                playerDiv.innerHTML = '<iframe id="'+iFrameId+'" src="http://player.vimeo.com/video/' +args.video_id +'?api=1&player_id='+iFrameId+'&autoplay=' +((args.autoPlay==0)?0:1)+'" style="visibility:visible" width=100% height=100% frameborder="0" ></iframe>';
            else{
                playerDiv.innerHTML = '<iframe id="'+iFrameId+'" src="http://player.vimeo.com/video/' +args.video_id +'?api=1&player_id='+iFrameId+'&autoplay=' +((args.autoPlay==0)?0:1)+'" style="visibility:visible" width=100% height=100% frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
            }
            function vimeoOnload(){


                // When the player is ready, add listeners for pause, finish, and playProgress

                var f = $('iframe');
                player.playerReady = true;
                $f(iFrameId).addEvent('pause', function(){
                    var f = $('iframe');
                    $f(iFrameId).element.playerState = 2;
                });
                $f(iFrameId).addEvent('finish', function(){
                    var f = $('iframe');
                    $f(iFrameId).element.playerState = 0;
                });
                $f(iFrameId).addEvent('playProgress', function(){
                    var f = $('iframe');
                    $f(iFrameId).element.playerState = 1;

                });


                if(args.startTime != 0){
                    setTimeout(function(){
                        if(args.startTime && !is_touch_device()){
                            $f(iFrameId).api("seekTo", args.startTime);
                        }
                    }, 1000);
                }
            }

            this.player = player = $('#' +iFrameId);
            this.player.cmd = this.cmd;
            this.player.playerReady = false;
            this.player.getPlayerState = function(){
                var f = $('iframe');

                return $f(iFrameId).element.playerState;
            }
            var playerIframe = document.getElementById(iFrameId);
            if (playerIframe.attachEvent) {
                playerIframe.attachEvent('onload',vimeoOnload);
            }else{
                playerIframe.onload = vimeoOnload;
            }


            type = args.type.toLowerCase();
            video_id = args.video_id;
            start_time = (args.startTime)?args.startTime: 0;
            endTime = args.endTime;
        }else if(args.type.toLowerCase() == "dailymotion"){
            var DMPlayerDiv = document.createElement('div');
            DMPlayerDiv.id = 'DMPlayer_wrapper';
            playerDiv.appendChild(DMPlayerDiv);
            var PARAMS = {
                autoPlay : args.autoPlay,
                start: args.startTime,
                html:true
            }
            this.player = player = DM.player("DMPlayer_wrapper", {video: args.video_id, width: '100%', height: '100%', params:PARAMS});
            this.player.playerState = false;
            type = args.type.toLowerCase();
            video_id = args.video_id;
            start_time = (args.startTime)?args.startTime: 0;
            endTime = args.endTime;

            this.player.getPlayerState = function(){

                return this.playerState;
            }
            this.player.addEventListener("apiready", function(e)
            {

                this.playerReady = true;
                //e.target.play();

            });
            this.player.addEventListener("play", function(e)
            {
                /*
                var player = this;

                if(args.startTime != 0){
                    setTimeout(function(){
                        if(args.startTime && !is_touch_device()){
                            player.api("seek", args.startTime);
                        }
                    }, 300);
                }*/

            });
            this.player.addEventListener("playing", function(e)
            {
                this.playerState = 1;
            });
            this.player.addEventListener("pause", function(e)
            {
                this.playerState = 2;
            });
            this.player.addEventListener("ended", function(e)
            {
                this.playerState = 0;
            });
        }


        if (callback && typeof(callback) === "function") {
               callback();
        };
    }

    this.cmd = function(cmd, msg, extension){


        if(type == "youtube"){
            if(!player.playerReady){

                return;
            }
            if (cmd == 'setVideoId'){
                endTime = undefined;
                video_id = msg;
                var old_video_id = '';
                if (player.getVideoUrl!=undefined){
                    var url = player.getVideoUrl();
                    old_video_id = getUrlParameter(url, "v");
                }
                if (video_id.length > 0 && old_video_id != video_id){
                    if (player.stopVideo!=undefined)
                        player.stopVideo();
                    if (player.pauseVideo!=undefined)
                        player.pauseVideo();
                    if (player.loadVideoById!=undefined)
                    {
                        playerStarted = extension.playerStarted;
                        if(extension && extension.startTime)
                        {
                            start_time = extension.startTime;
                            player.loadVideoById(video_id, start_time);
                        }
                        else
                        {
                            start_time = 0;
                            player.loadVideoById(video_id);
                        }


                        if(extension && extension.endTime)
                            endTime = extension.endTime;
                    }
                }else if (video_id.length > 0){
                    player.playVideo();
                }
            }else if (cmd == 'play/pause'){
                if (player.getPlayerState()==1)
                    player.pauseVideo();
                else if (player.getPlayerState()!= - 1 && player.getPlayerState() != YT.PlayerState.CUED)
                player.playVideo();
            }else if (cmd == 'play'){
                if (player.getPlayerState()!= - 1 && player.getPlayerState() != YT.PlayerState.CUED)
                    player.playVideo();
            }else if (cmd == 'pause'){
                player.pauseVideo();
            }else if (cmd == 'stop'){
                player.stopVideo();
                try{
                    player.destroy();
                }catch(e){
                    console.log('destroy player failed');
                }
                player = null;
            }else if (cmd == 'getCurrentTime'){
                //return player.getCurrentTime();
                var currentTime = player.getCurrentTime();
                try{
                    editFormHandleMessage('eForm,getCurrentTime,'+currentTime);
                }catch(e){

                }

                return currentTime;
            }else if (cmd == 'seek' && msg!= undefined && msg >= 0 && msg <= player.getDuration()){
                startToSend = msg;
                player.pauseVideo();
                if (tiSeek>=0){
                    clearInterval(tiSeek);
                    tiSeek=0;
                }
                tiSeek=setTimeout(function(){

                    if (player && player.getPlayerState()!= - 1 && player.getPlayerState() != YT.PlayerState.CUED)
                    {
                        player.seekTo(startToSend,true);
                        player.playVideo();
                    }
                },500);
            }else if (cmd == 'cue' && msg){
                var cmdArray = msg.split(":::");

                // It should be VideoID:::StartTime
                if (cmdArray.length != 2)
                    return;

                var videoId = cmdArray[0];
                var startTime = cmdArray.length != 3 ? 0 : cmdArray[1];
                player.cueVideoById(videoId, startTime);
                player.playVideo();
            }else if(cmd == 'getAvailablePlaybackRates'){
                return player.getAvailablePlaybackRates();
            }else if(cmd == 'setPlaybackRate'){
                if(msg == undefined){
                    msg = '1';
                }
                if(set_rate == msg){
                    return;
                }
                set_rate = msg;
                player.setPlaybackRate(msg);
            }
        }else if(type == "vimeo"){
            var f = $('iframe');
            if(cmd == 'seek'){
                playerObject.startTimeSec = undefined;
                var value = parseInt(msg);
                $f(iFrameId).api("seekTo", value);
                $f(iFrameId).api('play');
            }else if(cmd == 'pause'){
                $f(iFrameId).api('pause');
            }else if(cmd == 'play'){
                $f(iFrameId).api('play');
            }else if(cmd == 'stop'){
                //$f(iFrameId).api('unload');
                $('#'+iFrameId).remove();
            }else if(cmd == 'getCurrentTime'){

                $f(iFrameId).api(cmd, function(value){
                    tiSeek = value;

                });
                if(endTime && endTime <= (tiSeek+1)){
                    $f(iFrameId).api('pause');
                }
                return ((tiSeek==0)?0:(tiSeek +1));
            }else if(cmd == 'getAvailablePlaybackRates'){
                return [1];
            }else if(cmd == 'setPlaybackRate'){
                return;
            }

        }else if(type == "dailymotion"){
            if(!player){
                return;
            }
            if(cmd == 'seek'){
                var value = parseInt(msg);
                player.api("seek", value);
            }else if(cmd == 'pause'){
                player.api('pause');
            }else if(cmd == 'play'){
                player.api('play');
            }else if(cmd == 'stop'){
                player.api('pause');
            }else if(cmd == 'getCurrentTime'){
                var value = player.currentTime;
                if(endTime && parseInt(endTime) <= value){
                    player.api('pause');
                }
                return value;
            }else if(cmd == 'getAvailablePlaybackRates'){
                return [1];
            }else if(cmd == 'setPlaybackRate'){
                return;
            }

        }
    }
}

function TimelinePlayer()
{
    var player_timer;
    var player_second = 0;;
    var player_state = 'pause';
    var player_duration;
    var player_id;

    this.init = function(playerDiv, args){
        var playerObject = document.getElementById('Timeline_Videoarea').cloneNode(true);
        playerObject.id = args.iframeId;
        player_id = playerObject.id;
        $(playerObject).find('.titleArea').html(args.videoTitle);
        $(playerObject).find('.introduction').html(args.introduction);
        $(playerObject).find('.total_time_number').html(convertIntToTimeString(args.totalLength));
        $(playerObject).find('.videoImage').attr('src', args.coverImage);
        playerDiv.appendChild(playerObject);
        player_second = args.startTime;
        player_state = 'play';
        player_duration = args.totalLength;

        player_timer = setInterval(function(){
            if(player_state == 'play')
                player_second++;
            if(player_second >= player_duration)
                player_state = 'pause';
        }, 1000);

    }

    this.getPlayerState = function(){
        return player_state;
    }

    this.getCurrentTime = function(){
        return player_second;
    }

    this.cmd = function(cmd, msg, extension){
        if (cmd == 'play'){
            player_state = 'play';
        }else if (cmd == 'pause'){
            player_state = 'pause';
        }else if (cmd == 'stop'){
            if(player_timer)
                clearInterval(player_timer);
        }else if (cmd == 'seek' && msg!= undefined && msg >= 0 && msg <= player_duration){
            player_second = msg;
            player_state = 'play';
        }else if(cmd == 'setVideoId'){
            $('#'+player_id).find('.titleArea').html(extension.videoTitle);
            $('#'+player_id).find('.introduction').html(extension.introduction);
            $('#'+player_id).find('.total_time_number').html(convertIntToTimeString(extension.totalLength));

            if(extension.coverImage)
                $('#'+player_id).find('.videoImage').attr('src', extension.coverImage);
            if(extension.startTime)
                player_second = extension.startTime;
            else
                player_second = 0;
        }

    }
}
function EmbeddedPlayer()
{
    var reservedWidth;
    var reservedHeight;
    var iFrameId='iframe_player';
    var videoType;
    var movie_code;
    var playerObject;
    var playerDiv;
    var status_timer;
    var timerCallback;
    var initArgs;
    var self = this;

    // Wrap all of player control into an object.
    // This will help other caller to decouple with EmbeddedPlayer.
    var controller =
    {
        play: function() { self.cmd('play'); },
        pause:function() { self.cmd('pause'); },
        stop: function() { self.cmd('stop'); },
        seek: function(seekTimeInSeconds) { self.cmd('seek', seekTimeInSeconds); },
        cue:  function(cueInfo) { self.cmd('cue', cueInfo); }
    };

    // Make EmbeddedPlayer as a publisher to publish playback status and playback controller.
    makePublisher(this, function()
    {
        // This function will be called when any object subscribe EmbeddedPlayer.
        // EmbeddedPlayer will tell the subscriber it is ready to control the playback.
        self.publish("VideoPlayerReady", controller);
    });

    function getYoutubeShowRect()
    {
        var w=document.body.clientWidth;
        var h=document.body.clientHeight;
        var r=[0,0,w/2.5,h/3];
        var windowRatio = 16/10;
        var oVideoPlayer = document.getElementById("VideoPlayer_container");

        if(w/h > windowRatio)
            windowRatio = 18/10;

        //reservedWidth  = parseInt(w*4/7) - 20;
        reservedHeight = parseInt((h-20)/1.9) / ((h>w)?1.5:1);
        reservedWidth = reservedHeight * windowRatio;

        if (isPhone()){
            if (w<h){
                reservedWidth=w-50; reservedHeight=w*2/4;
                if (reservedHeight> h/2) reservedHeight= h/2;
            }
            else {reservedHeight=h; reservedWidth = reservedHeight;}
        }
        r[2]=Math.floor(reservedWidth);
        r[3]=Math.floor(reservedHeight);
        r[0]=Math.floor(w*0.01);
        r[1]=Math.floor(h*0.01 +5);

        if (getNoteEditor() && getNoteEditor().style.display != 'none'){
            var videoArea = getNoteEditor().getElementsByClassName('videoWrapper')[0];
            r[2] = videoArea.offsetWidth;
            r[3] = videoArea.offsetHeight;

            if(!snp_mainPanel || !globalObject.bobitagApi)
            {
                var ret = getAbsoluteOffsetXY(videoArea);
                r[0] = (oVideoPlayer)?ret[0]:0;
                r[1] = (oVideoPlayer)?ret[1]:0;

                if(oVideoPlayer)
                    r[1] -= g_popup.items.items[0].element.dom.offsetHeight; //popup toolbar
            }
            else
            {
                var ret = getAbsoluteOffsetXY(videoArea, 'NoteEditor_container');
                r[0] = (oVideoPlayer)?ret[0]:0;
                r[1] = (oVideoPlayer)?ret[1]:0;
            }
        }
        else
        {
            var notePopupHeight = ((!globalObject.bobitagApi)?120:40);
            r[0] = 0;
            r[1] = 0;

            var oContainer = document.getElementById('VideoPlayer_container');
            if(!oContainer)
                return null;

            var oVideoArea = oContainer.getElementsByClassName("videoArea")[0];
            r[2] = Math.floor(oVideoArea.offsetWidth);
            r[3] = Math.floor(oVideoArea.offsetHeight);
            r[1] = 0;


            reservedWidth = r[2];
            reservedHeight = r[3];
        }

        return r;
    }

    this.publishPlaybackInfo = function(curTime)
    {
        var playbackInfo =
        {
            currentTime: curTime,
            totalTime: videoInfo.totalLength,
            videoId: videoInfo.videoId,
            trackId: videoInfo.trackId,
            videoType: videoType,
            playerState: videoInfo.playerState ? videoInfo.playerState : ""
        };
        self.publish("VideoPlayerPlaybackInfo", playbackInfo);
    }

    function timerSendStatus()
    {
        if(!playerObject)
            return;

        var time;

        if(videoType != 'vimeo')
        {
            if(videoType == 'Youtube')
            {
                if(playerObject.player.getCurrentTime == undefined)
                    return;
                var playerState = playerObject.player.getPlayerState();
                if(playerState == YT.PlayerState.PAUSED)
                    videoInfo.playerState = 'pause';
                else if(playerState==YT.PlayerState.BUFFERING||playerState==YT.PlayerState.ENDED)
                    videoInfo.playerState = 'pause';
                else
                    videoInfo.playerState = 'play';


                time = playerObject.player.getCurrentTime();
                videoInfo.totalLength = playerObject.player.getDuration();

            }
            else if(videoType == 'Timeline')
            {
                if(playerObject.getPlayerState() == 'pause')
                    videoInfo.playerState = 'pause';
                else if(!playerObject.paused)
                    videoInfo.playerState = 'play';
                time = playerObject.getCurrentTime();
            }
            else
            {
                if(playerObject.paused)
                    videoInfo.playerState = 'pause';
                else if(!playerObject.paused)
                    videoInfo.playerState = 'play';
                time = playerObject.currentTime;
            }
            if(globalObject.userAgent != "MSIE 8.0"){
                self.publishPlaybackInfo(time);
            }

            if(timerCallback)
                timerCallback(time);
        }
        else
        {
            if($f != undefined)
            {
                $f(iFrameId).api("paused", function(paused){
                    videoInfo.playerState = paused ? 'pause' : 'play';
                });
                $f(iFrameId).api("getCurrentTime", function(value){
                    time = value;
                    // compare current time & tag end time, if end time reached, pause the video
                    var intTime = Math.floor(value);
                    if (intTime==videoInfo.endTime)
                        $f(iFrameId).api('pause');
                    if(videoType == 'vimeo' && playerObject.startTimeSec && parseFloat(value) > 0.5)
                    {
                        setTimeout(function(){
                            self.cmd("seek", playerObject.startTimeSec);
                            playerObject.startTimeSec = undefined;
                        }, 500);
                    }
                    if(globalObject.userAgent != "MSIE 8.0"){
                        self.publishPlaybackInfo(time);
                    }
                    if(timerCallback)
                        timerCallback(time);
                });
            }
        }

    }

    this.initialized = false;


    this.init = function(parent, args)
    {
        if(!this.initialized)
        {

            if(args && args.timerCallback)
                timerCallback = args.timerCallback;
            if(args)
            {
                initArgs = args;
                movie_code = args.videoId;
            }


            var r = getYoutubeShowRect();
            if(r == null)
                return;

            playerDiv = document.createElement("div");
            playerDiv.id = 'myPlayer';
            parent.appendChild(playerDiv);

            var w, h;

            w = r[2];
            h = r[3];
            playerDiv.style.position="absolute";
            //o.style.display = 0;

            if(r[2] < r[3])
            {
                playerDiv.style.width = '100%';

                var newH = Math.floor(r[2] * 9 / 16);
                playerDiv.style.height = newH + 'px';
                playerDiv.style.top = ((r[3] - newH) / 2) + 'px';
            }
            else if(!snp_mainPanel || getNoteEditor())
            {
                playerDiv.style.left = r[0]+'px';
                playerDiv.style.top = r[1]+'px';
                playerDiv.style.width  = r[2]+'px';
                playerDiv.style.height = r[3]+'px';
            }
            else
            {
                playerDiv.style.width = '100%';
                playerDiv.style.height = '100%';
            }
            //o.style.zIndex = 2000;
            playerDiv.style.overflow = "hidden";
            playerDiv.style.background = "black";
            playerDiv.style.overflow= "hidden";
            playerDiv.style.overflowY= "hidden";
            //Switch different VOD player here

            videoType = args.type;
            if(videoType == undefined)
                videoType = 'Youtube';

            if (videoType=='RealtekVOD' || videoType == 'iii_VOD') {

                var vodurl;
                if(videoType=='RealtekVOD')
                    vodurl = "http://dmp.realtek.com/vod/php/";
                else
                    vodurl = "https://www.vod.org.tw/vod/php/";

                playerDiv.innerHTML = '<iframe id="'+iFrameId+'" src="' + vodurl +'ivod.html?start='+args.startTime+'&wmode=opaque" width=100% height=100% style="display:block;border:0px;" wmode="Opaque"></iframe>';
                playerObject = document.getElementById(iFrameId);

            }else if(videoType == 'Local' || videoType == 'Facebook' || videoType == "bTube"){
                playerDiv.innerHTML = '<video id='+iFrameId+' width="'+w+'" height="'+h+'" controls autoplay name="media">' +
                                '<source src="'+args.videoUrl+'">' +
                              '</video>';
                playerObject = document.getElementById(iFrameId);
                playerObject.addEventListener('loadedmetadata', function() {
                    this.currentTime = args.startTime;
                    videoInfo.totalLength = this.duration;
                    videoInfo.totalLength = this.duration;
                    status_timer = setInterval(timerSendStatus,1000);
                }, false);

            }else if(videoType == "vimeo"){

              var tag = document.createElement('script');
              tag.src = "http://a.vimeocdn.com/js/froogaloop2.min.js";
              tag.id = "vimeo_embedded";
              var firstScriptTag = document.getElementsByTagName('script')[0];
              firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);



                if(!args.startTime)
                    playerDiv.innerHTML = '<iframe id="'+iFrameId+'" src="http://player.vimeo.com/video/' +args.videoId +'?api=1&player_id='+iFrameId+'&autoplay=1" style="visibility:visible" width=100% height=100% frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
                else if(is_touch_device())
                    playerDiv.innerHTML = '<iframe id="'+iFrameId+'" src="http://player.vimeo.com/video/' +args.videoId +'?api=1&player_id='+iFrameId+'&autoplay=0" style="visibility:visible" width=100% height=100% frameborder="0" ></iframe>';
                else{
                    playerDiv.innerHTML = '<iframe id="'+iFrameId+'" src="http://player.vimeo.com/video/' +args.videoId +'?api=1&player_id='+iFrameId+'&autoplay=1" style="visibility:visible" width=100% height=100% frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';
                }
                function vimeoOnload(){

                    setTimeout(function(){
                        if(args.startTime && !is_touch_device())
                            $f(iFrameId).api("seekTo", args.startTime);
                        status_timer = setInterval(timerSendStatus,1000);
                    }, 1000);
                }
                var playerIframe = document.getElementById(iFrameId);
                if (playerIframe.attachEvent) {
                    playerIframe.attachEvent('onload',vimeoOnload);
                }else{
                    playerIframe.onload = vimeoOnload;
                }

                /*function ready(player_id) {
                    playerObject = $f(player_id);
                }
                window.addEventListener('loadedmetadata', function() {
                    //Attach the ready event to the iframe
                    $f(document.getElementById(iFrameId)).addEvent('ready', ready);
                });*/
                //playerObject = $f(iFrameId);
                playerObject = document.getElementById(iFrameId);
                if(is_touch_device() && args.startTime)
                    playerObject.startTimeSec = args.startTime;

            }
            else if(videoType == 'Timeline')
            {
                var params = {
                    'videoTitle': args.videoTitle,
                    'startTime': args.startTime,
                    'coverImage': args.coverImage,
                    'totalLength': args.totalLength,
                    'introduction': args.introduction,
                    'iframeId': iFrameId
                };
                playerObject = new TimelinePlayer();
                playerObject.init(playerDiv, params);
                status_timer = setInterval(timerSendStatus,1000);
            }
            else
            {
                /*var timeText = '&start='+args.startTime;
                if(args.endTime)
                    timeText += '&end='+args.endTime;
                playerDiv.innerHTML = '<iframe id="'+iFrameId+'" src="ClipNotePlayer/youtube.html?w='+(w)+timeText+'&h='+(h)+'&v='+args.videoId+'" style="visibility:visible;margin-left:0em;margin-right:0em;" align="center" width="100%" height="100%" frameborder=0 scrolling="no" align="middle"></iframe>';
                // get playback info
                $.getJSON("http://gdata.youtube.com/feeds/api/videos/" + args.videoId +"?v=2&alt=jsonc");*/
                var params = {
                    'width': w,
                    'height': h,
                    'video_id': args.videoId,
                    'startTime': args.startTime,
                    'endTime': args.endTime,
                    'forcePause': args.forcePause,
                    'wmode': args.wmode,
                    'marketEmbed':args.marketEmbed
                };
                var forcePause;
                if(args && args.forcePause)
                    forcePause = args.forcePause;
                playerObject = new YoutubePlayer(forcePause);
                playerObject.init(playerDiv, params, function(){
                    status_timer = setInterval(timerSendStatus,1000);
                });


            }

            this.initialized = true;
        }

    }

    this.show = function(forcePlay)
    {
        if(!playerDiv)
            return;

        var r = getYoutubeShowRect();
        if(r == null)
            return;

        playerDiv.style.position="absolute";
        playerDiv.style.left = r[0]+'px';
        playerDiv.style.top = r[1]+'px';

        if(r[2] < r[3])
        {
            playerDiv.style.width = '100%';

            var newH = Math.floor(r[2] * 9 / 16);
            playerDiv.style.height = newH + 'px';
            playerDiv.style.top = ((r[3] - newH) / 2) + 'px';
        }
        else if(!snp_mainPanel || getNoteEditor())
        {
            if(playerDiv.parentElement)
                r[1] -= playerDiv.parentElement.offsetTop;
            playerDiv.style.top = r[1]+'px';
            playerDiv.style.width  = r[2]+'px';
            playerDiv.style.height = r[3]+'px';
        }
        else
        {
            playerDiv.style.width = '100%';
            playerDiv.style.height = '100%';
            playerDiv.style.top = '0';
        }

        /*if (!isAppleBrowser()){
            o.style.display = "block";
        }*/
        //if (isAppleBrowser()){
        if(videoType != 'Youtube' && videoType != 'vimeo')
        {
            playerDiv.style.visibility = "visible";

            var buf=parseInt(r[2])+','+ parseInt(r[3]);
            this.cmd('setSize',buf);
        }

        if (forcePlay==true){
            this.cmd("play");
        }
    }

    this.hide = function()
    {
        if(!playerDiv)
            return;

        this.cmd("pause");

        playerDiv.style.position="absolute";
        if (isAppleBrowser()){
            playerDiv.style.top = "0";
            playerDiv.style.left = "0";
            playerDiv.style.width = "1px";
            playerDiv.style.height = "1px";

            var buf= 0 +','+ 0;
            this.cmd('setSize',buf);
        }
        else {
            if(videoType != 'Youtube' && videoType != 'vimeo')
                playerDiv.style.visibility = "hidden";
            else
            {
                playerDiv.style.top = "0";
                playerDiv.style.left = "0";
                playerDiv.style.width = "1px";
                playerDiv.style.height = "1px";
                //o.style.display = "none";
            }
        }
    }

    this.stop = function()
    {
        this.cmd('stop');
        $(playerDiv).remove();
        playerDiv = null;
        $('#vimeo_embedded').remove();
        if(status_timer)
            clearInterval(status_timer);
        this.initialized = false;
    }

    this.setZIndex = function(value)
    {
        if(playerDiv)
            playerDiv.style.zIndex = value;
    }

    this.isShow = function()
    {
        if(playerDiv && playerDiv.style.visibility == 'hidden')
            return 0;
        else if(playerDiv && (playerDiv.clientWidth>1 && playerDiv.clientHeight>1))
            return 1;
        return 0;

    }

    this.cmd = function(cmd,msg)
    {
        var value,el;
        if((videoInfo.playMode &&
            (videoInfo.playMode == 'PlayToTv' || videoInfo.playMode == 'JoinToTv'))
            && !this.isShow())
        {
            var val = cmd+':'+msg+':'+(new Date()).getTime();
            if (playToTV && playToTV.webSync && playToTV.webSync.current)
                playToTV.webSync.current.exec("postMessage", {"clientID": "host", "key":"control", "value":val}, null);
            return;
        }

        if (!this.initialized || !playerObject){
            return;
        }

        if(videoType == 'Facebook' || videoType == "bTube")
        {
            if(cmd == 'play/pause')
            {
                if(playerObject.paused)
                    playerObject.play();
                else
                    playerObject.pause();
            }
            else if(cmd == 'play')
            {
                if(playerObject.paused)
                    playerObject.play();
            }
            else if(cmd == 'pause')
            {
                if(!playerObject.paused)
                    playerObject.pause();
            }
            else if(cmd == 'getCurrentTime')
            {
                editFormHandleMessage('eForm,'+cmd+','+playerObject.currentTime);
            }
            else if(cmd == 'seek')
            {
                playerObject.currentTime = parseInt(msg);
            }
            else if(cmd == 'setSize')
            {
                var pTok = msg.split(',');
                playerObject.width = pTok[0];
                playerObject.height = pTok[1];
                //playerObject.play();
            }
        }
        else if(videoType == "vimeo"){
            var f = $('iframe');
            url = f.attr('src').split('?')[0];
            var data;

            /*if(cmd == 'seek'){
                data = { method: "seekTo" };
                var value = parseInt(msg);
                if (value) {
                    data.value = value;
                }
            }else if(cmd == 'pause'){
                data = { method: "pause" };
            }else if(cmd == 'play'){
                data = { method: "play" };
            }else if(cmd == 'addEventListener'){
                data = { method: "addEventListener" };
                if (msg) {
                    data.value = msg;
                }
            }
            if(data != undefined)
                f[0].contentWindow.postMessage(JSON.stringify(data), url);*/

            //if(cmd == 'getCurrentTime')

            if(cmd == 'seek'){
                playerObject.startTimeSec = undefined;
                var value = parseInt(msg);
                $f(iFrameId).api("seekTo", value);
                $f(iFrameId).api('play');
            }else if(cmd == 'pause'){
                $f(iFrameId).api('pause');
            }else if(cmd == 'play'){
                $f(iFrameId).api('play');
            }else if(cmd == 'stop'){
                //$f(iFrameId).api('unload');
                $('#'+iFrameId).remove();
            }else if(cmd == 'getCurrentTime'){
                $f(iFrameId).api(cmd, function(value){
                    editFormHandleMessage('eForm,getCurrentTime,'+value);
                });
            }






        }
        else if(videoType == 'Youtube' || videoType == 'Timeline')
        {
            playerObject.cmd(cmd, msg);
        }
        else if(videoType == 'RealtekVOD' || videoType == 'iii_VOD')
        {
            if (cmd!=undefined && cmd.length>0)
                value="localPostMessage:ivod,"+cmd+','+msg;
            else
                value="localPostMessage:ivod,noCmd,"+msg;
            playerObject.contentWindow.postMessage(value, "*");
        }

    }
    this.loadVideo = function(movieCode, args)
    {
        timerCallback(0);

        if(videoType != args.type || args.type == 'vimeo')
        {
            if(!document.getElementById('myPlayer'))
                return;

            var parent = document.getElementById('myPlayer').parentElement;

            this.stop();

            initArgs.type = args.type;
            initArgs.startTime = args.startTime;
            initArgs.endTime = args.endTime;
            initArgs.videoId = movieCode;
            this.init(parent, initArgs);
        }
        if(videoType == 'Youtube' || videoType == 'Timeline')
        {
            playerObject.cmd('setVideoId', movieCode, args);
        }
        movie_code = movieCode;
    }
    this.getVideoId = function()
    {
        return movie_code;
    }
}



function is_touch_device() {
   return !!('ontouchstart' in window);
}