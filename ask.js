// ask.js

function ask(expr) {
    // We use setTimeout to let index.html finish appending the AI template to the DOM first
    setTimeout(() => {
        try {
            // 1. Generate all backend data using your logic files
            const truthTable = generateTruthTable(expr);
            const { sopIndices, posIndices, SOP, POS } = generateSOP_POS(expr); // <-- UPDATE THIS LINE
            const kmapData = generateKMap(expr);

            // 2. Find the most recently added AI message block in the chat history
            // We look for the main AI container cards
            const aiMessages = document.querySelectorAll('#chatHistory > div.space-y-6');
            const currentMsg = aiMessages[aiMessages.length - 1];

            if (!currentMsg) return;

            // 3. Inject Truth Table
            const tableHead = currentMsg.querySelector('thead tr');
            const tableBody = currentMsg.querySelector('tbody');
            
            if (truthTable.length > 0) {
                const variables = Object.keys(truthTable[0]).filter(k => k !== 'F');
                
                // Update Headers dynamically based on variables
                tableHead.innerHTML = variables.map(v => `<th class="pb-3">${v}</th>`).join('') + `<th class="pb-3 text-[#00ffc2]">OUT</th>`;
                
                // Update Rows
                tableBody.innerHTML = truthTable.map(row => `
                    <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
                        ${variables.map(v => `<td class="py-2">${row[v]}</td>`).join('')}
                        <td class="py-2 text-[#00ffc2] font-bold">${row.F}</td>
                    </tr>
                `).join('');
            }

            // 4. Inject SOP and POS Expressions dynamically
            // Target the divs directly using the classes from your HTML template
            const sopParent = currentMsg.querySelector('.text-purple-400').nextElementSibling;
            const posParent = currentMsg.querySelector('.text-blue-400').nextElementSibling;

            if (sopParent) {
                sopParent.innerHTML = `Σm(${sopIndices}) = <br><span class="text-purple-300">${SOP}</span>`;
            }
            if (posParent) {
                posParent.innerHTML = `ΠM(${posIndices}) = <br><span class="text-blue-300">${POS}</span>`;
            }

            // 5. Inject Dynamic K-Map
            const cards = currentMsg.querySelectorAll('.card-glass');
            const kmapCard = cards[1]; // The second card contains the K-Map
            const kmapContainer = kmapCard ? kmapCard.querySelector('.grid') : null;
                                  
            if (kmapContainer && kmapData) {
                // Update the title to show variable count
                const kmapTitle = kmapCard.querySelector('h3');
                if (kmapTitle) {
                    kmapTitle.innerText = `K-Map (${kmapData.variables.length}-Variable)`;
                }
                
                renderKMapUI(kmapContainer, kmapData);
            }

            // 6. Inject Dynamic Circuit Schematic
            const schematicContainer = currentMsg.querySelector('.bg-\\[\\#030303\\]'); // Selects the black schematic box
            
            if (schematicContainer) {
                const ast = generateSchematicAST(expr);
                const schematicHTML = renderSchematicHTML(ast);
                
                // Wrap the rendered tree with the final Output (Q) wire
                schematicContainer.innerHTML = `
                    <div class="flex items-center justify-center w-full h-full overflow-x-auto p-4 z-10">
                        ${schematicHTML}
                        <div class="w-8 h-[2px] bg-[#00ffc2] shadow-[0_0_10px_#00ffc2]"></div>
                        <span class="font-mono text-xs font-bold text-[#00ffc2] ml-2 bg-black px-2 py-1 rounded">OUT</span>
                    </div>
                    <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 20px 20px;"></div>
                `;
            }

        } catch (error) {
            console.error("EGG Engine Error:", error.message);
            // If the user inputs an expression with >3 variables, it will throw an error. 
            // The catch block ensures the app doesn't crash completely.
        }
    }, 10); // 10ms delay is enough for the DOM to update
}

// Helper function to build the K-Map Grid dynamically
function renderKMapUI(container, data) {
    const { variables, kmap } = data;
    const n = variables.length;

    // Reset container classes
    container.className = "grid gap-1 mx-auto text-center font-mono mt-4 text-sm";
    let html = "";

    // -- 1 VARIABLE K-MAP --
    if (n === 1) {
        container.classList.add("grid-cols-2", "w-32");
        html += `<div class="text-gray-600"></div>`;
        html += `<div class="text-xs text-[#00ffc2] self-center font-bold">${variables[0]}</div>`;
        
        html += `<div class="text-xs text-gray-400 self-center">0</div>`;
        html += getKmapCell(kmap[0]);
        
        html += `<div class="text-xs text-gray-400 self-center">1</div>`;
        html += getKmapCell(kmap[1]);
    } 
    
    // -- 2 VARIABLE K-MAP --
    else if (n === 2) {
        container.classList.add("grid-cols-3", "w-48");
        const v1 = variables[0];
        const v2 = variables[1];

        html += `<div class="text-[#00ffc2] border-b border-r border-white/10 p-1 text-[10px] text-left leading-none relative font-bold"><span class="absolute bottom-1 left-1">${v1}</span><span class="absolute top-1 right-1">${v2}</span></div>`;
        html += `<div class="text-xs text-gray-400 self-center">0</div>`;
        html += `<div class="text-xs text-gray-400 self-center">1</div>`;

        // Row A=0
        html += `<div class="text-xs text-gray-400 self-center">0</div>`;
        html += getKmapCell(kmap[0]); // 00
        html += getKmapCell(kmap[1]); // 01

        // Row A=1
        html += `<div class="text-xs text-gray-400 self-center">1</div>`;
        html += getKmapCell(kmap[3]); // 10 (Note: array index 3 because of Gray Code generation)
        html += getKmapCell(kmap[2]); // 11
    }
    
    // -- 3 VARIABLE K-MAP --
    else if (n === 3) {
        container.classList.add("grid-cols-5", "w-full", "max-w-xs");
        const v1 = variables[0];
        const v23 = variables[1] + variables[2];

        html += `<div class="text-[#00ffc2] border-b border-r border-white/10 p-1 text-[10px] text-left leading-none relative font-bold min-h-[30px]"><span class="absolute bottom-1 left-1">${v1}</span><span class="absolute top-1 right-1">${v23}</span></div>`;
        html += `<div class="text-xs text-gray-400 self-center">00</div>`;
        html += `<div class="text-xs text-gray-400 self-center">01</div>`;
        html += `<div class="text-xs text-gray-400 self-center">11</div>`;
        html += `<div class="text-xs text-gray-400 self-center">10</div>`;

        // Row A=0
        html += `<div class="text-xs text-gray-400 self-center">0</div>`;
        html += getKmapCell(kmap[0][0]); // 000
        html += getKmapCell(kmap[0][1]); // 001
        html += getKmapCell(kmap[0][2]); // 011
        html += getKmapCell(kmap[0][3]); // 010

        // Row A=1
        html += `<div class="text-xs text-gray-400 self-center">1</div>`;
        html += getKmapCell(kmap[1][0]); // 100
        html += getKmapCell(kmap[1][1]); // 101
        html += getKmapCell(kmap[1][2]); // 111
        html += getKmapCell(kmap[1][3]); // 110
    }

    container.innerHTML = html;
}

// Helper function to style 1s and 0s in the K-Map
function getKmapCell(val) {
    if (val === 1) {
        return `<div class="bg-[#00ffc2]/20 border border-[#00ffc2]/40 p-2 md:p-3 rounded text-white font-bold shadow-[0_0_10px_rgba(0,255,194,0.15)] transition-all hover:bg-[#00ffc2]/30 cursor-crosshair">1</div>`;
    } else {
        return `<div class="bg-white/5 border border-white/10 p-2 md:p-3 rounded text-gray-600 transition-all hover:bg-white/10">0</div>`;
    }
}