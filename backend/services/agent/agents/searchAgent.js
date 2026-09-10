import { searchTool } from '../src/config/tavily.js';

export const searchAgent = async (state) => {
  try {
    const results = await searchTool.invoke({
      query: state.prompt,
    });
    console.log(results);

    return {
      ...state,
      searchResults: results.results ?? [],
      images: results.images,
    };
  } catch (error) {
    console.error('[SEARCH AGENT ERROR]', error);
    return {
      ...state,
      searchResults: [],
      images: [],
    };
  }
};
