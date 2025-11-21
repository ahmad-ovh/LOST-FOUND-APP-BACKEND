const getMatchItemPrompt = (query, simplifiedItems) => `
You are a smart matching engine for a Lost & Found service.
User lost item description: "${query}"

Items list: ${JSON.stringify(simplifiedItems)}

Compare the description with each item and assign a "matchPercentage" (float 0.0-1.0).
Return strictly JSON: 
[
  {"index":0,"matchPercentage":...},
  {"index":1,"matchPercentage":...},
  ...
]
`;

module.exports = { getMatchItemPrompt };