export const WalkTime = (channelID: string) => ({
    channel: channelID,
    "text": "",
    "blocks": [
        {
            "type": "section",
            "block_id": 'availability_time',
            "text": {
                "type": "mrkdwn",
                "text": "Time of Day (Maximum of Two(2))"
            },
            "accessory": {
                "action_id": "availability_time_action",
                "type": "multi_static_select",
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "12:00"
                        },
                        "value": "12:00"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "12:30"
                        },
                        "value": "12:30"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "13:00"
                        },
                        "value": "13:00"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "13:30"
                        },
                        "value": "13:30"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "14:00"
                        },
                        "value": "14:00"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "14:30"
                        },
                        "value": "14:30"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "15:00"
                        },
                        "value": "15:00"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "15:30"
                        },
                        "value": "15:30"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "16:00"
                        },
                        "value": "16:00"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "16:30"
                        },
                        "value": "16:30"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "17:00"
                        },
                        "value": "17:00"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "17:30"
                        },
                        "value": "17:30"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "text": "18:00"
                        },
                        "value": "18:00"
                    }
                ],
            }
        }
    ]
})
