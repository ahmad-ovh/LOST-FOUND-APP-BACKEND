const axios = require('axios');

const API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

if (!API_KEY) throw new Error("DEEPSEEK_API_KEY not set in environment variables");

async function callDeepSeek(prompt) {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: 'You are a helpful Lost & Found AI assistant. You always adhere to the JSON output as specified without any extra words before it or after it.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0,
        max_tokens: 500
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      }
    );

    const message = response.data.choices[0].message.content;
    return message;
  } catch (err) {
    console.error('DeepSeek API error:', err.response?.data || err.message);
    throw new Error('DeepSeek API call failed');
  }
}

module.exports = { callDeepSeek };