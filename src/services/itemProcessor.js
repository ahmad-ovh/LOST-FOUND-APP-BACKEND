const getProcessItemPrompt = (description) => `
You are a Lost & Found assistant.
Input: "${description}"

Task:
1. Categorize into one of [Electronics, Apparel, Bags, Keys, Books, Accessories, Other]
2. Summarize description into a single clear sentence
3. Extract 3-5 relevant keywords as tags

Return strictly JSON:
{
  "category": "...",
  "summary": "...",
  "tags": ["...", "..."]
}
`;

module.exports = { getProcessItemPrompt };