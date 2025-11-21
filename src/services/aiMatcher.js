const getMatchItemPrompt = (query, simplifiedItems) => `
You are a matching engine for a Lost & Found service.
User lost item description: "${query}"
Items list: ${JSON.stringify(simplifiedItems)}

Compare each item and assign a "matchPercentage" (0.0-1.0).
Include only items with matchPercentage >= 0.7.
Return strictly JSON like this:
[
  {"index":0,"matchPercentage":0.85},
  {"index":5,"matchPercentage":0.92}
]
`;

module.exports = { getMatchItemPrompt };