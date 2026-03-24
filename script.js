// 1. PASTE YOUR NEW API KEY HERE
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

    // Professional Prompt
    const promptText = `Act as an expert IoT Engineer. Create a detailed project guide for: "${idea}". 
    Include sections for Title, Description, Components Table, Circuit Connections, Code, and Working Principle. 
    Use clear headings and bold text.`;

    try {
        // Updated URL for Gemini 1.5 Flash (Most stable version)
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let aiResponse = data.candidates[0].content.parts[0].text;
            
            // Format the text to look good on the website
            output.innerHTML = formatAIResponse(aiResponse);
            output.classList.remove('hidden');
        } else {
            throw new Error("AI returned an empty response.");
        }

    } catch (error) {
        console.error("Technical Error:", error);
        alert("Error: " + error.message);
    } finally {
        loader.classList.add('hidden');
    }
});

// Function to format Markdown-style text to HTML
function formatAIResponse(text) {
    return text
        .replace(/### (.*)/g, '<h3 style="color:#38bdf8; margin-top:20px;">$1</h3>')
        .replace(/## (.*)/g, '<h2 style="color:#38bdf8; margin-top:25px;">$1</h2>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/```cpp([\s\S]*?)```/g, '<div style="position:relative"><pre><code>$1</code></pre></div>')
        .replace(/\n/g, '<br>');
}
