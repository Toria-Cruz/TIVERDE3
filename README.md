Baixar e instalar o Docker no windows


Criar arquivo "docker-compose.yml" na raiz do projeto e colar esse texto neste aquivo:

services:
  backend:
    build: ./backend
    container_name: tiverde-backend
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    container_name: tiverde-frontend
    ports:
      - "8080:80"        # Porta externa 8080 → interna 80 (nginx)
    depends_on:
      - backend

Abra o Docker Desktop
Depois rodar o comando no terminal do vscode: docker-compose up --build -d para criar os conteiners frontend e backend 

<img width="1911" height="1079" alt="image" src="https://github.com/user-attachments/assets/e8aba959-16cf-40bd-9182-6f4f99665b47" />
