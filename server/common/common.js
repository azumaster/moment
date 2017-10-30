const multer = require('koa-multer');
const crypto = require('crypto');

// 三目运算
let unary = (value, instance) => {
    return value?value:instance;
};

// 获取当前的时间
let getNow = ()=>{
    let date = new Date(),
        year = date.getFullYear(),
        month = (date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1,
        day = date.getDate()<10?'0'+date.getDate():date.getDate(),
        hour = date.getHours()<10?'0'+date.getHours():date.getHours(),
        minute = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes(),
        second = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();

    return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
};

// 获取当天
let getToday = ()=>{
    let date = new Date(),
        year = date.getFullYear(),
        month = (date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1,
        day = date.getDate()<10?'0'+date.getDate():date.getDate();

  return year+month+day;
};

// 解析mongodb的时间
let getDateTime = (dateTime)=>{
    let current = new Date(dateTime);

    let date = current.getFullYear()+'-'+(current.getMonth()+1<10?'0'+(current.getMonth()+1):current.getMonth()+1)+'-'+(current.getDate()<10?'0'+current.getDate():current.getDate());
    let time = (current.getHours()<10?'0'+current.getHours():current.getHours())+':'+(current.getMinutes()<10?'0'+current.getMinutes():current.getMinutes())+':'+(current.getSeconds()<10?'0'+current.getSeconds():current.getSeconds());

    return date+' '+time;
};

// 配置文件上传
let configUpload = multer.diskStorage({
  // 文件保存路径
  destination: function (req, file, cb) {
    cb(null, './dist/img/blogCover/');
  },
  // 修改文件名称
  filename: function (req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, getToday()+'C'+Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});

// 随机6位数
let randomSix = ()=>{
    let num="";
    for(let i=0;i<6;i++)
    {
        num+=Math.floor(Math.random()*10);
    }

    return num;
};

// 获取短信SIG
function getSmsSig(rand, curTime, phoneNumbers) {
    var phoneNumberStr = phoneNumbers[0];
    for (var i = 1; i < phoneNumbers.length; i++) {
        phoneNumberStr += (','+phoneNumbers[i]);
    }

    // 一定要使用 utf-8 编码
    return crypto.createHash('sha256').update('appkey=41b544f5380e4d75ed50cf954d93759e&random='+rand+'&time='+curTime+'&mobile='+phoneNumberStr, 'utf-8').digest('hex');
}

module.exports = {
    unary: unary,
    getNow: getNow,
    getDateTime: getDateTime,
    getToday: getToday,
    upload: multer({storage: configUpload}),
    randomSix: randomSix,
    getSmsSig: getSmsSig
};