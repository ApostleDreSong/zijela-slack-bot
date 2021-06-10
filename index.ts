import { RTMClient } from '@slack/rtm-api'
import { WebClient } from '@slack/web-api';
import axios from 'axios';
import express, { Request, Response } from 'express';
import { model, Schema } from 'mongoose';
import { Feeling } from './src/Feeling';
import { Hobbies } from './src/Hobbies';
import { NumScale } from './src/NumScale';
import { WalkDay } from './src/WalkDay';
import { WalkTime } from './src/WalkTime';
require('dotenv').config();
const rtm = process.env.SLACK_BOT_TOKEN && new RTMClient(process.env.SLACK_BOT_TOKEN);
const web = process.env.SLACK_BOT_TOKEN && new WebClient(process.env.SLACK_BOT_TOKEN);
const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('views', './views')
app.set('view engine', 'pug');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

const ResponseSchema = new Schema<ResponseType>({
    user: { type: String, unique: true, required: true },
    feeling: String,
    availability_time: [String],
    availability_day: [String],
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
    !state.feeling && web && await web.chat.postMessage(
        Feeling(channel_id)
    )
})

const Save = async (user: string, fieldTitle: keyof ResponseType, value: any) => {
    state[fieldTitle] = value
    await ResponseModel.findOneAndUpdate(
        {
            user
        },
        {
            [fieldTitle]: value
        },
        {
            upsert: true
        }
    )
}

app.get('/view-response/:username', async (req: Request, res: Response) => {
    const { username } = req.params;
    await ResponseModel.findOne({
        user: username
    })
        .then(response => {
            res.render('response', {
                user: username,
                feeling: response?.feeling,
                availability_time: response?.availability_time,
                availability_day: response?.availability_day,
                hobbies: response?.hobbies,
                numScale: response?.numScale,
            })
        })
})

app.post('/responses', async (req: Request, res: Response) => {
    // res.status(200).send({ "challenge": req.body.challenge });
    res.status(200).send();
    let response = JSON.parse(req.body.payload);
    const user = response.user.username;
    state.user = user;
    const channel_id = response.channel.id;
    switch (response.message.blocks[0].block_id) {
        case "feeling":
            !state.availability_time && !state.feeling && web && await web.chat.postMessage(
                {
                    channel: channel_id,
                    "text": "*When are you free this week for a walk?*",
                });
            !state.availability_time && !state.feeling && web && await web.chat.postMessage(
                WalkTime(channel_id)
            )
            let SlackUserResponseFeeling = response.actions[0].selected_option.value;
            await Save(user, 'feeling', SlackUserResponseFeeling)
            break;

        case "availability_time":
            const times = response.actions[0].selected_options;
            if (times.length > 2 && !state.availability_time) {
                axios.post(`${response.response_url}`, {
                    text: 'You can not select more than two available times'
                })
                web && await web.chat.postMessage(
                    WalkTime(channel_id)
                )
            }
            if (times.length <= 2) {
                const leanArr: string[] = [];
                times.forEach((element: TimesType) => {
                    leanArr.push(element.value);
                });
                !state.availability_day && !state.availability_time && web && await web.chat.postMessage(
                    WalkDay(channel_id)
                )
                let SlackUserResponseTime  = leanArr;
                await Save(user, 'availability_time', SlackUserResponseTime)
            }
            if (times.length > 2 && state.availability_time) {
                web && await web.chat.postMessage(
                    {
                        channel: channel_id,
                        "text": "*You can not select more than two available times*",
                    }
                )
            }
            break;

        case "availability_days":
            const days = response.actions[0].selected_options;
            const daysArr: string[] = [];
            days.forEach((element: TimesType) => {
                daysArr.push(element.value);
            });
            !state.hobbies && !state.availability_day && web && await web.chat.postMessage(
                Hobbies(channel_id)
            )
            let SlackUserResponseDays = daysArr;
            await Save(user, 'availability_day', SlackUserResponseDays)
            break;

        case "hobbies":
            const hobby = response.actions[0].selected_options;
            const hobbyArr: string[] = [];
            hobby.forEach((element: TimesType) => {
                hobbyArr.push(element.value);
            });
            !state.numScale && !state.hobbies && web && await web.chat.postMessage(
                NumScale(channel_id)
            )
            let SlackUserResponseHobby = hobbyArr;
            await Save(user, 'hobbies', SlackUserResponseHobby)
            break;

        case "scale":
            const scale = response.actions[0].value;
            let SlackUserResponseScale = scale;
            await Save(user, 'numScale', SlackUserResponseScale)
            state.numScale && web && await web.chat.postMessage(
                {
                    channel: channel_id,
                    "text": `Thank you for your responses. Please visit ${process.env.BASE_URL}/view-response/${response.user.username} to view your reponse`
                });
            break;

        default:
            break;
    }
    // res.status(200).send({ "challenge": req.body.challenge });
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
rtm && rtm.start()
    .catch(console.error);

rtm && rtm.on('ready', async () => {
    console.log('bot started')
})

rtm && rtm.on('slack_event', async (eventType, event) => {
    if (event && event.type === 'message') {
        if (event.text === 'Hello @bot') {
            !state.feeling && web && await web.chat.postMessage(
                Feeling(event.channel)
            )
        }
    }
})
