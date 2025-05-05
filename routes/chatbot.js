const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST route to interact with the OpenAI API
router.post('/', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Use the desired model
      messages: [{ role: "user", content: "Hello, OpenAI!" }],
      max_tokens: 50,
      max_completion_tokens: 100,
      temperature: 0.7,

    });

    res.status(200).json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error with OpenAI API:', error.message);
    res.status(500).json({
      error: error.message || 'An error occurred while processing your request.',
    });
  }
});

module.exports = router;
