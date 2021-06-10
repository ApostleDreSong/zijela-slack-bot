"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalkTime = void 0;
var WalkTime = function (channelID) { return ({
    channel: channelID,
    "text": "",
    "blocks": [
        {
            "type": "section",
            "block_id": 'availability_time',
            "text": {
                "type": "mrkdwn",
                "text": "Maximum of two"
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
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "13:30"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "13:30"
                        },
                        "value": "13:30"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "14:00"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "14:00"
                        },
                        "value": "14:00"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "14:30"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "14:30"
                        },
                        "value": "14:30"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "15:00"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "15:00"
                        },
                        "value": "15:00"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "15:30"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "15:30"
                        },
                        "value": "15:30"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "16:00"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "16:00"
                        },
                        "value": "16:00"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "16:30"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "16:30"
                        },
                        "value": "16:30"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "17:00"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "17:00"
                        },
                        "value": "17:00"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "17:30"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "17:30"
                        },
                        "value": "17:30"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "18:00"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "18:00"
                        },
                        "value": "18:00"
                    }
                ],
                "action_id": "availability_time"
            }
        }
    ]
}); };
exports.WalkTime = WalkTime;
