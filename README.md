Criar arquivo "docker-compose.yml"

colar esse texto neste aquivo:

services:
  backend:
    build: ./backend
    container_name: tiverde-backend
    ports:
      - "5000:5000"
    environment:
	

  frontend:
    build: ./frontend
    container_name: tiverde-frontend
    ports:
      - "8080:80"        # Porta externa 8080 → interna 80 (nginx)
    depends_on:
      - backend

