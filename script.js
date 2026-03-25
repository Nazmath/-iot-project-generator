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

    // UI Setup: Show loading and hide previous output
    loader.classList.remove('hidden');
    output.classList.add('hidden');
    output.innerHTML = "";

    const promptText = `Act as an expert IoT Engineer. Generate a full, detailed project guide for: "${idea}". Include Title, Components, Connections, and Code.`;

    try {
        // ULTIMATE STABLE URL (v1beta + gemini-1.5-flash)
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        // If Google sends back an error, we catch it here
        if (data.error) {
            console.error("Google Error:", data.error);
            alert("AI Error: " + data.error.message);
            return;
        }

        // Successfully received the project guide
        if (data.candidates && data.candidates[0].content) {
            const aiText = data.candidates[0].content.parts[0].text;
            
            // Basic Markdown to HTML converter
            output.innerHTML = aiText
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/### (.*)/g, '<h3 style="color:#38bdf8; margin-top:20px;">$1</h3>')
                .replace(/## (.*)/g, '<h2 style="color:#38bdf8; margin-top:25px;">$1</h2>')
                .replace(/```cpp([\s\S]*?)```/g, '<div style="background:#000; padding:15px; border-radius:8px; margin:10px 0;"><pre><code>$1</code></pre></div>')
                .replace(/\n/g, '<br>');

            output.classList.remove('hidden');
        } else {
            alert("The AI returned an empty response. Try refreshing.");
        }

    } catch (error) {
        console.error("Technical Error:", error);
        alert("Technical Error: " + error.message);
    } finally {
        loader.classList.add('hidden');
    }
});
