require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');
const JSON5 = require('json5');

const app = express();
const port = 3000;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use(express.json());
app.use(express.static('.'));

app.post('/api/generate-story-quiz', async (req, res) => {
    try {
        const { text, numQuestions } = req.body;
        
        if (!text || !numQuestions) {
            return res.status(400).json({ error: 'Story text and number of questions are required.' });
        }

        const prompt = `Based on the following story, generate a quiz object with a title and exactly ${numQuestions} questions for Chapter 1.
CRITICAL RULES:
1. For the "q" field, you MUST wrap the target vocabulary word with asterisks (e.g., "The old man who owned the *house* smiled...") so it highlights properly in the app.
2. For the "k" field, use authentic Central Kurdish (Sorani) script (Arabic/Kurdish alphabet).
3. ORDER MATTERS: The FIRST item in "e", "k", and "a" MUST be the correct translation/definition for the target word. The remaining items after the first "|" pipe are wrong distractors.

Structure:
{
  "title": "Story Title",
  "chapters": {
    "1": [
      {
        "q": "Context sentence with *target* word.",
        "v": "B1",
        "e": "Correct English definition|Distractor 1|Distractor 2|Distractor 3|Distractor 4",
        "k": "Correct Kurdish translation|Distractor 1|Distractor 2|Distractor 3|Distractor 4",
        "a": "Correct Arabic translation|Distractor 1|Distractor 2|Distractor 3|Distractor 4"
      }
    ]
  }
}
Return raw JSON only, no markdown, no backticks.

Story: "${text}"`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a JSON generator. Output strictly valid JSON." },
                { role: "user", content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
        });

        let responseText = chatCompletion.choices[0]?.message?.content || '';
        responseText = responseText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();

        const cleanedText = responseText.replace(/[\u0000-\u001F]+/g, " ");
        
        // Use JSON5 to safely parse even if the AI misses a quote
        const quizData = JSON5.parse(cleanedText);
        res.json(quizData);

    } catch (error) {
        console.error('Error generating story quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz data from AI.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});