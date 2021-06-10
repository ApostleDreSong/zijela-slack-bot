"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalkDay = void 0;
var WalkDay = function (channelID) { return ({
    channel: channelID,
    "text": "",
    "blocks": [
        {
            "type": "section",
            "block_id": 'availability_days',
            "text": {
                "type": "mrkdwn",
                "text": "Day of the week"
            },
            "accessory": {
                "type": "checkboxes",
                "options": [
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "Monday"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "Monday"
                        },
                        "value": "monday"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "Tuesday"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "Tuesday"
                        },
                        "value": "tuesday"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "Wednesday"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "Wednesday"
                        },
                        "value": "wednesday"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "Thursday"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "Thursday"
                        },
                        "value": "thursday"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "Friday"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "Friday"
                        },
                        "value": "friday"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "Saturday"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "Saturday"
                        },
                        "value": "saturday"
                    },
                    {
                        "text": {
                            "type": "mrkdwn",
                            "text": "Sunday"
                        },
                        "description": {
                            "type": "mrkdwn",
                            "text": "Sunday"
                        },
                        "value": "sunday"
                    }
                ],
                "action_id": "availability_days"
            }
        }
    ]
}); };
exports.WalkDay = WalkDay;
