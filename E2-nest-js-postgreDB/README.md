# NestJS API Boilerplate

Este proyecto es un ejemplo básico de una API REST creada con [NestJS](https://nestjs.com/), que incluye:

- Creación de módulos, controladores y servicios.
- Uso de DTOs para validación de datos con `class-validator`.
- Documentación con Swagger.

## 🚀 Instalación y configuración

### 1️⃣ Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión LTS recomendada): [https://nodejs.org/](https://nodejs.org/)
- NestJS CLI:
  ```sh
  npm install -g @nestjs/cli
  ```

Para este ejemplo se va a necesitar una DB PostgreSQL

  ```sh
  docker run --name nestjs-postgres -e POSTGRES_DB=mydb_nest_test -e POSTGRES_USER=miusuario -e POSTGRES_PASSWORD=password -p 5490:5432 -d postgres
  ```

### 2️⃣ Clonar el repositorio y entrar al proyecto

```sh
git clone https://github.com/tu-usuario/tu-repositorio.git
cd tu-repositorio
```

### 3️⃣ Instalar dependencias

```sh
npm install
```

### 4️⃣ Ejecutar la aplicación

```sh
npm run start
```

La API estará disponible en [http://localhost:3000](http://localhost:3000).

## 📌 Endpoints disponibles

### Obtener todos los usuarios
```http
GET /users
```
### Obtener un usuario por ID
```http
GET /users/:id
```
### Crear un usuario
```http
POST /users
Content-Type: application/json
{
  "name": "Juan Pérez"
}
```

## 🛠️ Configuración de Swagger

Swagger está habilitado en `src/main.ts`, y puedes acceder a la documentación en:
[http://localhost:3000/api](http://localhost:3000/api)

## 📦 Estructura del proyecto
```
src/
 ├── users/
 │   ├── dto/
 │   │   ├── create-user.dto.ts
 │   ├── users.controller.ts
 │   ├── users.service.ts
 │   ├── users.module.ts
 ├── main.ts
 ├── app.module.ts
```

