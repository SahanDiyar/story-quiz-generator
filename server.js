require('dotenv').config();
const express = require('express');
const Groq = require('groq-sdk');

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

        const prompt = `Based on the following story, generate exactly ${numQuestions} vocabulary/comprehension questions. 
Return ONLY a valid JSON array. No markdown formatting, no backticks, just raw JSON.
Each object in the array must have these exact keys:
- "q": Context sentence with the target word *highlighted* with asterisks.
- "v": CEFR vocabulary level (e.g., "B2", "A2", "C1").
- "e": Correct English option followed by 4 distractors, separated by vertical bars (|). Example: "Correct Option|Distractor 1|Distractor 2|Distractor 3|Distractor 4"
- "k": Kurdish translations of the options in the exact same order, separated by vertical bars (|).
- "a": Arabic translations of the options in the exact same order, separated by vertical bars (|).

Story: "${text}"`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are an assistant that outputs only valid JSON arrays." },
                { role: "user", content: prompt }
            ],
            model: 'llama-3.3-70b-versatile',
        });

        let responseText = chatCompletion.choices[0]?.message?.content || '';
        responseText = responseText.replace(/^```json\s*/, '').replace(/^```\s*/, '').replace(/\s*```$/, '').trim();

        const quizData = JSON.parse(responseText);
        res.json(quizData);

    } catch (error) {
        console.error('Error generating story quiz:', error);
        res.status(500).json({ error: 'Failed to generate quiz data from AI.' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});