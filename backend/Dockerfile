# Node 20
FROM node:20

WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install

# Copia o restante do backend
COPY . .

# Porta que o backend vai ouvir
EXPOSE 5000

# Comando para rodar o backend
CMD ["node", "server.js"]
