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
        // CHANGED: We are now using 'v1' instead of 'v1beta' for better stability
        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        // Error checking
        if (data.error) {
            throw new Error(data.error.message);
        }

        if (data.candidates && data.candidates[0].content.parts[0].text) {
            let aiResponse = data.candidates[0].content.parts[0].text;
            
            // Convert simple markdown to HTML
            output.innerHTML = aiResponse
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/### (.*)/g, '<h3 style="color:#38bdf8; margin-top:20px;">$1</h3>')
                .replace(/## (.*)/g, '<h2 style="color:#38bdf8; margin-top:25px;">$1</h2>')
                .replace(/```cpp([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
                .replace(/\n/g, '<br>');
                
            output.classList.remove('hidden');
        } else {
            throw new Error("AI returned empty data. Check your API settings.");
        }

    } catch (error) {
        console.error("Technical Error:", error);
        alert("⚠️ Error: " + error.message);
    } finally {
        loader.classList.add('hidden');
    }
});
