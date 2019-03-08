"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//发送网络请求获取DOM
var superagent = require("superagent");
//能够像Jquery一样方便获取DOM节点
var cheerio = require("cheerio");
//发送邮件的node插件
var nodemailer = require("nodemailer");
//ejs模版引擎
var ejs = require("ejs");
//文件读写
var fs = require("fs");
//路径配置
var path = require("path");
//定时器任务库
var schedule = require("node-schedule");
//配置项
//纪念日
var startDay = "2017/11/04";
//当地拼音,需要在下面的墨迹天气url确认
var local = "guangdong/shenzhen";
//发送者邮箱厂家
var EmianService = "126";
//发送者邮箱账户SMTP授权码
var EamilAuth = {
    user: "yhynew@126.com",
    pass: "michealye152"
};
//发送者昵称与邮箱地址
var EmailFrom = '"叶辉宇" <yhynew@126.com>';
//接收者邮箱地
var EmailTo = "1070231248@qq.com";
//邮件主题
var EmailSubject = "一封暖暖的小邮件";
//每日发送时间
var EmailHour = 10;
var EmialMinminute = 0;
// 爬取数据的url
var OneUrl = "http://wufazhuce.com/";
var WeatherUrl = "https://tianqi.moji.com/weather/china/" + local;
// 获取ONE内容
function getOneData() {
    var p = new Promise(function (resolve, reject) {
        superagent.get(OneUrl).end(function (err, res) {
            if (err) {
                reject(err);
            }
            var $ = cheerio.load(res.text);
            var selectItem = $("#carousel-one .carousel-inner .item");
            var todayOne = selectItem[0];
            var todayOneData = {
                imgUrl: $(todayOne)
                    .find(".fp-one-imagen")
                    .attr("src"),
                type: $(todayOne)
                    .find(".fp-one-imagen-footer")
                    .text()
                    .replace(/(^\s*)|(\s*$)/g, ""),
                text: $(todayOne)
                    .find(".fp-one-cita")
                    .text()
                    .replace(/(^\s*)|(\s*$)/g, "")
            };
            resolve(todayOneData);
        });
    });
    return p;
}
// 获取天气提醒
function getWeatherTips() {
    var p = new Promise(function (resolve, reject) {
        superagent.get(WeatherUrl).end(function (err, res) {
            if (err) {
                reject(err);
            }
            var threeDaysData = [];
            var weatherTip = "";
            var $ = cheerio.load(res.text);
            $(".wea_tips").each(function (i, elem) {
                weatherTip = $(elem)
                    .find("em")
                    .text();
            });
            resolve(weatherTip);
        });
    });
    return p;
}
// 获取天气预报
function getWeatherData() {
    var p = new Promise(function (resolve, reject) {
        superagent.get(WeatherUrl).end(function (err, res) {
            if (err) {
                reject(err);
            }
            var threeDaysData = [];
            var weatherTip = "";
            var $ = cheerio.load(res.text);
            $(".forecast .days").each(function (i, elem) {
                var SingleDay = $(elem).find("li");
                threeDaysData.push({
                    Day: $(SingleDay[0])
                        .text()
                        .replace(/(^\s*)|(\s*$)/g, ""),
                    WeatherImgUrl: $(SingleDay[1])
                        .find("img")
                        .attr("src"),
                    WeatherText: $(SingleDay[1])
                        .text()
                        .replace(/(^\s*)|(\s*$)/g, ""),
                    Temperature: $(SingleDay[2])
                        .text()
                        .replace(/(^\s*)|(\s*$)/g, ""),
                    WindDirection: $(SingleDay[3])
                        .find("em")
                        .text()
                        .replace(/(^\s*)|(\s*$)/g, ""),
                    WindLevel: $(SingleDay[3])
                        .find("b")
                        .text()
                        .replace(/(^\s*)|(\s*$)/g, ""),
                    Pollution: $(SingleDay[4])
                        .text()
                        .replace(/(^\s*)|(\s*$)/g, ""),
                    PollutionLevel: $(SingleDay[4])
                        .find("strong")
                        .attr("class")
                });
            });
            resolve(threeDaysData);
        });
    });
    return p;
}
// 发动邮件
function sendMail(HtmlData) {
    var template = ejs.compile(fs.readFileSync(path.resolve(__dirname, "../../email.ejs"), "utf8"));
    var html = template(HtmlData);
    var transporter = nodemailer.createTransport({
        service: EmianService,
        port: 465,
        secureConnection: true,
        auth: EamilAuth
    });
    var mailOptions = {
        from: EmailFrom,
        to: EmailTo,
        subject: EmailSubject,
        html: html
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            sendMail(HtmlData); //再次发送
        }
        console.log("邮件发送成功", info.messageId);
        console.log("静等下一次发送");
    });
}
// 聚合
function getAllDataAndSendMail() {
    var HtmlData = {};
    // how long with
    var today = new Date();
    console.log(today);
    var initDay = new Date(startDay);
    var lastDay = Math.floor((today - initDay) / 1000 / 60 / 60 / 24);
    var todaystr = today.getFullYear() +
        " / " +
        (today.getMonth() + 1) +
        " / " +
        today.getDate();
    HtmlData["lastDay"] = lastDay;
    HtmlData["todaystr"] = todaystr;
    Promise.all([getOneData(), getWeatherTips(), getWeatherData()]).then(function (data) {
        HtmlData["todayOneData"] = data[0];
        HtmlData["weatherTip"] = data[1];
        HtmlData["threeDaysData"] = data[2];
        sendMail(HtmlData);
    }).catch(function (err) {
        getAllDataAndSendMail(); //再次获取
        console.log('获取数据失败： ', err);
    });
}
function main() {
    var rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [0, new schedule.Range(1, 6)];
    rule.hour = EmailHour;
    rule.minute = EmialMinminute;
    console.log('NodeMail: 开始等待目标时刻...');
    var j = schedule.scheduleJob(rule, function () {
        console.log("执行任务");
        getAllDataAndSendMail();
    });
}
exports.default = main;
