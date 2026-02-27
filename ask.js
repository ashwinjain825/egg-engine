function ask(userInput) {
    let kmap = generateKMap(userInput);
    let sop_pos = generateSOP_POS(userInput);
    let truthTable = generateTruthTable(userInput);

    const aiTemp = document.getElementById('aiMsgTemplate').content.cloneNode(true);
    const aiMsg = aiTemp.querySelector('.ai-msg');
    aiMsg.innerHTML = `
        <p><strong>Truth Table:</strong></p>
        <pre>${JSON.stringify(truthTable, null, 2)}</pre>
        <p><strong>SOP:</strong> ${sop_pos.SOP}</p>
        <p><strong>POS:</strong> ${sop_pos.POS}</p>
        <p><strong>K-Map:</strong></p>
        <pre>${JSON.stringify(kmap, null, 2)}</pre>
    `;
    const chatHistory = document.getElementById('chatHistory');
    chatHistory.appendChild(aiTemp);
    
}

