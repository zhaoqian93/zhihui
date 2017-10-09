var domain_url = 'http://smartapp.suntrans-cloud.com/';
var socket_host = 'ctdsyy.suntrans-cloud.com';
var socket_post = 6300;
var socket_post_slc10 = 6301;
var socket_post_slc6 = 6302;
var socket_post_sensus = 6303;

var socket_id = null;
var ws = null;
/*
101 //创建成功
102 //连接成功
103 //收到数据
201 //创建失败
202 //连接失败
203 //异常断开
204 //正常断开
205 //发生未知错误断开
*/



var version = 'v2';
var login_url = domain_url+'oauth/token';
var client_id = '1';
var client_secret = '009eb687a4fcafdabe991c320172fcc9';

var post_url = domain_url + 'api/'+version+'/';
//电单位
var unit_e = 'kW.h';
var unit_u = 'V';
var unit_i = 'A';
var unit_p = 'Kw';
var unit_pn = 'kvar';



var unit_temp = '°C';
var unit_shidu = '%Rh';
var unit_daqiya = 'kPa';
var unit_pm = 'ug/m³';
