// 1. PASTE YOUR NEW API KEY HERE (Ending in UeC0)
const API_KEY = "AIzaSyAmZ70b9cPzZlPlGUU4mCCZwa7Cr_9UeC0"; 

const generateBtn = document.getElementById('generateBtn');
const userInput = document.getElementById('userInput');
const loader = document.getElementById('loader');
const output = document.getElementById('output');

generateBtn.addEventListener('click', async () => {
    const idea = userInput.value.trim();
    if (!idea) {
        alert("Please enter a project idea!");
        return;
    }

    // UI Setup
    loader.classList.remove('hidden');
    output.classList.add('hidden');
    output.innerHTML = "";

    const promptText = `Act as an expert IoT Engineer. Create a detailed project guide for: "${idea}". 
    Include: Title, Description, Components Table, Circuit Connections, Code, and Working Principle.`;

    try {
        // CHANGED: Using 'gemini-pro' - the most stable model available
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        // Check for API errors
        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content) {
            let aiResponse = data.candidates[0].content.parts[0].text;
            
            // Format the AI text for the website
            output.innerHTML = formatAIResponse(aiResponse);
            output.classList.remove('hidden');
        } else {
            throw new Error("AI returned no data. Check your Google AI Studio settings.");
        }

    } catch (error) {
        console.error("Technical Error:", error);
        alert("⚠️ Error: " + error.message);
    } finally {
        loader.classList.add('hidden');
    }
});

// Function to make Markdown look like HTML
function formatAIResponse(text) {
    return text
        .replace(/### (.*)/g, '<h3 style="color:#38bdf8; margin-top:20px;">$1</h3>')
        .replace(/## (.*)/g, '<h2 style="color:#38bdf8; margin-top:25px;">$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/```cpp([\s\S]*?)```/g, '<div style="background:#000; padding:15px; border-radius:8px; margin:10px 0;"><pre><code>$1</code></pre></div>')
        .replace(/\n/g, '<br>');
}
