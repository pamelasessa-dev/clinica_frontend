# Clínica Frontend 

Aplicación web para la gestión de una clínica de salud integral, desarrollada con React y TypeScript. 

##  Tecnologías utilizadas

- **React** — Desarrollo de interfaces de usuario.
- **TypeScript** — Tipado estático para mejorar la calidad del código.
- **Vite** — Herramienta de desarrollo y compilación.
- **React Router DOM** — Navegación entre páginas sin recargar el navegador.
- **CSS** — Estilos y diseño de la interfaz.
- **ESLint / Oxlint** — Herramientas para detectar posibles problemas en el código.

##  Funcionalidades

- **Dashboard:** página principal con acceso a las funcionalidades de la aplicación.
- **Listado de pacientes:** visualización de los pacientes registrados.
- **Detalle de paciente:** consulta de la información de un paciente mediante su identificador.
- **Nueva cita:** formulario para registrar una nueva cita médica.
- **Navegación entre páginas:** rutas configuradas mediante React Router.
- **Layout compartido:** barra lateral de navegación con indicador de la sección activa.
- **Página 404:** pantalla para rutas inexistentes o pacientes que no se encuentran.

##  Instalación y ejecución

### Requisitos previos

- Node.js
- npm

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
```

Reemplaza `URL_DEL_REPOSITORIO` por la dirección de tu repositorio.

### 2. Entrar en la carpeta del proyecto

```bash
cd clinica-frontend
```

### 3. Instalar las dependencias

```bash
npm install
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local para abrir la aplicación en el navegador.

### 5. Compilar el proyecto

```bash
npm run build
```

Este comando genera la versión de producción y permite comprobar que el proyecto compile correctamente.

## Rutas de navegación

| Ruta             | Página                    |
|------------------|---------------------------|
| `/`              | Dashboard                 |
| `/pacientes`     | Listado de pacientes      |
| `/pacientes/:id` | Detalle de paciente       |
| `/citas/nueva`   | Formulario de nueva cita  |
| `*`              | Página no encontrada (404)|
