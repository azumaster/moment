// 解析mongodb的时间
let getDateTime = (dateTime)=>{
    let current = new Date(dateTime);

    let date = current.getFullYear()+'-'+(current.getMonth()+1<10?'0'+(current.getMonth()+1):current.getMonth()+1)+'-'+(current.getDate()<10?'0'+current.getDate():current.getDate());
    let time = (current.getHours()<10?'0'+current.getHours():current.getHours())+':'+(current.getMinutes()<10?'0'+current.getMinutes():current.getMinutes())+':'+(current.getSeconds()<10?'0'+current.getSeconds():current.getSeconds());

    return date+' '+time;
};


module.exports = {
    getDateTime: getDateTime
};