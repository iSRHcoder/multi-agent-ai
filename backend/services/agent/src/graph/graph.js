import { StateGraph, START, END } from '@langchain/langgraph';

import { agentState } from './state.js';

import { router } from './router.js';

import { chatAgent } from '../../agents/chatAgent.js';
import { codingAgent } from '../../agents/codingAgent.js';
import { visionAgent } from '../../agents/visionAgent.js';
import { pdfAgent } from '../../agents/pdfAgent.js';
import { pptAgent } from '../../agents/pptAgent.js';
import { searchAgent } from '../../agents/searchAgent.js';

const workflow = new StateGraph(agentState);

workflow.addNode('router', router);
workflow.addNode('chat', chatAgent);
workflow.addNode('coding', codingAgent);
workflow.addNode('vision', visionAgent);
workflow.addNode('pdf', pdfAgent);
workflow.addNode('ppt', pptAgent);
workflow.addNode('search', searchAgent);

workflow.addEdge(START, 'router');

workflow.addConditionalEdges(
  'router',
  (state) => {
    const agent = state?.agent;

    console.log('[GRAPH ROUTER RESULT]', agent);

    switch (agent) {
      case 'chat':
        return 'chat';

      case 'search':
        return 'search';

      case 'coding':
        return 'coding';

      case 'vision':
        return 'vision';

      case 'pdf':
        return 'pdf';

      case 'ppt':
        return 'ppt';

      default:
        console.warn('[GRAPH] Unknown agent:', agent, 'Falling back to chat');

        return 'chat';
    }
  },
  {
    chat: 'chat',
    search: 'search',
    coding: 'coding',
    vision: 'vision',
    pdf: 'pdf',
    ppt: 'ppt',
  }
);

workflow.addEdge('search', 'chat');

workflow.addEdge('chat', END);
workflow.addEdge('coding', END);
workflow.addEdge('vision', END);
workflow.addEdge('pdf', END);
workflow.addEdge('ppt', END);

export const graph = workflow.compile();
