import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import express from "express";
import cors from "cors";

const model = new AzureChatOpenAI({ temperature: 1 });


const embeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME,
});

const vectorStore = await FaissStore.load("vectordatabase", embeddings);
const vegaVectorStore = await FaissStore.load("vegaVectordatabase", embeddings);

const app = express()
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
    const result = await askQuestion()
    const vegaResult = await askVegaQuestion()

    res.json({
        message: result,
        vegaMessage : vegaResult
    })
})

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
async function askQuestion() {
    const relevantDocs = await vectorStore.similaritySearch("Give me the dishes", 20);
    const shuffled = shuffleArray(relevantDocs).slice(0, 6);
    const context = shuffled.map((doc) => doc.pageContent).join("\n\n");

    const response = await model.invoke([
        new SystemMessage("Use the following context to answer the user's question. Only use information from the context."),
        new HumanMessage(`Context:\n${context}\n\nQuestion: From the context, choose 2 random recipes. I just want you to give me a very small text of what it is. Format your answer as this example with 3 divs: <div style={{
                        backgroundColor: '#f4e7cd',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}>
                        <strong>Pasta Bolognese</strong>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                            Rich meat sauce with tomatoes and herbs.
                        </p>
                    </div>

                    <div style={{
                        backgroundColor: '#f4e7cd',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}>
                        `)
    ]);

    console.log("\nAnswer found:");
    console.log(response.content);
    return response.content;
}

async function askVegaQuestion() {
    const relevantDocs = await vegaVectorStore.similaritySearch("Give me the vegetarian dishes ", 20);
    const shuffled = shuffleArray(relevantDocs).slice(0, 6);
    const context = shuffled.map((doc) => doc.pageContent).join("\n\n");

    const response = await model.invoke([
        new SystemMessage("Use the following context to answer the user's question. Only use information from the context."),
        new HumanMessage(`Context:\n${context}\n\nQuestion: From the context, choose 2 random recipes. I just want you to give me a very small text of what it is. Format your answer as this example with 3 divs:
: 
                    <div style={{
                        backgroundColor: '#f4e7cd',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}>
                        <strong>Pasta Bolognese</strong>
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                            Rich meat sauce with tomatoes and herbs.
                        </p>
                    </div> `)
    ]);

    console.log("\nAnswer found:");
    console.log(response.content);
    return response.content;
}

await askQuestion();
await  askVegaQuestion();

app.listen(3001, () => console.log(`app luistert naar port 3001!`))
