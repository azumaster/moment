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
}

module.exports = {
    unary: unary,
    getNow: getNow
};