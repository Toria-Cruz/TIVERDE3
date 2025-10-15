document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------
    // Constantes e Variáveis Globais
    // -------------------------------
    const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'http://backend:5000';
    
    // URL do backend para o chat. No HTML ele estava incorreto
    const CHAT_URL = `${BASE_URL}/api/chat`;

    const mesesOrdem = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

    // Instâncias dos gráficos
    const Charts = { consumo: null, analise: null, consumoTipo: null }; 

    // Variáveis DOM
    const mesSelect = document.getElementById('mes-info-tabela');
    const anoSelect = document.getElementById('ano-info-tabela');
    const tabelaContainer = document.getElementById('tabela-info');
    
    // Elementos do Chat
    const chatButton = document.getElementById('chatButton'); 
    const chatboxEl = document.getElementById('chatbox');
    const chatMessagesEl = document.getElementById('chatMessages'); 
    const chatInputEl = document.getElementById('userInput'); 
    const chatSendEl = document.getElementById('chatSendEl'); 
    
    // IDs e Classes dos gráficos
    const ID_GRAFICO_BARRAS = 'consumoChart'; 
    const ID_GRAFICO_PIZZA = 'consumoTipoChart';
    const ID_GRAFICO_LINHA = 'analiseChart';
    const CLASSES_BARRAS = 'img-kamila img-top-space';
    const CLASSES_LINHA = 'img-kamila1 img-fluid';


    // Função que destrói o Chart e RECIRA o Canvas no DOM de forma segura
    function resetAndRecreateCanvas(chartRef, chartName, canvasId, classNames = '') {
        // 1. Destrói a instância anterior do Chart.js
        if (chartRef && chartRef.destroy) {
            chartRef.destroy();
            Charts[chartName] = null; // Zera a referência no objeto global
        }

        // 2. Remove o elemento Canvas existente
        const oldCanvas = document.getElementById(canvasId);
        const parent = oldCanvas ? oldCanvas.parentElement : null;

        if (oldCanvas) {
            oldCanvas.remove();
        }

        // 3. Cria e insere um novo Canvas com o mesmo ID
        if (parent) {
            const newCanvas = document.createElement('canvas');
            newCanvas.id = canvasId;
            if (classNames) newCanvas.className = classNames; 
            parent.appendChild(newCanvas);
            return newCanvas;
        }
        
        // Se a recriação falhou (sem parent), retorna o elemento se ele existir
        return document.getElementById(canvasId); 
    }


    // -------------------------------
    // 1️⃣ Gráficos
    // -------------------------------
  async function fetchConsumo(ano = null) {
    try {
        const url = ano ? `${BASE_URL}/api/consumo/por-ano?ano=${ano}` : `${BASE_URL}/api/consumo`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        data.sort((a,b)=> mesesOrdem.indexOf(a.mes) - mesesOrdem.indexOf(b.mes));
        
        // 1. ✅ Limpeza e Recriação Segura com o ID CORRETO ('consumoChart')
        const canvasElement = resetAndRecreateCanvas(
            Charts.consumo, 
            'consumo', 
            ID_GRAFICO_BARRAS, // <-- ID_GRAFICO_BARRAS é 'consumoChart'
            CLASSES_BARRAS
        );

        if (!canvasElement) {
            // Se o canvasElement ainda for null, significa que o container pai não foi encontrado
            console.error(`Canvas '${ID_GRAFICO_BARRAS}' ou seu container não encontrado. Verifique seu HTML.`);
            return;
        }

        const ctx = canvasElement.getContext('2d'); // ✅ AGORA funciona!
        
        // 2. Cria o novo gráfico
        Charts.consumo = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.mes),
                datasets: [{
                    label: 'Consumo em kWh',
                    data: data.map(d => d.consumo),
                    backgroundColor: 'rgba(75,192,192,0.6)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Consumo (kWh)' } },
                    x: { title: { display: true, text: 'Mês' } }
                }
            }
        });
    } catch (err) {
        console.error('Erro ao buscar consumo:', err);
        
        // 3. ✅ Tratamento de erro com o ID CORRETO
        const parent = document.getElementById(ID_GRAFICO_BARRAS)?.parentElement;
        if (parent) {
             parent.innerHTML = '<p class="text-danger text-center">Não foi possível carregar o gráfico de consumo.</p>';
        }
    }
}

    async function fetchAnalise() {
        try {
            const response = await fetch(`${BASE_URL}/api/consumo`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            const dataByYear = {};
            data.forEach(item => {
                if (!dataByYear[item.ano]) dataByYear[item.ano] = new Array(12).fill(0);
                const idx = mesesOrdem.indexOf(item.mes);
                if(idx !== -1) dataByYear[item.ano][idx] = item.consumo;
            });

            const datasets = Object.keys(dataByYear).sort().map(ano => {
                const color = `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)},1)`;
                return { label: `Consumo ${ano}`, data: dataByYear[ano], borderColor: color, backgroundColor: color.replace('1)','0.2)'), fill: false, tension: 0.1 };
            });

            // ✅ Limpeza e Recriação
            const canvasElement = resetAndRecreateCanvas(Charts.analise, 'analise', ID_GRAFICO_LINHA, CLASSES_LINHA);
            
            if (!canvasElement) {
                console.error(`Canvas '${ID_GRAFICO_LINHA}' não encontrado. Verifique seu HTML.`);
                return;
            }
            const ctx = canvasElement.getContext('2d');
            
            Charts.analise = new Chart(ctx, {
                type: 'line',
                data: { labels: mesesOrdem, datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: { legend: { position: 'top' }, title: { display: true, text: 'Consumo Mensal por Ano (kWh)' } },
                    scales: { x: { title: { display: true, text: 'Meses do Ano' } }, y: { beginAtZero: true, title: { display: true, text: 'Energia Consumida (kWh)' } } }
                }
            });

        } catch (err) {
            console.error('Erro ao buscar análise multi-ano:', err);
            const parent = document.getElementById(ID_GRAFICO_LINHA)?.parentElement;
            if (parent) {
                parent.innerHTML = '<p class="text-danger text-center">Não foi possível carregar o gráfico de análise.</p>';
            }
        }
    }

    async function fetchConsumoTipo(ano) { 
        try {
            const response = await fetch(`${BASE_URL}/api/consumo-equipamento/consumo-tipo/${ano}`); 
            const data = await response.json();

            // ✅ Limpeza e Recriação
            const canvasElement = resetAndRecreateCanvas(Charts.consumoTipo, 'consumoTipo', ID_GRAFICO_PIZZA);

            // Se não houver dados, exibe a mensagem de fallback.
            if (!data || Object.keys(data).length === 0) {
                console.warn('Nenhum dado encontrado para este ano');
                if (canvasElement?.parentElement) {
                    canvasElement.parentElement.innerHTML = '<p class="text-center">Não há dados de consumo por tipo para este ano.</p>';
                }
                return;
            }

            const labels = Object.keys(data);
            const valores = Object.values(data);

            if (!canvasElement) {
                console.error(`Canvas '${ID_GRAFICO_PIZZA}' não encontrado. Verifique seu HTML.`);
                return;
            }
            const ctx = canvasElement.getContext('2d');
            
            Charts.consumoTipo = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: valores,
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#00C49F', '#FF9F40']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'bottom' },
                        title: { display: true, text: `Consumo por Tipo (${ano})` }
                    }
                }
            });
        } catch (err) {
            console.error('Erro ao buscar consumo por tipo:', err);
            const parent = document.getElementById(ID_GRAFICO_PIZZA)?.parentElement;
            if (parent) {
                parent.innerHTML = '<p class="text-danger text-center">Não foi possível carregar o gráfico de consumo por tipo.</p>';
            }
        }
    }

    // -------------------------------
    // 2️⃣ Popula selects de anos
    // -------------------------------
    async function populateAnoPicker() {
        try {
            const response = await fetch(`${BASE_URL}/api/consumo/anos-disponiveis`);
            const anos = await response.json();
            const anoPicker = document.getElementById('ano-picker');
            
            if (!anoPicker) { console.warn("Elemento 'ano-picker' não encontrado."); return; }
            
            anoPicker.innerHTML = '';
            // Garante que haja pelo menos o ano atual para o Math.max
            const latest = Math.max(...(anos.length > 0 ? anos : [new Date().getFullYear()]));
            
            anos.forEach(ano => {
                const opt = document.createElement('option');
                opt.value = ano; opt.textContent = ano;
                if(ano === latest) opt.selected = true;
                anoPicker.appendChild(opt);
            });

            fetchConsumo(latest); 
            anoPicker.addEventListener('change', e => fetchConsumo(parseInt(e.target.value)));
            
        } catch(err) { console.error('Erro ao popular anos:', err); }
    }

    async function populateAnoPickerPizza() {
        try {
            const response = await fetch(`${BASE_URL}/api/consumo-equipamento/anos-disponiveis-consumo-tipo`);
            const anos = await response.json();

            const anoPicker = document.getElementById('ano-picker-pizza');
            
            if (!anoPicker) { console.warn("Elemento 'ano-picker-pizza' não encontrado."); return; }
            
            anoPicker.innerHTML = '';

            const latest = Math.max(...(anos.length > 0 ? anos : [new Date().getFullYear()]));

            anos.forEach(ano => {
                const opt = document.createElement('option');
                opt.value = ano; opt.textContent = ano;
                if (ano === latest) opt.selected = true;
                anoPicker.appendChild(opt);
            });

            fetchConsumoTipo(latest);
            anoPicker.addEventListener('change', e => fetchConsumoTipo(parseInt(e.target.value)));

        } catch (err) { console.error('Erro ao popular anos pizza:', err); }
    }
    
    async function populateAnoTabelaPicker() {
        try {
            const response = await fetch(`${BASE_URL}/api/consumo/anos-disponiveis`);
            const anos = await response.json();
            
            if (!anoSelect) { console.warn("Elemento 'ano-info-tabela' não encontrado."); return; }

            anoSelect.innerHTML = '<option value="">Selecione o ano</option>';
            const latest = Math.max(...(anos.length > 0 ? anos : [new Date().getFullYear()]));
            anos.forEach(ano => {
                const opt = document.createElement('option');
                opt.value = ano;
                opt.textContent = ano;
                if(ano === latest) opt.selected = true;
                anoSelect.appendChild(opt);
            });
            tabelaContainer.innerHTML = '<p class="text-center">Selecione um mês e ano para ver os detalhes.</p>';
            
            // Chama o fetch inicial após popular os selects (opcional, dependendo do seu design)
            if (anoSelect.value) {
                fetchTabelaDetalhe();
            }

        } catch(err){
            console.error(err);
            tabelaContainer.innerHTML = '<p class="text-danger text-center">Erro ao popular anos da tabela.</p>';
        }
    }
    
    // -------------------------------
    // Funções de Tabela e Dispositivos
    // -------------------------------
    async function fetchDispositivos() {
        try {
            const response = await fetch(`${BASE_URL}/api/dispositivos/resumo-ativos`);
            const data = await response.json();
            const container = document.getElementById('device-list-container');
            
            if (!container) return; 
            
            const ativos = data.filter(d => d.ativo);
            container.innerHTML = ativos.length > 0
                ? ativos.map(d => `<p>${d.nome} (${d.tipo}) - Consumo: ${d.consumoKWh} kWh</p>`).join('')
                : '<p>Nenhum dispositivo ativo.</p>';
        } catch(err) {
            console.error(err);
            document.getElementById('device-list-container').innerHTML = '<p class="text-danger">Erro ao carregar dispositivos.</p>';
        }
    }

    async function fetchTabelaDetalhe() {
        const ano = anoSelect.value;
        // Não é necessário o mês para o endpoint atual, mas pode ser adicionado se o backend mudar.
        // const mes = mesSelect.value; 

        if (!ano) { 
            tabelaContainer.innerHTML = '<p class="text-center">Selecione um ano.</p>'; 
            return; 
        }

        try {
            const response = await fetch(`${BASE_URL}/api/consumo-equipamento/consumo-tipo/${ano}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const dados = await response.json();

            let html = '<table class="table table-bordered table-striped">';
            html += '<thead class="table-info"><tr><th>Tipo</th><th>Consumo (kWh)</th></tr></thead><tbody>';

            if (Object.keys(dados).length > 0) {
                Object.entries(dados).forEach(([tipo, consumo]) => {
                    html += `<tr><td>${tipo}</td><td>${parseFloat(consumo).toFixed(2)}</td></tr>`;
                });
            } else {
                html += `<tr><td colspan="2" class="text-center">Nenhum dado de consumo encontrado para o ano ${ano}.</td></tr>`;
            }

            html += '</tbody></table>';
            tabelaContainer.innerHTML = html;

        } catch (err) {
            console.error(err);
            tabelaContainer.innerHTML = '<p class="text-danger text-center">Erro ao carregar dados da tabela.</p>';
        }
    }

    if (anoSelect) {
        // Event listener só no ano, conforme o endpoint atual
        anoSelect.addEventListener('change', fetchTabelaDetalhe);
    }
    
    // -------------------------------
    // 3️⃣ Funções do Chatbot (Integradas)
    // -------------------------------

    function toggleChat() {
        if (!chatboxEl) return;
        chatboxEl.style.display = chatboxEl.style.display === "flex" ? "none" : "flex";
        chatboxEl.style.flexDirection = "column";
    }

    function addMessage(text, sender) {
        if (!chatMessagesEl) return;
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender);
        // Usamos innerText para segurança contra XSS, assumindo que o reply do bot é texto puro
        msgDiv.innerText = text; 
        chatMessagesEl.appendChild(msgDiv);
        chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
    }

    async function sendChat(message) {
        if(!message) return;
        addMessage(message, "user");
        chatInputEl.value = '';

        try {
            const response = await fetch(CHAT_URL, {
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({message})
            });
            const data = await response.json();
            addMessage(data.reply || "Sem resposta do servidor.", "bot");
        } catch(err) {
            console.error('Erro ao enviar mensagem:', err);
            addMessage(`Ops! Não consegui me conectar ao servidor.`, "bot");
        }
    }
    

    // -------------------------------
    // 4️⃣ Event Listeners de Chat
    // -------------------------------
    if(chatButton) {
        // Usa o listener do JS, pois o onclick foi removido do HTML
        chatButton.addEventListener('click', toggleChat); 
    }

    if(chatMessagesEl && chatInputEl && chatSendEl) {
        // Envia mensagem pelo botão
        chatSendEl.addEventListener('click', ()=>sendChat(chatInputEl.value));
        // Envia mensagem pela tecla Enter
        chatInputEl.addEventListener('keypress', e => { 
            if(e.key==='Enter') sendChat(chatInputEl.value); 
        });
    }

     // -------------------------------
    // 5️⃣ Inicialização Principal (Em Sequência para Evitar Concorrência)
    // -------------------------------
    async function initializeAll() {
        console.log("Iniciando a carga sequencial dos dados...");
        
        // 1. Popula selects (necessário para os gráficos)
        await populateAnoPicker(); 
        await populateAnoPickerPizza();
        await populateAnoTabelaPicker();
        
        // 2. Carrega dispositivos (não interfere nos gráficos)
        fetchDispositivos();
        
        // 3. Carrega os gráficos críticos em sequência
        // Consumo em kWh (Barra)
        const anoConsumo = document.getElementById('ano-picker')?.value;
        if (anoConsumo) {
            console.log("Carregando Gráfico de Consumo (Barra)...");
            await fetchConsumo(parseInt(anoConsumo));
        }

        // Análise Gráfica (Linha)
        console.log("Carregando Gráfico de Análise (Linha)...");
        await fetchAnalise();             
        
        // Consumo por Tipo (Pizza)
        const anoPizza = document.getElementById('ano-picker-pizza')?.value;
        if (anoPizza) {
            console.log("Carregando Gráfico de Consumo por Tipo (Pizza)...");
            await fetchConsumoTipo(parseInt(anoPizza));
        }
        
        console.log("Carga de dados concluída.");
    }
    
    // Chamada única da inicialização sequencial
    initializeAll();

}); // Fim do DOMContentLoaded