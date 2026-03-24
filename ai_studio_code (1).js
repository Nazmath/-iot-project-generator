// Your Gemini API Key is now integrated
const API_KEY = "AIzaSyD0wF9nLUuQdZwQNPLh7d9OmH5zuME-acg"; 

const btn = document.getElementById('generateBtn');

btn.addEventListener('click', async () => {
    const userInput = document.getElementById('userInput').value;
    const outputDiv = document.getElementById('output');
    const loader = document.getElementById('loader');

    if (!userInput) {
        alert("Please enter a project idea!");
        return;
    }

    // UI Updates: Show loader, hide output
    loader.classList.remove('hidden');
    outputDiv.classList.add('hidden');
    outputDiv.innerHTML = ""; 

    // Professional Prompt for the AI
    const prompt = `Act as a professional IoT Engineer and Project Mentor. 
    Generate a complete, detailed, ready-to-build IoT project guide for the idea: "${userInput}".
    
    The response MUST be structured with these exact sections:
    1. Project Title
    2. Project Description (Simple words)
    3. Difficulty Level (Beginner/Intermediate/Advanced)
    4. Components Required (Create a Table with Name, Quantity, Purpose)
    5. Estimated Cost (In INR)
    6. Where to Purchase (Suggest Amazon India, Robu.in)
    7. Circuit Connections (Detailed list: Pin A -> Pin B)
    8. Source Code (Provide full Arduino/ESP32 code inside a code block)
    9. Working Principle (Step-by-step explanation)
    10. Future Improvements (At least 3 ideas)
    
    Use clear headings and professional language.`;

    try {
        // Calling the Gemini 1.5 Flash API (Faster for web tools)
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.candidates && data.candidates[0].content.parts[0].text) {
            const resultText = data.candidates[0].content.parts[0].text;
            
            // Format the AI response for the browser
            outputDiv.innerHTML = formatMarkdown(resultText);
            outputDiv.classList.remove('hidden');
        } else {
            throw new Error("Invalid response from AI");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Failed to generate project. Please check your API key or internet connection.");
    } finally {
        loader.classList.add('hidden');
    }
});

// Function to