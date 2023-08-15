const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci/completions';
const OPENAI_API_KEY = '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';  // 여기에 실제 API 키를 넣으세요.

// Body parser middleware
app.use(bodyParser.json());

// POST endpoint to handle text summarization
app.post('/summarize', async (req, res) => {
    console.log("Received request:", req.body);

    // Check for the text field in the request body
    if (!req.body.text) {
        res.status(400).json({ error: 'Text is required.' });
        return;
    }

    // Constructing the OpenAI API request payload
    const prompt = `'${req.body.text}' 위 이용약관을 요약해서 가독성 높게 만들고, 이 이용약관의 위험도를 타 이용약관과 비교해 5단계로 표시해줘. 이 이외의 다른 글은 포함하지 마.`;

    try {
        const response = await axios.post(OPENAI_API_URL, {
            prompt: prompt,
            //max_tokens: 1000  // adjust as needed
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Extracting the summarized text from the API response
        const summarizedText = response.data.choices[0].text.trim();

        // Send the summarized text as the response
        res.json({ summary: summarizedText });

    } catch (error) {
        console.error("OpenAI API error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to summarize the text." });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



app.get('/', (req, res) => {
    res.send("Server is running!");
});


