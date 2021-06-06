import { RTMClient } from '@slack/rtm-api'
import { WebClient } from '@slack/web-api';
import express, { Request, Response } from 'express';
import { model, Schema } from 'mongoose';
require('dotenv').config();
const rtm = process.env.SLACK_BOT_TOKEN && new RTMClient(process.env.SLACK_BOT_TOKEN);
const web = process.env.SLACK_BOT_TOKEN && new WebClient(process.env.SLACK_BOT_TOKEN);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', './views')
app.set('view engine', 'pug');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true });

const ResponseSchema = new Schema<ResponseType>({
    user: { type: String, unique: true, required: true },
    feeling: String,
    availability: [String]
});

interface ResponseType {
    user: string,
    feeling: string,
    availability: string[]
}

const ResponseModel = model<ResponseType>('slack-response', ResponseSchema);

interface feelingType {
    feeling: string;
    availability: string[];
}

interface TimesType {
    text: { type: string, text: string, verbatim: boolean },
    value: string,
    description: { type: string, text: string, verbatim: boolean }
}

const state: feelingType = {
    feeling: '',
    availability: []
}

const Feeling = (channelID: string) => ({
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

const Submit = (channelID: string) => ({
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

const Walk = (channelID: string) => ({
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
})

app.post('/', async (req: Request, res: Response) => {
    res.status(200).send();
    const { channel_id } = req.body;
    web && await web.chat.postMessage(
        Feeling(channel_id)
    )
})

app.get('/view-response/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    await ResponseModel.findOne({
        user: username
    })
    .then(response=>{
        res.render('response', { user: username, feeling: response?.feeling, availability: response?.availability })
    })
})

app.post('/responses', async (req: Request, res: Response) => {
    // res.status(200).send({ "challenge": req.body.challenge });
    res.status(200).send();
    let response = JSON.parse(req.body.payload);
    const channel_id = response.channel.id;
    switch (response.message.blocks[0].block_id) {
        case "feeling":
            state.feeling = response.actions[0].selected_option.value;
            web && await web.chat.postMessage(
                Walk(channel_id)
            )
            break;

        case "availability":
            const times = response.actions[0].selected_options;
            const leanArr: string[] = [];
            times.forEach((element: TimesType) => {
                leanArr.push(element.value);
            });
            state.availability = leanArr;
            web && await web.chat.postMessage(
                {
                    channel: channel_id,
                    "text": "Proceed to save responses?",
                });
            web && await web.chat.postMessage(
                Submit(channel_id)
            )
            break;

        case "submit":
            const res = response.actions[0].value;
            if (res === 'yes') {
                const newUser = new ResponseModel({
                    user: response.user.username,
                    ...state
                })
                newUser.save(function (err, userResponse) {
                    if (err) return console.error(err);
                });
                web && await web.chat.postMessage(
                    {
                        channel: channel_id,
                        text: `Thank you for your responses. Please visit ${process.env.BASE_URL}/view-response/${response.user.username} to view your reponse`
                    }
                )
            }
            break;

        default:
            break;
    }
    // res.status(200).send({ "challenge": req.body.challenge });
})

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})
rtm && rtm.start()
    .catch(console.error);

rtm && rtm.on('ready', async () => {
    console.log('bot started')
})

rtm && rtm.on('slack_event', async (eventType, event) => {
    if (event && event.type === 'message') {
        if (event.text === 'Hello @bot') {
            hello(event.channel, event.user)
        }
    }
})


function hello(channelId: string, userId: string) {
    sendMessage(channelId, "Welcome. How are you doing?")
}

async function sendMessage(channel: string, message: string) {
    web && await web.chat.postMessage({
        channel: channel,
        text: message,
    })
}
