
const request = require('request');
const config = require('./../common/config.js') ;


let getWeather = async (ctx, next) => {
    const IP = ctx.query.ip;

    let cityAdCode = await new Promise((resolve)=>{
        request({
            url: 'http://restapi.amap.com/v3/ip?key='+config.apiKey.aMap+'&ip='+IP,
            method: 'get',
            json: true,
            headers: {'Content-Type': 'application/json'}
        }, (error, response, body)=> {
            if (!error && response.statusCode == 200) {
                resolve(body.adcode);
            } else if (!error && response.statusCode != 200) {
                resolve({code: 101, message: '获取失败~'});
            } else {
                resolve({code: 201, message: error.toString()});
            }
        });
    });

    let cityWeather = await new Promise((resolve)=>{
        request({
            url: 'http://restapi.amap.com/v3/weather/weatherInfo?key='+config.apiKey.aMap+'&city='+cityAdCode+'&extensions=base',
            method: 'get',
            json: true,
            headers: {'Content-Type': 'application/json'}
        }, (error, response, body)=> {
            if (!error && response.statusCode == 200) {
                resolve(body.lives[0]);
            } else if (!error && response.statusCode != 200) {
                resolve({code: 101, message: '获取失败~'});
            } else {
                resolve({code: 201, message: error.toString()});
            }
        });
    });
    ctx.response.body = {code: 0, message: 'ok', data: cityWeather};
};







module.exports = {
    'GET /common/getWeather': getWeather,
};