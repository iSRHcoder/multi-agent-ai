import crypto from 'node:crypto';
import { getModel } from '../src/config/llmModels.js';

const INTENTS = new Set([
  'CODE_GENERATION',
  'CODE_REVIEW',
  'CODE_EXPLANATION',
  'DEBUGGING',
  'OPTIMIZATION',
  'CONVERSION',
  'DOCUMENTATION',
]);

const ARTIFACT_INTENTS = new Set([
  'CODE_GENERATION',
  'CONVERSION',
]);

const normalizeIntent = (content = '') => {
  const value = String(content)
    .trim()
    .replace(/[`"' ]/g, '')
    .toUpperCase();

  return INTENTS.has(value) ? value : 'CODE_EXPLANATION';
};

const parseJsonResponse = (content) => {
  if (typeof content !== 'string') {
    throw new Error('LLM response is not a string');
  }

  let cleaned = content.trim();

  // Remove markdown code fences if the model adds them
  cleaned = cleaned
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  // Extract the JSON object if extra text was returned
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error('No JSON object found in LLM response');
  }

  cleaned = cleaned.slice(firstBrace, lastBrace + 1);

  return JSON.parse(cleaned);
};

const validateFiles = (files) => {
  if (!Array.isArray(files)) {
    throw new Error('Artifact files must be an array');
  }

  const validFiles = files.filter(
    (file) =>
      file &&
      typeof file.path === 'string' &&
      typeof file.content === 'string' &&
      file.path.trim().length > 0
  );

  if (validFiles.length === 0) {
    throw new Error('No valid files returned by coding agent');
  }

  return validFiles;
};

export const codingAgent = async (state) => {
  try {
    const intentLlm = await getModel('intent');
    const llm = await getModel('coding');

    const userRequest = String(state?.prompt || '').trim();

    if (!userRequest) {
      return {
        ...state,
        aiResponse: 'Please provide a coding request.',
        artifacts: [],
      };
    }

    /* =========================
       1. Detect intent
    ========================= */

    const intentRes = await intentLlm.invoke(`
You are an intent classifier for a coding assistant.

Classify the user's request into exactly ONE of these values:

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

Classification rules:

CODE_GENERATION
- User wants new code, a component, application, website, API, or project.

CODE_REVIEW
- User wants existing code inspected for bugs, quality, security, or maintainability.

CODE_EXPLANATION
- User wants an explanation of code, syntax, architecture, or programming concepts.

DEBUGGING
- User has an error, bug, crash, unexpected behavior, or failing code.

OPTIMIZATION
- User wants performance, scalability, efficiency, readability, or code-quality improvements.

CONVERSION
- User wants existing code converted to another language, framework, library, or technology.

DOCUMENTATION
- User wants README files, API documentation, technical documentation, or project documentation.

If multiple categories apply, choose the PRIMARY requested action.

Return ONLY the intent value.

User Request:
${userRequest}
`);

    const intent = normalizeIntent(intentRes.content);

    /* =========================
       2. Build coding prompt
    ========================= */

    let prompt;

    if (intent === 'CODE_GENERATION' || intent === 'CONVERSION') {
      prompt = `
You are CortexAI, a professional coding agent.

Your task is to generate a complete coding artifact.

For simple websites, the default stack is:

- HTML
- CSS
- JavaScript

Use React, Next.js, Vue, or another framework when:
- explicitly requested by the user, OR
- the requested functionality clearly requires an application framework.

Do not introduce unnecessary frameworks.

Requirements:

- Write production-quality code.
- Keep the implementation consistent across files.
- Make the UI responsive.
- Use modern layout techniques.
- Use CSS variables where useful.
- Use Flexbox/Grid appropriately.
- Use accessible HTML where possible.
- Include sensible spacing and typography.
- Include hover/focus states where appropriate.
- Keep the project structure logical.
- Do not invent APIs or dependencies unless necessary.
- Preserve the original functionality during conversion.

IMPORTANT:

Return ONLY valid JSON.

Schema:

{
  "title": "Short project title",
  "files": [
    {
      "path": "relative/path/to/file.ext",
      "content": "complete file content"
    }
  ]
}

Rules:

- Output must start with {
- Output must end with }
- No markdown
- No code fences
- No explanation outside JSON
- Do not include comments explaining the JSON format
- Never mention the detected intent
- All file paths must be relative
- Never use ../ in file paths
- Never use absolute file paths

User Request:
${userRequest}
`;
    } else if (intent === 'CODE_REVIEW') {
      prompt = `
You are CortexAI, a professional coding assistant.

Review the user's code carefully.

Analyze:

1. Bugs
2. Security issues
3. Performance issues
4. Code quality
5. Maintainability
6. Scalability
7. Recommended improvements

For each important issue:
- Explain the problem.
- Explain why it matters.
- Show corrected code when useful.

Use clear Markdown.

Do not invent problems that are not supported by the provided code.

User Request:
${userRequest}
`;
    } else if (intent === 'DEBUGGING') {
      prompt = `
You are CortexAI, a professional debugging assistant.

Debug the user's code/problem.

Structure your answer as:

## Root Cause

Explain the actual cause.

## Why It Happens

Explain the underlying behavior.

## Fix

Provide the corrected code.

## Explanation

Explain the important changes.

If there are multiple possible causes, clearly distinguish:
- confirmed causes
- likely causes
- information still needed

Use Markdown and fenced code blocks.

User Request:
${userRequest}
`;
    } else if (intent === 'CODE_EXPLANATION') {
      prompt = `
You are CortexAI, a professional coding tutor.

Explain the requested code or programming concept clearly.

Requirements:

- Use simple language.
- Explain the important parts step by step.
- Include examples when useful.
- Avoid unnecessary complexity.
- Use Markdown.
- Use code blocks for code.

User Request:
${userRequest}
`;
    } else if (intent === 'OPTIMIZATION') {
      prompt = `
You are CortexAI, a professional software engineer.

Optimize the provided code.

Focus on:

- Performance
- Readability
- Maintainability
- Scalability
- Unnecessary operations
- Memory usage where relevant

Explain the important changes.

Use Markdown and fenced code blocks.

Do not change behavior unless the change is necessary for the optimization.

User Request:
${userRequest}
`;
    } else if (intent === 'DOCUMENTATION') {
      prompt = `
You are CortexAI, a technical documentation writer.

Create clear technical documentation for the requested code/project.

Include relevant sections such as:

- Purpose
- Features
- Setup
- Installation
- Usage
- Configuration
- APIs
- Examples
- Important notes

Use Markdown.

Only include sections that are relevant to the request.

User Request:
${userRequest}
`;
    }

    /* =========================
       3. Generate response
    ========================= */

    const res = await llm.invoke(prompt);

    const rawResponse =
      typeof res?.content === 'string'
        ? res.content.trim()
        : String(res?.content || '');

    /* =========================
       4. Handle artifacts
    ========================= */

    if (ARTIFACT_INTENTS.has(intent)) {
      const data = parseJsonResponse(rawResponse);

      const files = validateFiles(data.files);

      const artifact = {
        id: crypto.randomUUID(),
        type: 'code',
        intent,
        title:
          typeof data.title === 'string' && data.title.trim()
            ? data.title.trim()
            : intent === 'CONVERSION'
              ? 'Converted Project'
              : 'Generated Project',
        files,
      };

      return {
        ...state,
        aiResponse:
          intent === 'CONVERSION'
            ? `I've converted the requested project and generated ${files.length} file${
                files.length === 1 ? '' : 's'
              }.`
            : `I've generated the requested project with ${files.length} file${
                files.length === 1 ? '' : 's'
              }.`,
        artifacts: [artifact],
      };
    }

    /* =========================
       5. Normal coding response
    ========================= */

    return {
      ...state,
      aiResponse: rawResponse,
      artifacts: [],
    };
  } catch (error) {
    console.error('[CODING_AGENT_ERROR]', error);

    return {
      ...state,
      aiResponse:
        'I encountered an error while processing your coding request. Please try again.',
      artifacts: [],
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : undefined,
    };
  }
};