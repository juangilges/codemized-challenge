# Codemized Challenge - Junior Full Stack

Aplicación full stack para la gestión de usuarios, proyectos, tareas y comentarios, desarrollada como parte del Practical Implementation Exercise de Codemized.

## Tecnologías utilizadas

### Frontend
- Next.js
- React
- JavaScript
- CSS Modules
- Fetch API

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- Hibernate
- JWT
- Maven

### Base de datos
- PostgreSQL 16

### Infraestructura
- Docker
- Docker Compose

---

## Funcionalidades

La aplicación permite:

- Registrar usuarios.
- Iniciar y cerrar sesión.
- Editar el perfil del usuario.
- Crear proyectos.
- Listar los proyectos a los que pertenece el usuario autenticado.
- Editar y eliminar proyectos.
- Agregar y quitar miembros de un proyecto.
- Crear tareas dentro de un proyecto.
- Listar tareas por proyecto.
- Editar y eliminar tareas.
- Asignar tareas a miembros del proyecto.
- Cambiar el estado de una tarea.
- Agregar comentarios a tareas.
- Editar y eliminar comentarios propios.
- Aplicar permisos según el usuario y su relación con el proyecto.

Estados disponibles para una tarea:

- `PENDIENTE`
- `EN_PROGRESO`
- `COMPLETADA`

---

## Arquitectura

La aplicación está dividida en frontend, backend y base de datos.

```text
Frontend Next.js
      |
      | HTTP / JSON
      v
Backend Spring Boot
      |
      | JPA / Hibernate
      v
PostgreSQL
```

### Backend

El backend utiliza una arquitectura por capas:

```text
Controller
    |
    v
Service
    |
    v
Repository
    |
    v
Database
```

- **Controller:** recibe las solicitudes HTTP y devuelve las respuestas.
- **Service:** contiene la lógica de negocio y validaciones.
- **Repository:** gestiona el acceso a datos mediante Spring Data JPA.
- **Model:** contiene las entidades persistidas.
- **DTO:** permite recibir y devolver datos sin exponer directamente las entidades.

### Frontend

El frontend utiliza Next.js con App Router.

Rutas principales:

```text
/                       Login y registro
/dashboard              Perfil y proyectos del usuario
/projects/[projectId]   Gestión de un proyecto
```

La interfaz está dividida en componentes reutilizables y custom hooks para separar presentación y lógica.

```text
components/
├── auth/
├── dashboard/
└── project/

hooks/
├── useProject.js
├── useProjectMembers.js
├── useTasks.js
└── useTaskComments.js
```

---

## Autenticación

La aplicación utiliza autenticación mediante JWT.

Después de iniciar sesión, el frontend almacena el token y lo envía en las solicitudes autenticadas mediante:

```http
Authorization: Bearer <token>
```

Las contraseñas se almacenan cifradas utilizando BCrypt.

---

## Modelo de datos

### User
Representa un usuario registrado. Puede crear proyectos, pertenecer a proyectos, ser responsable de tareas y crear comentarios.

### Project
Representa un proyecto. Tiene un usuario creador, puede tener varios miembros y puede contener varias tareas.

### ProjectMember
Representa la relación entre un usuario y un proyecto.

### Task
Representa una unidad de trabajo dentro de un proyecto. Puede tener un usuario responsable, un estado y comentarios.

### Comment
Representa un comentario asociado a una tarea y creado por un usuario.

---

## Estructura del proyecto

```text
Codemized-Challengue/
│
├── backend/
│   ├── src/
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── hooks/
│   ├── package.json
│   ├── Dockerfile
│   └── .dockerignore
│
├── docker-compose.yml
└── README.md
```

---

## Ejecución con Docker

### Requisitos
- Docker
- Docker Compose

No es necesario instalar Java, Maven, Node.js ni PostgreSQL si se ejecuta la aplicación con Docker.

### Iniciar la aplicación

Desde la raíz del proyecto:

```bash
docker compose up --build
```

También puede ejecutarse en segundo plano:

```bash
docker compose up -d --build
```

Docker Compose inicia:
- PostgreSQL
- Backend Spring Boot
- Frontend Next.js

### Frontend

```text
http://localhost:3000
```

### Backend

```text
http://localhost:8080
```

### PostgreSQL

```text
localhost:5432
```

---

## Detener la aplicación

```bash
docker compose down
```

Los datos de PostgreSQL se mantienen mediante el volumen configurado en Docker Compose.

Para eliminar también el volumen y reiniciar la base desde cero:

```bash
docker compose down -v
```

---

## Permisos principales

- Solo el creador puede editar o eliminar un proyecto.
- Solo el creador puede agregar o quitar miembros.
- Un miembro con tareas asignadas no puede ser eliminado del proyecto.
- Solo el creador puede asignar responsables.
- El creador o el responsable de una tarea pueden modificar su estado.
- Los miembros pueden visualizar tareas y comentarios.
- Cada usuario puede editar o eliminar sus propios comentarios.

---

## Consideraciones

- La aplicación utiliza persistencia real con PostgreSQL.
- No utiliza Backend-as-a-Service.
- El backend mantiene separación entre controller, service y repository.
- El frontend está componentizado y utiliza custom hooks para separar responsabilidades.
- La aplicación completa puede iniciarse con Docker Compose.
