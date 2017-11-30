<template>
    <Card dis-hover="true" padding="0" style="height: 185px;">
        <div class="weather-card">
            <div class="weather-temp" :style="weatherBg"><span>{{weatherInfo.temperature}}°</span></div>
            <div class="weather-info">
                <div class="weather-title"><Icon v-if="isDay" type="ios-partlysunny"></Icon><Icon v-else type="ios-cloudy-night"></Icon>实时天气</div>
                <div class="weather-body">
                    <p class="weather-city">{{weatherInfo.city}}</p>
                    <p class="weather-date">更新：{{weatherInfo.reporttime}}</p>
                    <p class="weather-des">{{weatherInfo.weather}}</p>
                    <p class="weather-wind">{{weatherInfo.winddirection}}风</p>
                    <p class="weather-humidity">空气湿度：{{weatherInfo.humidity}}%</p>
                </div>
            </div>
        </div>
    </Card>
</template>

<script>
    import ajax from 'jsonp';

    export default {
        name: 'weatherCard',
        data: function () {
            return {
                weatherInfo: {},
                isDay: true,
                weatherBg: 'background-image: url(\'/dist/img/bg.jpg\');'
            };
        },
        methods: {
            checkDayAndNight: function () {
                const now = new Date().getHours();

                if (now>=19 || now<=7){
                    this.isDay = false;
                }else{
                    this.isDay = true;
                }
            },
            getIp: function () {
                let _this = this;
                ajax('http://ip.chinaz.com/getip.aspx', null, (err, res)=>{
                    if(err){
                        _this.$Message.error('小Mo开小差去了，请稍后再试~');
                    }else{
                        _this.getWeather(res.ip);
                    }
                });
            },
            getWeather: function (ip) {
                const _this = this;
                this.$ajax({
                    method: 'get',
                    url: '/common/getWeather',
                    params: {ip: ip}
                }).then(function (res) {
                    if(res.data.code == 0){
                        _this.weatherInfo = res.data.data;
                    }else{
                        _this.$Message.error(res.data.message);
                    }
                }).catch(function () {
                    _this.$Message.error('小Mo开小差去了，请稍后再试~');
                });
            }
        },
        created: function () {
            this.getIp();
            this.checkDayAndNight();
        }
    };
</script>