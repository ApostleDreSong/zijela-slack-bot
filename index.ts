import { RTMClient } from '@slack/rtm-api'
import { WebClient } from '@slack/web-api';
import express, { Request, Response } from 'express';
import { model, Schema } from 'mongoose';
import { Feeling } from './src/Feeling';
import { Hobbies } from './src/Hobbies';
import { NumScale } from './src/NumScale';
import { Submit } from './src/Submit';
import { WalkDay } from './src/WalkDay';
import { WalkTime } from './src/WalkTime';
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
    availability: [String],
    hobbies: [String],
    numScale: String
});

interface ResponseType {
    user: string | undefined;
    feeling: string | undefined;
    availability_time: string[] | undefined;
    availability_day: string[] | undefined;
    hobbies: string[] | undefined;
    numScale: string | undefined
}

const ResponseModel = model<ResponseType>('slack-response', ResponseSchema);

interface TimesType {
    text: { type: string, text: string, verbatim: boolean },
    value: string,
    description: { type: string, text: string, verbatim: boolean }
}

const state: ResponseType = {
    user: undefined,
    feeling: undefined,
    availability_time: undefined,
    availability_day: undefined,
    hobbies: undefined,
    numScale: undefined
}

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
        .then(response => {
            res.render('response', { user: username, feeling: response?.feeling, availability: response?.availability_time })
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
            !state.availability_day && web && await web.chat.postMessage(
                {
                    channel: channel_id,
                    "text": "When are you free this week for a walk?",
                });
            !state.availability_time && web && await web.chat.postMessage(
                WalkTime(channel_id)
            )
            !state.availability_day && web && await web.chat.postMessage(
                WalkDay(channel_id)
            )
            break;

        case "availability_time":
            const times = response.actions[0].selected_options;
            const leanArr: string[] = [];
            times.forEach((element: TimesType) => {
                leanArr.push(element.value);
            });
            state.availability_time = leanArr;
            break;
        // !state.lastquestion && web && await web.chat.postMessage(
        //     {
        //         channel: channel_id,
        //         "text": "Proceed to save responses?",
        //     });
        // web && await web.chat.postMessage(
        //     Submit(channel_id)
        // )

        case "availability_day":
            const days = response.actions[0].selected_options;
            const daysArr: string[] = [];
            days.forEach((element: TimesType) => {
                leanArr.push(element.value);
            });
            state.availability_day = daysArr;
            !state.hobbies && web && await web.chat.postMessage(
                Hobbies(channel_id)
            )
            break;

        case "hobbies":
            const hobby = response.actions[0].selected_options;
            const hobbyArr: string[] = [];
            hobby.forEach((element: TimesType) => {
                hobbyArr.push(element.value);
            });
            state.hobbies = hobbyArr;
            !state.numScale && web && await web.chat.postMessage(
                NumScale(channel_id)
            )
            break;

        case "scale":
            const scale = response.actions[0].selected_option;
            state.numScale = scale;
            state.numScale && web && await web.chat.postMessage(
                {
                    channel: channel_id,
                    "text": "Thank you. Proceed to save responses?",
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
                newUser.save(async function (err, userResponse) {
                    if (err) {
                        console.error(err);
                        return web && await web.chat.postMessage(
                            {
                                channel: channel_id,
                                text: `Thank you for your responses. Please visit ${process.env.BASE_URL}/view-response/${response.user.username} to view your reponse`
                            }
                        )
                    }
                    web && await web.chat.postMessage(
                        {
                            channel: channel_id,
                            text: `Thank you for your responses. Please visit ${process.env.BASE_URL}/view-response/${response.user.username} to view your reponse`
                        }
                    )
                });
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
            web && await web.chat.postMessage(
                Feeling(event.channel)
            )
        }
    }
})
