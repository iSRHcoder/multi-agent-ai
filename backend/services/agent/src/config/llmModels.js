import { ChatGroq } from '@langchain/groq';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
//import { ChatOpenAI } from '@langchain/openai';

const groq = new ChatGroq({
  model: 'openai/gpt-oss-120b',
  apiKey: process.env.GROQ_API_KEY,
});

const gemini = new ChatGoogleGenerativeAI({
  model: 'gemini-2.5-flash',
  apiKey: process.env.GOOGLE_API_KEY,
});

// const chatGpt = new ChatOpenAI({
//   model: 'openai:gpt-5.5',
// });

export const getModel = async (agent) => {
  switch (agent) {
    case 'chat':
      return groq;
    case 'search':
      return groq;
    case 'coding':
      return gemini;
    case 'ppt':
      return gemini;
    case 'pdf':
      return gemini;

    default:
      return groq;
  }
};
