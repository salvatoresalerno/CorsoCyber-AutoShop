# Usa un'immagine ufficiale di Node.js
# node:20-alpine --> versione più leggera
FROM node:latest  

# Imposta la directory di lavoro
WORKDIR /CorsoCyber-AutoShop

# Copia il package.json e package-lock.json
COPY ./client/package*.json ./

# Installa le dipendenze
RUN npm install

# Copia il resto dei file del progetto
COPY ./client ./

# Costruisce l'applicazione Next.js
RUN npm run build

# Espone la porta su cui il server Next.js girerà
EXPOSE 3000

# Comando per avviare l'applicazione Next.js
CMD ["npm", "start"]
