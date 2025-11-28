const { callDeepSeek } = require('../utils/deepseekEngine');
const { getProcessItemPrompt } = require('./itemProcessor');
const { getMatchItemPrompt } = require('./aiMatcher');

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

  let matches;
  try {
    matches = JSON.parse(raw.trim());
  } catch {
    const match = raw.match(/\[.*\]/s);
    if (match) matches = JSON.parse(match[0]);
    else {
      console.error('Failed to parse AI match output:', raw);
      throw new Error('DeepSeek match parsing failed');
    }
  }

  return matches.map(m => ({
    id: simplifiedItems[m.index].id,
    matchPercentage: m.matchPercentage
  }));
};

module.exports = {
  processItemDescription,
  matchLostItem
};