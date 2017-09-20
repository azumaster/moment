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

// 解析mongodb的时间
let getDateTime = (dateTime)=>{
    let current = new Date(dateTime);

    let date = current.getFullYear()+'-'+(current.getMonth()+1<10?'0'+(current.getMonth()+1):current.getMonth()+1)+'-'+(current.getDate()<10?'0'+current.getDate():current.getDate());
    let time = (current.getHours()<10?'0'+current.getHours():current.getHours())+':'+(current.getMinutes()<10?'0'+current.getMinutes():current.getMinutes())+':'+(current.getSeconds()<10?'0'+current.getSeconds():current.getSeconds());

    return date+' '+time;
};

module.exports = {
    unary: unary,
    getNow: getNow,
    getDateTime: getDateTime
};