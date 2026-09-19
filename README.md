# Codemized Challenge

Aplicación de gestión de proyectos y tareas desarrollada con **Spring Boot + PostgreSQL + Next.js**.

## Estado actual

El proyecto cuenta con un backend funcional y un frontend inicial conectado a la API.

### Backend

- Autenticación mediante JWT.
- Login de usuarios.
- Gestión de usuarios.
- Gestión de proyectos.
- Gestión de tareas.
- Asignación de tareas a usuarios.
- Estados de tareas.
- Gestión de comentarios.
- Control de permisos.
- Validaciones de solicitudes.
- Manejo centralizado de errores HTTP.
- CORS configurado para el frontend.
- Endpoint para consultar usuarios.
- Endpoint para consultar las tareas asignadas al usuario autenticado.

### Frontend

- Next.js con App Router.
- Pantalla de login conectada al backend.
- Persistencia del JWT durante la sesión.
- Redirección al dashboard después del login.
- Protección básica del dashboard cuando no existe token.
- Cierre de sesión.
- Listado de proyectos.
- Creación de proyectos.
- Navegación desde un proyecto hacia sus tareas.
- Consumo de la API REST del backend.

---

## Tecnologías

### Backend

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend

- Next.js
- React
- JavaScript
- CSS

### Infraestructura

- Docker
- Docker Compose
- PostgreSQL

---

## Estructura

```text
Codemized-Challenge/
├── backend/
├── frontend/
├── docker-compose.yml
└── README.md
```

---

# Requisitos

Antes de ejecutar el proyecto, tener instalado:

- Java
- Maven Wrapper incluido en el backend
- Node.js / npm
- Docker Desktop

---

# 1. Levantar PostgreSQL

Desde la raíz del proyecto:

```powershell
docker compose up -d
```

Comprobar que el contenedor esté funcionando:

```powershell
docker ps
```

Debe aparecer el contenedor de PostgreSQL.

---

# 2. Levantar el backend

Abrir una terminal en:

```text
Codemized-Challenge/backend
```

Ejecutar:

```powershell
.\mvnw.cmd spring-boot:run
```

El backend queda disponible en:

```text
http://localhost:8080
```

Esperar en la consola de Spring el mensaje:

```text
Started BackendApplication
```

---

# 3. Levantar el frontend

Abrir otra terminal en:

```text
Codemized-Challenge/frontend
```

Instalar dependencias si es la primera ejecución:

```powershell
npm.cmd install
```

Crear el archivo:

```text
frontend/.env.local
```

con:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Luego ejecutar:

```powershell
npm.cmd run dev
```

El frontend queda disponible en:

```text
http://localhost:3000
```

---

# 4. Flujo de prueba recomendado

## Login

Abrir:

```text
http://localhost:3000
```

Ingresar con uno de los usuarios de prueba configurados en la base de datos.

> Las contraseñas de prueba no se documentan en este README. Compartirlas por separado si son necesarias para la revisión.

Después del login, el usuario es enviado al dashboard.

---

## Dashboard

Desde el dashboard se puede:

- Ver los proyectos.
- Crear un nuevo proyecto.
- Entrar a un proyecto.
- Cerrar sesión.

---

## Proyectos

Cada proyecto tiene un identificador propio y puede contener tareas.

Desde el frontend se puede crear un proyecto mediante:

```http
POST /projects
```

---

## Tareas

El backend permite trabajar con tareas, incluyendo:

- título
- descripción
- estado
- proyecto
- usuario asignado

También existe:

```http
GET /tasks/assigned-to-me
```

que devuelve las tareas asignadas al usuario autenticado.

---

## Usuarios

El backend dispone de:

```http
GET /users
```

para obtener los usuarios disponibles sin exponer información sensible como contraseñas.

---

## Comentarios

Las tareas pueden tener comentarios asociados a usuarios.

---

# Manejo de errores

El backend tiene manejo centralizado de errores.

Se contemplan, entre otros:

| Código | Situación |
|---|---|
| 400 | Solicitud inválida / datos incorrectos |
| 401 | Usuario no autenticado / credenciales incorrectas |
| 403 | Usuario autenticado pero sin permisos |
| 404 | Recurso inexistente |
| 500 | Error interno no controlado |

También se manejan errores de JSON mal formado y errores de validación.

---

# CORS

El backend permite solicitudes desde:

```text
http://localhost:3000
```

Esto permite que el frontend Next.js se comunique con la API Spring Boot desde el navegador.

---

# Variables de entorno

## Frontend

Archivo:

```text
frontend/.env.local
```

Variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

No subir archivos `.env.local` con secretos reales al repositorio.

---

# Antes de compartir el proyecto

Se recomienda NO incluir:

```text
node_modules/
.next/
backend/target/
.env
.env.local
```

También revisar que no haya:

- contraseñas reales
- tokens JWT
- claves privadas
- credenciales personales
- archivos de configuración con secretos

---

# Orden recomendado para una demo

1. Levantar Docker/PostgreSQL.
2. Levantar Spring Boot.
3. Levantar Next.js.
4. Abrir `http://localhost:3000`.
5. Iniciar sesión.
6. Mostrar el dashboard.
7. Crear un proyecto.
8. Entrar al proyecto.
9. Mostrar las tareas.
10. Mostrar asignación de tareas y comentarios.
11. Probar cierre de sesión.
12. Mostrar brevemente la API y el manejo de permisos si se solicita.

---

# Estado del proyecto

### Implementado

- Backend REST funcional.
- Autenticación JWT.
- Autorización y permisos.
- Usuarios.
- Proyectos.
- Tareas.
- Asignaciones.
- Estados.
- Comentarios.
- Validaciones.
- Manejo de errores.
- CORS.
- Frontend Next.js conectado a la API.
- Login.
- Dashboard.
- Creación de proyectos.
- Navegación de proyectos.

### En desarrollo

La interfaz visual todavía se encuentra en una etapa inicial. La lógica principal ya está conectada con el backend, pero quedan por desarrollar/mejorar componentes de UI, experiencia de usuario y algunas pantallas de gestión.

---

# Nota para revisión

El objetivo de esta versión es mostrar una integración funcional entre frontend y backend, con autenticación, autorización y operaciones principales de proyectos y tareas.

La interfaz visual continuará evolucionando sobre esta base.
