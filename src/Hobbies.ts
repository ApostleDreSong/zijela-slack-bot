export const Hobbies = (channelID: string) => ({
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
                "action_id": "text1234",
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
                            "type": "Music",
                            "text": "*Music*"
                        },
                        "value": "music"
                    },
                    {
                        "text": {
                            "type": "Sleep",
                            "text": "*Sleep*"
                        },
                        "value": "sleep"
                    },
                    {
                        "text": {
                            "type": "Movies",
                            "text": "*Movies*"
                        },
                        "value": "movies"
                    },
                    {
                        "text": {
                            "type": "Basketball",
                            "text": "*Basketball*"
                        },
                        "value": "basketball"
                    }
                ]
            }
        }
    ]
})
