# NestJS Reactivo

Este proyecto es un ejemplo básico de una API REST creada con [NestJS](https://nestjs.com/), que incluye:

- Creación de módulos, controladores y servicios.
- Uso de DTOs para validación de datos con `class-validator`.
- Documentación con Swagger.
- Manejo de excepciones personalizadas.
- Implementación de RxJS en un endpoint reactivo.

## 🚀 Instalación y configuración

### 1️⃣ Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (versión LTS recomendada): [https://nodejs.org/](https://nodejs.org/)
- NestJS CLI:
  ```sh
  npm install -g @nestjs/cli
  ```

Para este ejemplo se va a necesitar una DB PostgreSQL:

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
### Obtener un usuario por ID (Async/Await)
```http
GET /users/:id
```
### Obtener un usuario por ID (RxJS)
```http
GET /users/reac/:id
```
### Crear un usuario
```http
POST /users
Content-Type: application/json
{
  "name": "Juan Pérez"
}
```

## 🛠️ Implementación de Excepciones

Se ha añadido una clase de filtro de excepciones para manejar errores específicos de Prisma:

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = 'Error desconocido en la base de datos';
    let status = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception.code === 'P2002') {
      message = 'Registro duplicado';
      status = HttpStatus.CONFLICT;
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
```

Este filtro captura errores conocidos de Prisma y responde con códigos de estado HTTP apropiados.

## 🔄 Async/Await vs RxJS

La API ahora incluye dos endpoints para obtener un usuario por ID, usando diferentes enfoques:

### Método con Async/Await
```typescript
@Get(':id')
getUserById(@Param('id') id: string) {
  return this.appService.findById(id);
}
```

```typescript
async findById(id: string) {
  const userInfo = await this.prisma.user.findUnique({
    where: { id: parseInt(id) },
  });

  if (!userInfo) {
    throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
  }

  return userInfo;
}
```
✅ **Ventajas**:
- Código más sencillo y fácil de leer.
- Mejor compatibilidad con flujos tradicionales de JavaScript.

---

### Método con RxJS
```typescript
@Get('/reac/:id')
findByIdReactive(@Param('id') id: string) {
  return this.appService.findByIdReactive(id);
}
```

```typescript
findByIdReactive(id: string) {
  return from(
    this.prisma.user.findUnique({
      where: { id: parseInt(id) },
    })
  ).pipe(
    map(userInfo => {
      if (!userInfo) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado usando ReactiveX`);
      }
      return userInfo;
    }),
    catchError(err => {
      throw err;
    })
  );
}
```
✅ **Ventajas**:
- Permite trabajar con flujos reactivos de datos.
- Es útil en operaciones donde se espera manejar múltiples eventos o streams.

🔹 **¿Cuál usar?**  
Si tu aplicación trabaja con operaciones simples y síncronas, el uso de `async/await` es suficiente. Sin embargo, si necesitas manejar múltiples eventos o flujos de datos, RxJS proporciona herramientas poderosas para composición y transformación.

## **Excepciones HTTP en NestJS**

NestJS proporciona varias excepciones predefinidas en `@nestjs/common`, cada una con un código HTTP específico:

| Excepción | Código HTTP | Descripción |
| --- | --- | --- |
| `BadRequestException` | 400 | Solicitud inválida, datos incorrectos |
| `UnauthorizedException` | 401 | Falta autenticación o es incorrecta |
| `ForbiddenException` | 403 | Acceso denegado incluso con autenticación válida |
| `NotFoundException` | 404 | Recurso no encontrado |
| `MethodNotAllowedException` | 405 | Método HTTP no permitido |
| `NotAcceptableException` | 406 | El servidor no puede responder con el formato solicitado |
| `RequestTimeoutException` | 408 | Tiempo de espera agotado |
| `ConflictException` | 409 | Conflicto en la solicitud (ej. email duplicado) |
| `GoneException` | 410 | Recurso eliminado permanentemente |K
| `PayloadTooLargeException` | 413 | Carga útil demasiado grande |
| `UnsupportedMediaTypeException` | 415 | Tipo de contenido no soportado |
| `UnprocessableEntityException` | 422 | Error de validación en los datos recibidos |
| `InternalServerErrorException` | 500 | Error inesperado en el servidor |
| `NotImplementedException` | 501 | Función no implementada |
| `BadGatewayException` | 502 | Error en la comunicación con otro servicio |
| `ServiceUnavailableException` | 503 | El servicio no está disponible temporalmente |
| `GatewayTimeoutException` | 504 | El servidor no respondió a tiempo |

## **. Ejemplo de uso de diferentes excepciones**

Dependiendo de la situación, podrías lanzar una excepción distinta en tu código:

```tsx
import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException
} from '@nestjs/common';

function simulateError(type: string) {
  switch (type) {
    case 'bad_request':
      throw new BadRequestException('Datos incorrectos en la solicitud.');
    case 'unauthorized':
      throw new UnauthorizedException('No tienes permisos para acceder.');
    case 'forbidden':
      throw new ForbiddenException('Acceso denegado.');
    case 'not_found':
      throw new NotFoundException('Recurso no encontrado.');
    case 'conflict':
      throw new ConflictException('El email ya está registrado.');
    default:
      throw new InternalServerErrorException('Algo salió mal en el servidor.');
  }
}
```

## **. Creando una Excepción Personalizada**

Si necesitas una excepción con un código de error específico o con información extra, puedes crear tu propia excepción:

```tsx
import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomValidationException extends HttpException {
  constructor(message: string, errorCode: number) {
    super(
      { message, errorCode },
      HttpStatus.UNPROCESSABLE_ENTITY, // Código 422
    );
  }
}
```

Uso en tu servicio:

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

