"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rtm_api_1 = require("@slack/rtm-api");
var web_api_1 = require("@slack/web-api");
var axios_1 = __importDefault(require("axios"));
var express_1 = __importDefault(require("express"));
var mongoose_1 = require("mongoose");
var Feeling_1 = require("./src/Feeling");
var Hobbies_1 = require("./src/Hobbies");
var NumScale_1 = require("./src/NumScale");
var WalkDay_1 = require("./src/WalkDay");
var WalkTime_1 = require("./src/WalkTime");
require('dotenv').config();
var rtm = process.env.SLACK_BOT_TOKEN && new rtm_api_1.RTMClient(process.env.SLACK_BOT_TOKEN);
var web = process.env.SLACK_BOT_TOKEN && new web_api_1.WebClient(process.env.SLACK_BOT_TOKEN);
var app = express_1.default();
var port = process.env.PORT || 8080;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('views', './views');
app.set('view engine', 'pug');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
var ResponseSchema = new mongoose_1.Schema({
    user: { type: String, unique: true, required: true },
    feeling: String,
    availability_time: [String],
    availability_day: [String],
    hobbies: [String],
    numScale: String
});
var ResponseModel = mongoose_1.model('slack-response', ResponseSchema);
var state = {
    user: undefined,
    feeling: undefined,
    availability_time: undefined,
    availability_day: undefined,
    hobbies: undefined,
    numScale: undefined
};
app.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var channel_id, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                res.status(200).send();
                channel_id = req.body.channel_id;
                _a = !state.feeling && web;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, web.chat.postMessage(Feeling_1.Feeling(channel_id))];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                _a;
                return [2 /*return*/];
        }
    });
}); });
var Save = function (user, fieldTitle, value) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                state[fieldTitle] = value;
                return [4 /*yield*/, ResponseModel.findOneAndUpdate({
                        user: user
                    }, (_a = {},
                        _a[fieldTitle] = value,
                        _a), {
                        upsert: true
                    })];
            case 1:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
app.get('/view-response/:username', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                username = req.params.username;
                return [4 /*yield*/, ResponseModel.findOne({
                        user: username
                    })
                        .then(function (response) {
                        res.render('response', {
                            user: username,
                            feeling: response === null || response === void 0 ? void 0 : response.feeling,
                            availability_time: response === null || response === void 0 ? void 0 : response.availability_time,
                            availability_day: response === null || response === void 0 ? void 0 : response.availability_day,
                            hobbies: response === null || response === void 0 ? void 0 : response.hobbies,
                            numScale: response === null || response === void 0 ? void 0 : response.numScale,
                        });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.post('/responses', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, user, channel_id, _a, _b, _c, SlackUserResponseFeeling, times, _d, leanArr_1, _e, SlackUserResponseTime, _f, days, daysArr_1, _g, SlackUserResponseDays, hobby, hobbyArr_1, _h, SlackUserResponseHobby, scale, SlackUserResponseScale, _j;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                // res.status(200).send({ "challenge": req.body.challenge });
                res.status(200).send();
                response = JSON.parse(req.body.payload);
                user = response.user.username;
                state.user = user;
                channel_id = response.channel.id;
                _a = response.message.blocks[0].block_id;
                switch (_a) {
                    case "feeling": return [3 /*break*/, 1];
                    case "availability_time": return [3 /*break*/, 7];
                    case "availability_days": return [3 /*break*/, 18];
                    case "hobbies": return [3 /*break*/, 22];
                    case "scale": return [3 /*break*/, 26];
                }
                return [3 /*break*/, 30];
            case 1:
                _b = !state.availability_time && !state.feeling && web;
                if (!_b) return [3 /*break*/, 3];
                return [4 /*yield*/, web.chat.postMessage({
                        channel: channel_id,
                        "text": "*When are you free this week for a walk?*",
                    })];
            case 2:
                _b = (_k.sent());
                _k.label = 3;
            case 3:
                _b;
                _c = !state.availability_time && !state.feeling && web;
                if (!_c) return [3 /*break*/, 5];
                return [4 /*yield*/, web.chat.postMessage(WalkTime_1.WalkTime(channel_id))];
            case 4:
                _c = (_k.sent());
                _k.label = 5;
            case 5:
                _c;
                SlackUserResponseFeeling = response.actions[0].selected_option.value;
                return [4 /*yield*/, Save(user, 'feeling', SlackUserResponseFeeling)];
            case 6:
                _k.sent();
                return [3 /*break*/, 31];
            case 7:
                times = response.actions[0].selected_options;
                if (!(times.length > 2 && !state.availability_time)) return [3 /*break*/, 10];
                axios_1.default.post("" + response.response_url, {
                    text: 'You can not select more than two available times'
                });
                _d = web;
                if (!_d) return [3 /*break*/, 9];
                return [4 /*yield*/, web.chat.postMessage(WalkTime_1.WalkTime(channel_id))];
            case 8:
                _d = (_k.sent());
                _k.label = 9;
            case 9:
                _d;
                _k.label = 10;
            case 10:
                if (!(times.length <= 2)) return [3 /*break*/, 14];
                leanArr_1 = [];
                times.forEach(function (element) {
                    leanArr_1.push(element.value);
                });
                _e = !state.availability_day && !state.availability_time && web;
                if (!_e) return [3 /*break*/, 12];
                return [4 /*yield*/, web.chat.postMessage(WalkDay_1.WalkDay(channel_id))];
            case 11:
                _e = (_k.sent());
                _k.label = 12;
            case 12:
                _e;
                SlackUserResponseTime = leanArr_1;
                return [4 /*yield*/, Save(user, 'availability_time', SlackUserResponseTime)];
            case 13:
                _k.sent();
                _k.label = 14;
            case 14:
                if (!(times.length > 2 && state.availability_time)) return [3 /*break*/, 17];
                _f = web;
                if (!_f) return [3 /*break*/, 16];
                return [4 /*yield*/, web.chat.postMessage({
                        channel: channel_id,
                        "text": "*You can not select more than two available times*",
                    })];
            case 15:
                _f = (_k.sent());
                _k.label = 16;
            case 16:
                _f;
                _k.label = 17;
            case 17: return [3 /*break*/, 31];
            case 18:
                days = response.actions[0].selected_options;
                daysArr_1 = [];
                days.forEach(function (element) {
                    daysArr_1.push(element.value);
                });
                _g = !state.hobbies && !state.availability_day && web;
                if (!_g) return [3 /*break*/, 20];
                return [4 /*yield*/, web.chat.postMessage(Hobbies_1.Hobbies(channel_id))];
            case 19:
                _g = (_k.sent());
                _k.label = 20;
            case 20:
                _g;
                SlackUserResponseDays = daysArr_1;
                return [4 /*yield*/, Save(user, 'availability_day', SlackUserResponseDays)];
            case 21:
                _k.sent();
                return [3 /*break*/, 31];
            case 22:
                hobby = response.actions[0].selected_options;
                hobbyArr_1 = [];
                hobby.forEach(function (element) {
                    hobbyArr_1.push(element.value);
                });
                _h = !state.numScale && !state.hobbies && web;
                if (!_h) return [3 /*break*/, 24];
                return [4 /*yield*/, web.chat.postMessage(NumScale_1.NumScale(channel_id))];
            case 23:
                _h = (_k.sent());
                _k.label = 24;
            case 24:
                _h;
                SlackUserResponseHobby = hobbyArr_1;
                return [4 /*yield*/, Save(user, 'hobbies', SlackUserResponseHobby)];
            case 25:
                _k.sent();
                return [3 /*break*/, 31];
            case 26:
                scale = response.actions[0].value;
                SlackUserResponseScale = scale;
                return [4 /*yield*/, Save(user, 'numScale', SlackUserResponseScale)];
            case 27:
                _k.sent();
                _j = state.numScale && web;
                if (!_j) return [3 /*break*/, 29];
                return [4 /*yield*/, web.chat.postMessage({
                        channel: channel_id,
                        "text": "Thank you for your responses. Please visit " + process.env.BASE_URL + "/view-response/" + response.user.username + " to view your reponse"
                    })];
            case 28:
                _j = (_k.sent());
                _k.label = 29;
            case 29:
                _j;
                return [3 /*break*/, 31];
            case 30: return [3 /*break*/, 31];
            case 31: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Example app listening at http://localhost:" + port);
});
rtm && rtm.start()
    .catch(console.error);
rtm && rtm.on('ready', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log('bot started');
        return [2 /*return*/];
    });
}); });
rtm && rtm.on('slack_event', function (eventType, event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!(event && event.type === 'message')) return [3 /*break*/, 3];
                if (!(event.text === 'Hello @bot')) return [3 /*break*/, 3];
                _a = !state.feeling && web;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, web.chat.postMessage(Feeling_1.Feeling(event.channel))];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                _a;
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
