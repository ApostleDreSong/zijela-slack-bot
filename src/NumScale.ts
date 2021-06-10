export const NumScale = (channelID: string) => ({
    channel: channelID,
    "text": "",
    "blocks": [
        {
            "type": "input",
            "block_id": "scale",
            "label": {
                "type": "plain_text",
                "text": "What are the first 3 digits on the number scale?"
            },
            "element": {
                "type": "plain_text_input",
                "action_id": "plain_input",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Seperate each digit with a comma"
                }
            }
        }
    ]
})
