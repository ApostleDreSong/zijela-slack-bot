"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var express_1 = __importDefault(require("express"));
var mongoose_1 = require("mongoose");
require('dotenv').config();
var rtm = process.env.SLACK_BOT_TOKEN && new rtm_api_1.RTMClient(process.env.SLACK_BOT_TOKEN);
var web = process.env.SLACK_BOT_TOKEN && new web_api_1.WebClient(process.env.SLACK_BOT_TOKEN);
var app = express_1.default();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.set('views', './views');
app.set('view engine', 'pug');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });
var ResponseSchema = new mongoose_1.Schema({
    user: { type: String, unique: true, required: true },
    feeling: String,
    availability: [String]
});
var ResponseModel = mongoose_1.model('slack-response', ResponseSchema);
var state = {
    feeling: '',
    availability: []
};
var Feeling = function (channelID) { return ({
    channel: channelID,
    "text": "",
    "blocks": [
        {
            "type": "section",
            "block_id": "feeling",
            "text": {
                "type": "mrkdwn",
                "text": "Welcome. How are you feeling today?"
            },
            "accessory": {
                "action_id": "feeling",
                "type": "static_select",
                "placeholder": {
                    "type": "plain_text",
                    "text": "select option"
                },
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Doing Well"
                        },
                        "value": "well"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Neutral"
                        },
                        "value": "neutral"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "Lucky"
                        },
                        "value": "lucky"
                    }
                ]
            }
        }
    ]
}); };
var Submit = function (channelID) { return ({
    channel: channelID,
    "text": "Proceed to save responses?",
    "blocks": [
        {
            "type": "actions",
            "block_id": "submit",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "YES"
                    },
                    "style": "primary",
                    "value": "yes"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "NO"
                    },
                    "style": "danger",
                    "value": "no"
                }
            ]
        }
    ]
}); };
var Walk = function (channelID) { return ({
    channel: channelID,
    "text": "",
    "blocks": [
        {
            "type": "section",
            "block_id": 'availability',
            "text": {
                "type": "mrkdwn",
                "text": "When are you free this week for a walk?"
            },
            "accessory": {
                "type": "checkboxes",
                "options": [
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "12:00"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "12:00"
                        },
                        "value": "12:00"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "12:30"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "12:30"
                        },
                        "value": "12:30"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "13:00"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "13:00"
                        },
                        "value": "13:00"
                    }
                ],
                "action_id": "availability"
            }
        }
    ]
}); };
app.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var channel_id, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                res.status(200).send();
                channel_id = req.body.channel_id;
                _a = web;
                if (!_a) return [3 /*break*/, 2];
                return [4 /*yield*/, web.chat.postMessage(Feeling(channel_id))];
            case 1:
                _a = (_b.sent());
                _b.label = 2;
            case 2:
                _a;
                return [2 /*return*/];
        }
    });
}); });
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
                        res.render('response', { user: username, feeling: response === null || response === void 0 ? void 0 : response.feeling, availability: response === null || response === void 0 ? void 0 : response.availability });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
app.post('/responses', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var response, channel_id, _a, _b, times, leanArr_1, _c, _d, res_1, newUser, _e;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                // res.status(200).send({ "challenge": req.body.challenge });
                res.status(200).send();
                response = JSON.parse(req.body.payload);
                channel_id = response.channel.id;
                _a = response.message.blocks[0].block_id;
                switch (_a) {
                    case "feeling": return [3 /*break*/, 1];
                    case "availability": return [3 /*break*/, 4];
                    case "submit": return [3 /*break*/, 9];
                }
                return [3 /*break*/, 13];
            case 1:
                state.feeling = response.actions[0].selected_option.value;
                _b = web;
                if (!_b) return [3 /*break*/, 3];
                return [4 /*yield*/, web.chat.postMessage(Walk(channel_id))];
            case 2:
                _b = (_f.sent());
                _f.label = 3;
            case 3:
                _b;
                return [3 /*break*/, 14];
            case 4:
                times = response.actions[0].selected_options;
                leanArr_1 = [];
                times.forEach(function (element) {
                    leanArr_1.push(element.value);
                });
                state.availability = leanArr_1;
                _c = web;
                if (!_c) return [3 /*break*/, 6];
                return [4 /*yield*/, web.chat.postMessage({
                        channel: channel_id,
                        "text": "Proceed to save responses?",
                    })];
            case 5:
                _c = (_f.sent());
                _f.label = 6;
            case 6:
                _c;
                _d = web;
                if (!_d) return [3 /*break*/, 8];
                return [4 /*yield*/, web.chat.postMessage(Submit(channel_id))];
            case 7:
                _d = (_f.sent());
                _f.label = 8;
            case 8:
                _d;
                return [3 /*break*/, 14];
            case 9:
                res_1 = response.actions[0].value;
                if (!(res_1 === 'yes')) return [3 /*break*/, 12];
                newUser = new ResponseModel(__assign({ user: response.user.username }, state));
                newUser.save(function (err, userResponse) {
                    if (err)
                        return console.error(err);
                });
                _e = web;
                if (!_e) return [3 /*break*/, 11];
                return [4 /*yield*/, web.chat.postMessage({
                        channel: channel_id,
                        text: "Thank you for your responses. Please visit " + process.env.BASE_URL + "/view-response/" + response.user.username + " to view your reponse"
                    })];
            case 10:
                _e = (_f.sent());
                _f.label = 11;
            case 11:
                _e;
                _f.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13: return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); });
app.listen(process.env.PORT, function () {
    console.log("Example app listening at http://localhost:" + process.env.PORT);
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
    return __generator(this, function (_a) {
        if (event && event.type === 'message') {
            if (event.text === 'Hello @bot') {
                hello(event.channel, event.user);
            }
        }
        return [2 /*return*/];
    });
}); });
function hello(channelId, userId) {
    sendMessage(channelId, "Welcome. How are you doing?");
}
function sendMessage(channel, message) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = web;
                    if (!_a) return [3 /*break*/, 2];
                    return [4 /*yield*/, web.chat.postMessage({
                            channel: channel,
                            text: message,
                        })];
                case 1:
                    _a = (_b.sent());
                    _b.label = 2;
                case 2:
                    _a;
                    return [2 /*return*/];
            }
        });
    });
}
