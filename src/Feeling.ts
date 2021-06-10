export const Feeling = (channelID: string) => ({
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
})
