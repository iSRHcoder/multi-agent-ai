import { getModel } from '../config/llmModels.js';

export const router = async (state) => {
  const llm = await getModel('router');

  const prompt = `You are an agent router.


Available agents:
-chat
-search
-coding
-ppt
-pdf
-vision


Rules:

chat:
General conversation,
explanations
learning,
question.

search:
Current events,
latest information,
news,
recent development,
internet lookup.

coding:
Generate code,
debug code,
build projects,
architecture,
API design.

pdf:
Question about generate PDFs
or document context.

ppt:
Questions about generate ppts
or ppt context.

vision:
Generate Image, 
create Image.


Return only one word:

chat
search
coding
pdf
ppt
vision


User Query:
${state.prompt}
`;

  const response = await llm.invoke(prompt);
  console.log('response:', response);

  return {
    ...state,
    agent: response.content.trim().toLowerCase(),
  };
};
