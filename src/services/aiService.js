const { callDeepSeek } = require('../utils/deepseekEngine');
const { getProcessItemPrompt } = require('./itemProcessor');
const { getMatchItemPrompt } = require('./aimatcher');

const processItemDescription = async (description) => {
  const prompt = getProcessItemPrompt(description);
  const raw = await callDeepSeek(prompt);

  try {
    return JSON.parse(raw);
  } catch {
    console.warn('Failed to parse AI output, falling back to defaults');
    return {
      category: 'Other',
      summary: description,
      tags: []
    };
  }
};

const matchLostItem = async (query, simplifiedItems) => {
  const prompt = getMatchItemPrompt(query, simplifiedItems);
  const raw = await callDeepSeek(prompt);

  try {
    const matches = JSON.parse(raw);
    return matches.map(m => ({
      id: simplifiedItems[m.index].id,
      matchPercentage: m.matchPercentage
    }));
  } catch {
    console.error('Failed to parse AI match output');
    throw new Error('DeepSeek match parsing failed');
  }
};

module.exports = {
  processItemDescription,
  matchLostItem
};