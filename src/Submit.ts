export const Submit = (channelID: string) => ({
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
})
