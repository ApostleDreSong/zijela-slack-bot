"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hobbies = void 0;
var Hobbies = function (channelID) { return ({
    channel: channelID,
    "text": "",
    "blocks": [
        {
            "type": "section",
            "block_id": "hobbies",
            "text": {
                "type": "mrkdwn",
                "text": "Choose your hobbies"
            },
            "accessory": {
                "action_id": "hobbies_action",
                "type": "multi_static_select",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Select items"
                },
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "*Football*"
                        },
                        "value": "football"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "*Music*"
                        },
                        "value": "music"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "*Sleep*"
                        },
                        "value": "sleep"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "*Movies*"
                        },
                        "value": "movies"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "*Basketball*"
                        },
                        "value": "basketball"
                    }
                ]
            }
        }
    ]
}); };
exports.Hobbies = Hobbies;
