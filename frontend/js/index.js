document.addEventListener('DOMContentLoaded', function() {
    const BASE_URL = 'http://localhost:9000';
    let consumoChartInstance = null;
    let analiseChartInstance = null;
    let consumoTipoChartInstance = null;

    // --- Lógica para o Gráfico de Consumo em kWh ---
    async function fetchConsumoData(ano = null) {
        try {
            let url = `${BASE_URL}/api/consumo`;
            if (ano) {
                url = `${BASE_URL}/api/consumo/por-ano?ano=${ano}`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const mesesOrdem = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
            data.sort((a, b) => mesesOrdem.indexOf(a.mes) - mesesOrdem.indexOf(b.mes));

            const meses = data.map(item => item.mes);
            const consumos = data.map(item => item.consumo);

            const ctx = document.getElementById('consumoChart').getContext('2d');

            if (consumoChartInstance) {
                consumoChartInstance.destroy();
            }

            consumoChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: meses,
                    datasets: [{
                        label: 'Consumo em kWh',
                        data: consumos,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Consumo (kWh)'
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Mês'
                            }
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: true
                }
            });

        } catch (error) {
            console.error('Erro ao buscar dados de consumo:', error);
            const chartContainer = document.getElementById('consumoChart').parentElement;
            chartContainer.innerHTML = '<p>Não foi possível carregar o gráfico de consumo.</p>';
        }
    }

    // --- Lógica para popular o seletor de anos (Consumo em kWh) ---
    async function populateAnoPicker() {
        try {
            const response = await fetch(`${BASE_URL}/api/consumo/anos-disponiveis`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const anos = await response.json();
            const anoPicker = document.getElementById('ano-picker');

            anoPicker.innerHTML = '';

            let latestAno = null;
            if (anos && anos.length > 0) {
                latestAno = Math.max(...anos);
            }

            anos.forEach(ano => {
                const option = document.createElement('option');
                option.value = ano;
                option.textContent = ano;
                if (ano === latestAno) {
                    option.selected = true;
                }
                anoPicker.appendChild(option);
            });

            if (latestAno) {
                fetchConsumoData(latestAno);
            } else {
                fetchConsumoData(null);
            }

            anoPicker.addEventListener('change', (event) => {
                const selectedAno = event.target.value;
                fetchConsumoData(selectedAno ? parseInt(selectedAno) : null);
            });

        } catch (error) {
            console.error('Erro ao popular o seletor de anos:', error);
        }
    }

    // --- Lógica para o Gráfico de Análise Gráfica (Comparação Multi-Ano) ---
    async function fetchAnaliseData() {
        try {
            const response = await fetch(`${BASE_URL}/api/consumo`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const allConsumoData = await response.json();

            const dataByYear = {};
            const mesesOrdem = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

            allConsumoData.forEach(item => {
                if (!dataByYear[item.ano]) {
                    dataByYear[item.ano] = new Array(12).fill(0);
                }
                const mesIndex = mesesOrdem.indexOf(item.mes);
                if (mesIndex !== -1) {
                    dataByYear[item.ano][mesIndex] = item.consumo;
                }
            });

            const datasets = Object.keys(dataByYear).sort().map(year => {
                const randomColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`;
                return {
                    label: `Consumo ${year}`,
                    data: dataByYear[year],
                    borderColor: randomColor,
                    backgroundColor: randomColor.replace('1)', '0.2)'),
                    fill: false,
                    tension: 0.1
                };
            });

            const ctx = document.getElementById('analiseChart').getContext('2d');

            if (analiseChartInstance) {
                analiseChartInstance.destroy();
            }

            analiseChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: mesesOrdem,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: true,
                            text: 'Consumo Mensal por Ano (kWh)'
                        }
                    },
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Meses do Ano'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Energia Consumida (kWh)'
                            }
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Erro ao buscar dados para análise gráfica:', error);
            const chartContainer = document.getElementById('analiseChart').parentElement;
            chartContainer.innerHTML = '<p>Não foi possível carregar o gráfico de análise multi-ano.</p>';
        }
    }

    // --- Lógica para a Lista de Dispositivos e Equipamentos ---
    async function fetchDispositivosData() {
        try {
            const response = await fetch(`${BASE_URL}/api/dispositivos/resumo-ativos`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            const deviceListContainer = document.getElementById('device-list-container');
            let htmlContent = '';
            if (Object.keys(data).length > 0) {
                for (const tipo in data) {
                    htmlContent += `<p>${tipo}: ${data[tipo]}</p>`;
                }
            } else {
                htmlContent = '<p>Nenhum dispositivo ativo encontrado.</p>';
            }
            deviceListContainer.innerHTML = htmlContent;

        } catch (error) {
            console.error('Erro ao buscar dados de dispositivos:', error);
            const deviceListContainer = document.getElementById('device-list-container');
            deviceListContainer.innerHTML = '<p>Não foi possível carregar a lista de dispositivos.</p>';
        }
    }

    // --- Lógica para o Gráfico de Pizza (Consumo por Tipo de Equipamento) ---
    async function fetchConsumoTipoData(ano) {
        try {
            const response = await fetch(`${BASE_URL}/api/consumo-equipamento/resumo-por-tipo?ano=${ano}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json(); // Ex: {"Ar-condicionado": 500, "Lâmpada LED": 150}

            const labels = Object.keys(data);
            const consumoValores = Object.values(data);

            const backgroundColors = [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900', '#C9CBCF', '#E7E9ED'
            ];
            const borderColors = [
                '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9900', '#C9CBCF', '#E7E9ED'
            ];


            const ctx = document.getElementById('consumoTipoChart').getContext('2d');

            if (consumoTipoChartInstance) {
                consumoTipoChartInstance.destroy();
            }

            consumoTipoChartInstance = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: consumoValores,
                        backgroundColor: backgroundColors.slice(0, labels.length),
                        borderColor: borderColors.slice(0, labels.length),
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            position: 'right',
                        },
                        title: {
                            display: true,
                            text: `Consumo por Tipo de Equipamento em ${ano} (kWh)`
                        }
                    }
                }
            });

        } catch (error) {
            console.error('Erro ao buscar dados de consumo por tipo:', error);
            const chartContainer = document.getElementById('consumoTipoChart').parentElement;
            chartContainer.innerHTML = '<p>Não foi possível carregar o gráfico de consumo por tipo.</p>';
        }
    }

    // --- Lógica para popular o seletor de anos (Gráfico de Pizza) ---
    async function populateAnoPickerPizza() {
        try {
            const response = await fetch(`${BASE_URL}/api/consumo-equipamento/anos-disponiveis-consumo-tipo`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const anos = await response.json();
            const anoPickerPizza = document.getElementById('ano-picker-pizza');

            anoPickerPizza.innerHTML = '';

            let latestAno = null;
            if (anos && anos.length > 0) {
                latestAno = Math.max(...anos);
            }

            anos.forEach(ano => {
                const option = document.createElement('option');
                option.value = ano;
                option.textContent = ano;
                if (ano === latestAno) {
                    option.selected = true;
                }
                anoPickerPizza.appendChild(option);
            });

            if (latestAno) {
                fetchConsumoTipoData(latestAno);
            } else {
                console.warn("Nenhum dado de ano disponível para o gráfico de pizza.");
            }

            anoPickerPizza.addEventListener('change', (event) => {
                const selectedAno = event.target.value;
                fetchConsumoTipoData(parseInt(selectedAno));
            });

        } catch (error) {
            console.error('Erro ao popular o seletor de anos do gráfico de pizza:', error);
        }
    }

    // --- Lógica para a Tabela de Informações de Consumo Mensal (MODIFICADA) ---
    const mesInfoTabelaSelect = document.getElementById('mes-info-tabela');
    const anoInfoTabelaSelect = document.getElementById('ano-info-tabela');
    const tabelaInfoContainer = document.getElementById('tabela-info');

    // Função para buscar e exibir os dados da tabela
    async function fetchTabelaConsumoDetalhe() {
        const selectedMes = mesInfoTabelaSelect.value;
        const selectedAno = anoInfoTabelaSelect.value;

        if (!selectedMes || !selectedAno) {
            tabelaInfoContainer.innerHTML = '<p>Selecione um mês e um ano para ver os detalhes de consumo.</p>';
            return;
        }

        try {
            const url = `${BASE_URL}/api/consumo-equipamento/detalhe-por-mes-ano?mes=${selectedMes}&ano=${selectedAno}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const dados = await response.json();

            let html = '<table class="table table-bordered table-striped">'; // Adicionado table-striped para melhor visualização
            html += '<thead class="table-info"><tr>';
            html += '<th>Equipamento</th><th>Tipo</th><th>Consumo (kWh)</th><th>Mês</th><th>Ano</th>';
            html += '</tr></thead><tbody>';

            if (dados.length > 0) {
                dados.forEach(item => {
                    html += `<tr>
                        <td>${item.dispositivo.nome}</td>
                        <td>${item.dispositivo.tipo}</td>
                        <td>${item.consumoKWh} kWh</td>
                        <td>${item.mes}</td>
                        <td>${item.ano}</td>
                    </tr>`;
                });
            } else {
                html += `<tr><td colspan="5">Nenhum dado de consumo encontrado para ${selectedMes} de ${selectedAno}.</td></tr>`;
            }
            html += '</tbody></table>';
            tabelaInfoContainer.innerHTML = html;

        } catch (error) {
            console.error('Erro ao buscar dados da tabela de consumo detalhado:', error);
            tabelaInfoContainer.innerHTML = '<p>Não foi possível carregar os detalhes de consumo.</p>';
        }
    }

    // Função para popular o picker de ano da tabela (usa o mesmo endpoint do gráfico de pizza)
    async function populateAnoInfoTabelaPicker() {
        try {
            const response = await fetch(`${BASE_URL}/api/consumo-equipamento/anos-disponiveis-consumo-tipo`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const anos = await response.json();

            anoInfoTabelaSelect.innerHTML = '<option value="">Selecione o ano</option>'; // Opção default
            let latestAno = null;
            if (anos && anos.length > 0) {
                latestAno = Math.max(...anos);
            }

            anos.forEach(ano => {
                const option = document.createElement('option');
                option.value = ano;
                option.textContent = ano;
                if (ano === latestAno) { // Seleciona o ano mais recente por padrão
                    option.selected = true;
                }
                anoInfoTabelaSelect.appendChild(option);
            });

            // Se há um ano mais recente, tenta buscar os dados para ele, sem precisar de mês
            // (A lógica de fetchTabelaConsumoDetalhe já cuida de 'selectedMes' ser vazio)
            if (latestAno && mesInfoTabelaSelect.value) { // Só busca se um mês já estiver selecionado também
                fetchTabelaConsumoDetalhe();
            } else if (latestAno) { // Se não há mês selecionado, apenas mostra a mensagem
                tabelaInfoContainer.innerHTML = '<p>Selecione um mês para ver os detalhes de consumo.</p>';
            }


        } catch (error) {
            console.error('Erro ao popular o seletor de anos da tabela:', error);
            tabelaInfoContainer.innerHTML = '<p>Não foi possível carregar os anos disponíveis.</p>';
        }
    }

    // Adiciona event listeners para os pickers da tabela
    mesInfoTabelaSelect.addEventListener('change', fetchTabelaConsumoDetalhe);
    anoInfoTabelaSelect.addEventListener('change', fetchTabelaConsumoDetalhe);

    // Chama as funções para carregar os dados e renderizar os gráficos/listas ao carregar a página
    populateAnoPicker(); // Para Consumo em kWh
    fetchAnaliseData();
    fetchDispositivosData(); // Para a lista de dispositivos
    populateAnoPickerPizza(); // Para o seletor de anos do gráfico de pizza
    populateAnoInfoTabelaPicker(); // Popula o seletor de ano da tabela
    // A chamada inicial de fetchTabelaConsumoDetalhe é feita dentro de populateAnoInfoTabelaPicker,
    // se um ano padrão for selecionado.
});