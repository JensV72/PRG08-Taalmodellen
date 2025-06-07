import express from 'express'
import cors from 'cors'
import { AzureChatOpenAI } from "@langchain/openai";
import { AIMessage, HumanMessage, SystemMessage } from "@langchain/core/messages";
import fetch from 'node-fetch';

const model = new AzureChatOpenAI({ temperature: 0.3 });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', async (req, res) => {
    let prompt = req.body.human;
    let history = req.body.history;

    const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    let allMeals = [];

    for (const letter of letters) {
        const url = `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`;
        const apiResponse = await fetch(url);
        const result = await apiResponse.json();
        if (result.meals) {
            allMeals.push(...result.meals);
        }
    }

    const recipeContext = JSON.stringify(allMeals.slice(0, 20));

    let messages = [
        new SystemMessage(`You are a library with cooking recipes using this data: ${recipeContext}. You will answer the human as if he is the headchef in the kitchen.

Refer to the user as "chef" at the end of your sentences.

Say "Bon chef!" at the start of your response if the user message starts with a **command** (e.g., "I need", "Show me", "List", "Tell me how to", "Give me", "Help me","Can you"). 

You MUST begin your response with "Bon chef!" if the user message starts with:
"I need", "Show me", "List", "Tell me how to", "Give me", "Help me", or "Can you".

This rule applies EVEN if the message is phrased politely as a question.`)
    ];

    for (const { human, ai } of history) {
        messages.push(new HumanMessage(human));
        messages.push(new AIMessage(ai));
    }

    messages.push(new HumanMessage(prompt));

    const chatResponse = await model.stream(messages);
    res.setHeader("Content-Type", "text/plain");

    for await (const chunk of chatResponse) {
        res.write(chunk.content);
    }
    res.end();
});

app.listen(3000, () => console.log(`app luistert naar port 3000!`));
