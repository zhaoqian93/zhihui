function fix_android_ios(color) {
    switch (color) {
        case 'darkgray':
            color = "#303247"
            break;
        case 'black':
            color = "#ff6929"
            break;
        case 'white':
            color = "#FFFFFF"
            break;
        case 'green':
            color = "#01b980"
            break;
        default:
            color = color
    }
    api.setStatusBarStyle({
        style: 'light',
        color: color
    });
    var header = document.querySelector('header');
    $api.fixIos7Bar(header);
    $api.fixStatusBar(header);
}

//获取token
function get_token() {
    var access_token = $api.getStorage('access_token');
    if (access_token == null || access_token == undefined) {
        return null;
    }
    //验证token有效期

    return access_token;
}

//清除token
function clear_token() {
    $api.clearStorage();
}

//打开一个页面
function open_win(winname) {
    api.openWin({
        name: winname,
        url: './' + winname + '.html',
        delay: 200,
        allowEdit: true
    });
}

//关闭当前页面
function close_win(winname) {
    api.closeWin({
        name: winname
    });
}

function close_frame(frmname) {
    api.closeFrame({
        name: frmname
    });
}

//跳转登录
function toLogin() {
    api.openWin({
        name: 'login',
        url: './html/user/login.html',
        allowEdit: true
    })
}

//跳转登录
function toLogin2() {
    api.openWin({
        name: 'login',
        url: '../user/login.html',
        allowEdit: true
    })
}

//上传房间图片接口
function upImage() {
    api.openWin({
        name: 'option_image',
        url: '../option_image.html',
        //allowEdit: true
    })
}

//上传封面图片接口
function upImageCover() {
    api.openWin({
        name: 'cover_image',
        url: '../cover_image.html',
        //allowEdit: true
    })
}

//上传场景图片接口
function upImageScene() {
    api.openWin({
        name: 'scene_image',
        url: '../scene_image.html',
        //allowEdit: true
    })
}

function logout() {
    clear_token();
    toLogin();
    //close_win('win_index');
}

//获取随机数字
function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return (Min + Math.round(Rand * Range));
}

function closeSocket() {
    if (socket_id == null) return false;
    var socketManager = api.require('socketManager');
    socketManager.closeSocket({
        sid: socket_id
    }, function(ret, err) {
        if (ret.status) {
            //alert(JSON.stringify(ret));
        } else {
            //alert(JSON.stringify(err));
        }
    });
}



function connectSocket() {
    // 创建websocket
    ws = new WebSocket("ws://" + socket_host + ":" + socket_post);
    ws.onopen = function() {
        api.toast({
            msg: '通讯成功',
            duration: 500,
            location: 'middle'
        });
        //  api.hideProgress();
        // ws.send('{"type":"status","device_type":"newslc10"}');
    };
    ws.onmessage = onSocketMessage;
    ws.onclose = function() {
        api.toast({
            msg: '网络断开',
            duration: 2000,
            location: 'bottom'
        });
        // setTimeout("api.hideProgress();",1000);
        //connect();
    };
    ws.onerror = function() {
        api.toast({
            msg: '网络断开',
            duration: 2000,
            location: 'bottom'
        });
    };
}

/**
发送控制命令
*/

function funSwitchSlc(channel_id, device, dev_id, number, status) {
    var command = status == 1 ? 0 : 1;
    var send_data = ' { "device":"' + device + '", "action":"switch", "user_id":1, "device_id":' + dev_id + ' , "channel_id": ' + channel_id + ', "command": ' + command + '} ';
    //console.log(send_data)
    ws.send(send_data);
}

function funSwitchScene(scene_id) {

    var send_data = ' { "device":"scene", "scene_id":' + scene_id + '} ';
    //console.log(send_data)
    ws.send(send_data);
}

function getuserinfo() {
    api.ajax({
        url: post_url + "user/info",
        method: 'post',
        data: {
            values: {

            }
        },

        headers: {
            'Authorization': 'Bearer ' + $api.getStorage('access_token')
        },
    }, function(ret, err) {
        if (ret) {
            //console.log(JSON.stringify(ret));
            $api.setStorage('userinfo', ret.data);
        } else {
            //console.log(JSON.stringify(err));
        }
    });
}


// 随意切换按钮
function randomSwitchBtn(tag) {


    //console.log(token);
    if (token == null) {
        api.openWin({
            name: 'login',
            url: './html/user/login.html',
        });
        return true;
    }

    if (tag == $api.dom('#footer dib.aui-bar-tab-item.aui-active')) return;

    //console.log(1);

    var eFootLis = $api.domAll('#footer .aui-bar-tab-item'),
        //eHeaderLis = $api.domAll('header li'),
        index = 0;
    for (var i = 0, len = tablen; i < len; i++) {
        if (tag == eFootLis[i]) {
            index = i;
        } else {
            $api.removeCls(eFootLis[i], 'aui-active');
            //$api.removeCls(eHeaderLis[i], 'active');
        }
    }
    $api.addCls(eFootLis[index], 'aui-active');
    //$api.addCls( eHeaderLis[index], 'active');
    api.setFrameGroupIndex({
        name: 'home_group',
        index: index
    });
}

/**
 * [isDefine 判断值是否定义]
 * @param  {[string]}  value
 * @return {Boolean}
 */
function isDefine(value) {
    if (value == null || value == "" || value == "undefined" || value == undefined || value == "null" || value == "(null)" || value == 'NULL' || typeof(value) == 'undefined') {
        return false;
    } else {
        value = value + "";
        value = value.replace(/\s/g, ""); //全局匹配空白字符
        if (value == "") {
            return false;
        }
        return true;
    }
}

/**
 * [isJson 判断是否是json对象]
 * @param  {[object]}  obj [对象]
 * @return {Boolean}
 */
function isJson(obj) {
    var isJson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length;
    return isJson;
}

/**
 * [jsonToStr //json对象转字符串]
 * @param  {[object]}  j [json对象]
 * @return {[string]}    [json字符串]
 */
function jsonToStr(j) {
    return JSON.stringify(j);
}

/**
 * [strToJson json字符串转json对象]
 * @param  {[string]} s [json字符串]
 * @return {[object}    [json对象]
 */
function strToJson(s) {
    var json = eval('(' + s + ')');
    return json;
}

/**
 * [dotTpl doT模板获取数据]
 * @ hongwei
 * @param  {[type]} dotId  [相应数据的doT模板ID-必须]
 * @param  {[type]} htmlID [相应html的ID-必须]
 * @param  {[type]} data_  [ajax获取]
 * @return {[type]}        [description]
 * @link http://www.kancloud.cn/hongweizhiyuan/apicloud_function/274615
 */
function dotTpl(dotId, htmlID, data_) {
    var apendText = $api.byId(dotId).text;
    var fnapendText = doT.template(apendText);
    var html = fnapendText(data_);
    var list = $api.byId(htmlID);
    $api.html(list, html);
}

//显示模态加载
function showProgress() {
    api.showProgress({
        animationType: 'zoom',
        title: '努力加载中...',
        text: '先喝杯茶...',
        modal: true
    });
}

//隐藏模态加载
function hideProgress() {
    api.hideProgress();
}

//网络不好的情况下统一定义的错误
function netError(callback) {
    api.toast({
        msg: '网络不好,请稍后再试',
        duration: 2000,
        location: 'bottom'
    });
    if (isDefine(callback)) {
        callback();
    }
}

/**
 * [LoadImage 图片开启缓存]
 <img src="default.png" data-url="big_pic.jpg" onload="LoadImage(this)" class="aui-img-round" />
 * @param {[obj]} ele_ [当前元素]
 */
function LoadImage(ele_) {
    var imageURL = $api.attr(ele_, 'data-url');
    if (imageURL) {
        api.imageCache({
            url: imageURL
        }, function(ret, err) {
            if (ret.status) {
                ele_.src = ret.url;
                $api.removeAttr(ele_, 'data-url');
            }
        });
    }
}


/**
 * [ajax 封装api.ajax加入自定义HTTP请求头,以实现APP身份验证和模拟SESSION机制]
 * 使用方法与api.ajax完全一样
 * @author Baiyu
 * @param  {[object]} parmas        [参数对象]
 * @param  {[function]} callback    [回调函数]
 */
function ajax(params, callback) {
    if (!api) {
        console.log('只能运行在APICLOUD环境下');
        return false;
    }

    //返回所有http响应头信息
    var needReturnAll = false;
    if (params.returnAll) { //调用者需要返回所有结果
        needReturnAll = true;
    } else { //调用者不需要返回所有结果但系统需要
        params.returnAll = true;
    }

    //请求头加入APP身份识别码
    if (!params.headers) {
        params.headers = {};
    }
    params.headers.NEWAPPAUTH = api.getPrefs({
        sync: true,
        key: 'NEWAPPAUTH'
    });
    //请求头加入模拟SESSID
    var newSessId = api.getPrefs({
        sync: true,
        key: 'NEWSESSID'
    });
    if (newSessId) {
        params.headers.NEWSESSID = newSessId;
    }

    //发起ajax请求
    api.ajax(params, function(ret, err) {

        //未出错时处理response中的Set-Cookie,截取并保存到Prefs
        if (!err) {

            var headers = ret.headers;
            var statusCode = ret.statusCode;

            if (headers['Set-Cookie']) {

                var sessionArr = headers['Set-Cookie'].match(/NEWSESSID=[\w\d]+/g);
                for (var i in sessionArr) {

                    var data = sessionArr[i].split('=');
                    var sessionId = $api.trim(data[1]);

                    api.removePrefs({
                        key: 'NEWSESSID'
                    });
                    if (sessionId != 'deleted') {
                        api.setPrefs({
                            key: 'NEWSESSID',
                            value: sessionId
                        });
                    }
                }
            }

            //如果服务器返回201错误代码,表明需要重新登录,这里发送重新登录事件,index.html中会接收到并处理
            if (ret.error == 201) {

                api.removePrefs({
                    key: 'NEWSESSID'
                });
                api.sendEvent({
                    name: 'reLogin'
                });
                return false;
            }
        }

        var ret = !needReturnAll && !err ? ret.body : ret; //根据调用者是否需要返回所有结果来确定要返回ret还是ret.body

        callback.apply(this, [ret, err]);
    });
}

/**
 * [runAjax ajax函数封装]
 * @param   {[string]}   serverUrl   [服务器接口完整地址]
 * @param   {[object]}   data        [传输的json对象数据]
 * @param   {Function}   callback    [执行update_data函数来更新模板数据]
 * data 应为对象类型，不是的话方法中也会自动转换
 */
function runAjax(serverUrl, data, callback) {
    if (!isJson(data)) {
        data = strToJson(data);
    }
    //showProgress(); //加载模态
    ajax({
        url: serverUrl,
        method: 'post',
        timeout: 30,
        dataType: 'json',
        returnAll: false,
        headers: {
            'Authorization': 'Bearer ' + $api.getStorage('access_token')
        },
        data: data
    }, function(ret, err) {
        //hideProgress();
        api.refreshHeaderLoadDone();
        // alert($api.jsonToStr(err));
        if (ret) {
            callback(ret)
        } else {
          console.log($api.jsonToStr(err));
            //netError(); //请求失败
        }
    });
}
