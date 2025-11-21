const getMatchItemPrompt = (query, simplifiedItems) => `
You are a matching engine for a Lost & Found service.
User lost item description: "${query}"
Items list: ${JSON.stringify(simplifiedItems)}

Instructions:
- Compare each item with the description.
- Assign a "matchPercentage" (float between 0.0 and 1.0).
- Only include items with matchPercentage >= 0.7.
- Do NOT include anything else, no comments, notes, or extra text.
- Return **strict JSON** array only, like this:
[
  {"index":0,"matchPercentage":0.85},
  {"index":5,"matchPercentage":0.92}
]
`;

module.exports = { getMatchItemPrompt };