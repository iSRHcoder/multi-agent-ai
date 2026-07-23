import { StateGraph } from '@langchain/langgraph';
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

workflow.addEdge('__start__', 'router');
workflow.addConditionalEdges(
  'router',
  (state) => {
    switch (state.agent) {
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
        return 'chat';
    }
  },
  {
    chat: 'chat',
    search: 'search',
    coding: 'coding',
    pdf: 'pdf',
    ppt: 'ppt',
    vision: 'vision',
  }
);

workflow.addEdge('search', 'chat');
workflow.addEdge('chat', '__end__');
workflow.addEdge('coding', '__end__');
workflow.addEdge('pdf', '__end__');
workflow.addEdge('ppt', '__end__');
workflow.addEdge('vision', '__end__');

export const graph = workflow.compile();
