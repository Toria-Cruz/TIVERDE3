CREATE TABLE dispositivo (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    tipo VARCHAR(255),
    ativo BOOLEAN
);

CREATE TABLE usuario (
    id BIGINT PRIMARY KEY,
    nome VARCHAR(255),
    email VARCHAR(255)
);

CREATE TABLE consumo_equipamento (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dispositivo_id BIGINT NOT NULL,
    mes VARCHAR(255) NOT NULL,
    ano INT NOT NULL,
    consumokwh INT,
    FOREIGN KEY (dispositivo_id) REFERENCES dispositivo(id)
);

INSERT INTO dispositivo (nome, tipo, ativo) VALUES
('Ar-condicionado', 'Eletrodoméstico', true),
('Lâmpada LED', 'Iluminação', true),
('Computador', 'Eletrônico', false),
('Geladeira', 'Eletrodoméstico', true),
('Micro-ondas', 'Eletrodoméstico', false),
('TV LED', 'Eletrônico', true),
('Ventilador', 'Eletrodoméstico', true),
('Roteador', 'Tecnologia', true),
('Cafeteira', 'Eletrodoméstico', true),
('Impressora', 'Tecnologia', false);

INSERT INTO usuario (id, nome, email) VALUES
(1, 'Carlos Silva', 'carlos.silva@email.com'),
(2, 'Maria Oliveira', 'maria.oliveira@email.com'),
(3, 'João Pereira', 'joao.pereira@email.com'),
(4, 'Ana Santos', 'ana.santos@email.com'),
(5, 'Ricardo Almeida', 'ricardo.almeida@email.com'),
(6, 'Fernanda Costa', 'fernanda.costa@email.com'),
(7, 'Lucas Martins', 'lucas.martins@email.com'),
(8, 'Patrícia Lima', 'patricia.lima@email.com'),
(9, 'Eduardo Souza', 'eduardo.souza@email.com'),
(10, 'Beatriz Rocha', 'beatriz.rocha@email.com');

-- Dados para 2023
INSERT INTO consumo_equipamento (dispositivo_id, mes, ano, consumokwh) VALUES
(1, 'Janeiro', 2023, 40), (2, 'Janeiro', 2023, 10), (4, 'Janeiro', 2023, 50), (6, 'Janeiro', 2023, 20), (8, 'Janeiro', 2023, 5), -- Total Janeiro 2023: 125
(1, 'Fevereiro', 2023, 35), (2, 'Fevereiro', 2023, 8), (4, 'Fevereiro', 2023, 45), (6, 'Fevereiro', 2023, 18), (8, 'Fevereiro', 2023, 4), -- Total Fevereiro 2023: 110
(1, 'Março', 2023, 50), (2, 'Março', 2023, 12), (4, 'Março', 2023, 55), (6, 'Março', 2023, 22), (8, 'Março', 2023, 6), -- Total Março 2023: 145
(1, 'Abril', 2023, 60), (2, 'Abril', 2023, 15), (4, 'Abril', 2023, 65), (6, 'Abril', 2023, 28), (8, 'Abril', 2023, 7), -- Total Abril 2023: 175
(1, 'Maio', 2023, 55), (2, 'Maio', 2023, 13), (4, 'Maio', 2023, 60), (6, 'Maio', 2023, 25), (8, 'Maio', 2023, 6), -- Total Maio 2023: 159
(1, 'Junho', 2023, 58), (2, 'Junho', 2023, 14), (4, 'Junho', 2023, 62), (6, 'Junho', 2023, 26), (8, 'Junho', 2023, 7), -- Total Junho 2023: 167
(1, 'Julho', 2023, 65), (2, 'Julho', 2023, 16), (4, 'Julho', 2023, 70), (6, 'Julho', 2023, 30), (8, 'Julho', 2023, 8), -- Total Julho 2023: 189
(1, 'Agosto', 2023, 70), (2, 'Agosto', 2023, 18), (4, 'Agosto', 2023, 75), (6, 'Agosto', 2023, 32), (8, 'Agosto', 2023, 9), -- Total Agosto 2023: 204
(1, 'Setembro', 2023, 75), (2, 'Setembro', 2023, 20), (4, 'Setembro', 2023, 80), (6, 'Setembro', 2023, 35), (8, 'Setembro', 2023, 10), -- Total Setembro 2023: 220
(1, 'Outubro', 2023, 68), (2, 'Outubro', 2023, 17), (4, 'Outubro', 2023, 72), (6, 'Outubro', 2023, 31), (8, 'Outubro', 2023, 8), -- Total Outubro 2023: 196
(1, 'Novembro', 2023, 72), (2, 'Novembro', 2023, 19), (4, 'Novembro', 2023, 78), (6, 'Novembro', 2023, 33), (8, 'Novembro', 2023, 9), -- Total Novembro 2023: 211
(1, 'Dezembro', 2023, 80), (2, 'Dezembro', 2023, 22), (4, 'Dezembro', 2023, 85), (6, 'Dezembro', 2023, 38), (8, 'Dezembro', 2023, 11), -- Total Dezembro 2023: 236

-- Dados para 2024
(1, 'Janeiro', 2024, 45), (2, 'Janeiro', 2024, 12), (4, 'Janeiro', 2024, 55), (6, 'Janeiro', 2024, 23), (8, 'Janeiro', 2024, 6), -- Total Janeiro 2024: 141
(1, 'Fevereiro', 2024, 38), (2, 'Fevereiro', 2024, 9), (4, 'Fevereiro', 2024, 48), (6, 'Fevereiro', 2024, 20), (8, 'Fevereiro', 2024, 5), -- Total Fevereiro 2024: 120
(1, 'Março', 2024, 58), (2, 'Março', 2024, 15), (4, 'Março', 2024, 63), (6, 'Março', 2024, 28), (8, 'Março', 2024, 8), -- Total Março 2024: 172
(1, 'Abril', 2024, 50), (2, 'Abril', 2024, 11), (4, 'Abril', 2024, 58), (6, 'Abril', 2024, 24), (8, 'Abril', 2024, 6), -- Total Abril 2024: 149
(1, 'Maio', 2024, 60), (2, 'Maio', 2024, 16), (4, 'Maio', 2024, 68), (6, 'Maio', 2024, 30), (8, 'Maio', 2024, 9), -- Total Maio 2024: 183
(1, 'Junho', 2024, 48), (2, 'Junho', 2024, 10), (4, 'Junho', 2024, 55), (6, 'Junho', 2024, 22), (8, 'Junho', 2024, 5), -- Total Junho 2024: 140
(1, 'Julho', 2024, 70), (2, 'Julho', 2024, 18), (4, 'Julho', 2024, 75), (6, 'Julho', 2024, 33), (8, 'Julho', 2024, 10), -- Total Julho 2024: 206
(1, 'Agosto', 2024, 65), (2, 'Agosto', 2024, 16), (4, 'Agosto', 2024, 70), (6, 'Agosto', 2024, 30), (8, 'Agosto', 2024, 8), -- Total Agosto 2024: 189
(1, 'Setembro', 2024, 80), (2, 'Setembro', 2024, 22), (4, 'Setembro', 2024, 85), (6, 'Setembro', 2024, 38), (8, 'Setembro', 2024, 11), -- Total Setembro 2024: 236
(1, 'Outubro', 2024, 60), (2, 'Outubro', 2024, 15), (4, 'Outubro', 2024, 65), (6, 'Outubro', 2024, 28), (8, 'Outubro', 2024, 7), -- Total Outubro 2024: 175
(1, 'Novembro', 2024, 75), (2, 'Novembro', 2024, 20), (4, 'Novembro', 2024, 80), (6, 'Novembro', 2024, 35), (8, 'Novembro', 2024, 10), -- Total Novembro 2024: 220
(1, 'Dezembro', 2024, 70), (2, 'Dezembro', 2024, 18), (4, 'Dezembro', 2024, 75), (6, 'Dezembro', 2024, 32), (8, 'Dezembro', 2024, 9), -- Total Dezembro 2024: 204

-- Dados para 2025 (alguns meses)
(1, 'Janeiro', 2025, 42), (2, 'Janeiro', 2025, 11), (4, 'Janeiro', 2025, 52), (6, 'Janeiro', 2025, 21), (8, 'Janeiro', 2025, 5), -- Total Janeiro 2025: 131
(1, 'Fevereiro', 2025, 30), (2, 'Fevereiro', 2025, 7), (4, 'Fevereiro', 2025, 40), (6, 'Fevereiro', 2025, 15), (8, 'Fevereiro', 2025, 3), -- Total Fevereiro 2025: 95
(1, 'Março', 2025, 45), (2, 'Março', 2025, 10), (4, 'Março', 2025, 50), (6, 'Março', 2025, 20), (8, 'Março', 2025, 5), -- Total Março 2025: 130
(1, 'Abril', 2025, 40), (2, 'Abril', 2025, 9), (4, 'Abril', 2025, 48), (6, 'Abril', 2025, 18), (8, 'Abril', 2025, 4), -- Total Abril 2025: 119
(1, 'Maio', 2025, 35), (2, 'Maio', 2025, 8), (4, 'Maio', 2025, 42), (6, 'Maio', 2025, 16), (8, 'Maio', 2025, 3); -- Total Maio 2025: 104

