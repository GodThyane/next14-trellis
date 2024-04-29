# Clon de Trello en Next.js 14

## Descripción

Gestiona proyectos con tableros, listas y tarjetas. Este proyecto utiliza Next.js 14, Server Actions, Prisma, Stripe,
Tailwind y Postgresql.

## Instalación

1. Clona este repositorio en tu máquina local.
2. Instala las dependencias con `npm install`.
3. Crear una copia del ```.env.example``` y renombrarla a ```.env```
4. Instalar dependencias ```npm install```
5. Levantar la base de datos con ```docker-compose up -d```
6. Correr las migraciones de Prisma con ```npx prisma migrate dev```
   7Correr el proyecto ```npm run dev```

## Uso

- Ejecuta `npm run dev` para iniciar el servidor de desarrollo.
- Abre [http://localhost:3000](http://localhost:3000) en tu navegador.