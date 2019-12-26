# imagem inicial
FROM node:10-alpine

# cria o diretorio da app
RUN mkdir -p /src/app

# seta o workdir para app trabalhar sempre nele
WORKDIR /src/app

# copia o package.json local para o diretorio da app, para aproveitar a cache
COPY package.json /src/app/package.json

# instala as dependências de projeto existentes no package.json
RUN npm install

# copia o restante para a aplicação
COPY . /src/app

#
EXPOSE 3000

CMD ["npm", "start"]
