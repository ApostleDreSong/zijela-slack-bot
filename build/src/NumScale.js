"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumScale = void 0;
var NumScale = function (channelID) { return ({
    channel: channelID,
    "text": "",
    "blocks": [
        {
            "type": "input",
            dispatch_action: true,
            "block_id": "scale",
            "label": {
                "type": "plain_text",
                "text": "What are the first 3 digits on the number scale?"
            },
            "element": {
                "type": "plain_text_input",
                "action_id": "plain_input",
                dispatch_action_config: {
                    trigger_actions_on: ["on_enter_pressed"]
                },
                "placeholder": {
                    "type": "plain_text",
                    "text": "Seperate each digit with a comma"
                }
            }
        }
    ]
}); };
exports.NumScale = NumScale;
