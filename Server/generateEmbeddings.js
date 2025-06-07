import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";
import { FaissStore } from "@langchain/community/vectorstores/faiss";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import fetch from "node-fetch";
import { Document } from "langchain/document";

const generateEmbeddings = new AzureOpenAIEmbeddings({
    temperature: 0,
    azureOpenAIApiEmbeddingsDeploymentName: process.env.AZURE_EMBEDDING_DEPLOYMENT_NAME
});


async function createVectorstoreFromURL() {
    const res = await fetch("https://www.gutenberg.org/cache/epub/62804/pg62804.txt");
    const vegaRes = await fetch("https://www.gutenberg.org/files/13887/13887-0.txt");

    const fullText = await res.text();
    const vegaFullText = await vegaRes.text();

// Strip Project Gutenberg header/footer
    const bookMatch = fullText.match(
        /\*\*\* START OF (?:THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*(.*?)\*\*\* END OF (?:THE|THIS) PROJECT GUTENBERG EBOOK.*?\*\*\*/s
    );

    if (!bookMatch || !bookMatch[1]) {
        console.warn("Kon het boekgedeelte niet vinden!");
        return;
    }

    const textOnly = bookMatch[1].trim();
    const vegaTextOnly = vegaFullText.trim();


    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const splitDocs = await splitter.splitDocuments([new Document({ pageContent: textOnly })]);
    const vegaSplitDocs = await splitter.splitDocuments([new Document({ pageContent: vegaTextOnly })]);

    console.log(`Split into ${splitDocs.length} chunks`);
    console.log(`Vega split into ${vegaSplitDocs.length} chunks`);


    const vectorStore = await FaissStore.fromDocuments(splitDocs, generateEmbeddings);
    const vegaVectorStore = await FaissStore.fromDocuments(vegaSplitDocs, generateEmbeddings);
    await vectorStore.save("vectordatabase");
    await vegaVectorStore.save("vegaVectordatabase");
    console.log("Vector store created!");

}



await createVectorstoreFromURL();
