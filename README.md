# 🍽️ BiteWise — Front-end

**Come mejor, desperdicia menos.**

BiteWise es una aplicación web de cocina inteligente que ayuda a los usuarios a planificar sus comidas, gestionar su inventario de ingredientes, crear listas de compras y cocinar paso a paso — todo con el objetivo de reducir el desperdicio de alimentos.

---

## 📋 Tabla de contenidos

- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Requisitos previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Variables de entorno](#-variables-de-entorno)
- [Ejecución](#-ejecución)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [Scripts disponibles](#-scripts-disponibles)

---

## 🛠 Tecnologías

| Tecnología | Versión |
|---|---|
| [Next.js](https://nextjs.org/) | 16.x |
| [React](https://react.dev/) | 19.x |
| [TypeScript](https://www.typescriptlang.org/) | 5.x |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| [Lucide React](https://lucide.dev/) | 0.576+ |
| [next-themes](https://github.com/pacocoursey/next-themes) | 0.4.x |

---

## 🏗 Arquitectura

El front-end se conecta a **tres microservicios** del back-end, cada uno desplegado de forma independiente:

| Microservicio | Descripción | Variable de entorno |
|---|---|---|
| **Usuarios** | Autenticación, perfiles y sesiones | `NEXT_PUBLIC_API_USUARIOS` |
| **Catálogo** | Recetas, ingredientes y categorías | `NEXT_PUBLIC_API_CATALOGO` |
| **Inventario** | Inventario personal y listas de compras | `NEXT_PUBLIC_API_INVENTARIO` |

Además, utiliza la API externa [TheMealDB](https://www.themealdb.com/) para obtener recetas públicas.

---

## ✅ Requisitos previos

- [Node.js](https://nodejs.org/) **v18** o superior
- [npm](https://www.npmjs.com/) (incluido con Node.js)

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <URL_DEL_REPOSITORIO>
cd BiteWise-Front-end

# Instalar dependencias
npm install
```

---

## 🔐 Variables de entorno

Crea un archivo **`.env`** (o `.env.local`) en la raíz del proyecto con las siguientes variables:

```env
# === APIs del Back-end ===
NEXT_PUBLIC_API_USUARIOS=<URL_DEL_SERVICIO_DE_USUARIOS>
NEXT_PUBLIC_API_CATALOGO=<URL_DEL_SERVICIO_DE_CATALOGO>
NEXT_PUBLIC_API_INVENTARIO=<URL_DEL_SERVICIO_DE_INVENTARIO>

# === API externa de recetas (opcional, tiene valor por defecto) ===
NEXT_PUBLIC_RECIPES_API_URL=<URL_DE_API_DE_RECETAS_EXTERNA>
```

> [!IMPORTANT]
> Las URLs **no deben** incluir barra diagonal (`/`) al final.

> [!NOTE]
> Si no se define `NEXT_PUBLIC_RECIPES_API_URL`, la aplicación usará `https://www.themealdb.com/api/json/v1/1` por defecto.

---

## 🚀 Ejecución

```bash
# Modo desarrollo (con hot-reload)
npm run dev
```

La aplicación estará disponible en **http://localhost:3000**.

---

## 📁 Estructura del proyecto

```
BiteWise-Front-end/
├── public/                  # Recursos estáticos (imágenes, íconos)
├── src/
│   ├── app/                 # Rutas de la aplicación (App Router de Next.js)
│   │   ├── login/           # Inicio de sesión
│   │   ├── register/        # Registro de usuario
│   │   ├── dashboard/       # Panel principal
│   │   ├── Recipes/         # Exploración de recetas
│   │   ├── recipes-details/ # Detalle de una receta
│   │   ├── kitchen/         # Vista de cocina
│   │   ├── step-by-step-kitchen/ # Cocina paso a paso
│   │   ├── inventory/       # Gestión de inventario
│   │   ├── shopping-list/   # Listas de compras
│   │   ├── shopping-list-detail/ # Detalle de lista de compras
│   │   ├── profile/         # Perfil de usuario
│   │   └── landing/         # Página de inicio (landing)
│   ├── components/          # Componentes reutilizables de UI
│   ├── config/              # Configuración centralizada y constantes
│   ├── features/            # Lógica de negocio por módulo
│   ├── services/            # Servicios HTTP para comunicación con APIs
│   └── types/               # Definiciones de tipos TypeScript
├── .env                     # Variables de entorno (no incluido en el repo)
├── next.config.ts           # Configuración de Next.js
├── tailwind.config.js       # Configuración de Tailwind CSS
├── tsconfig.json            # Configuración de TypeScript
└── package.json             # Dependencias y scripts
```

---

## ⭐ Funcionalidades

| Módulo | Descripción |
|---|---|
| **Autenticación** | Login, registro y manejo de sesiones con JWT |
| **Dashboard** | Panel principal con resumen del inventario y recetas sugeridas |
| **Recetas** | Exploración de recetas externas e internas del catálogo |
| **Detalle de receta** | Ingredientes, pasos e instrucciones de preparación |
| **Cocina paso a paso** | Guía interactiva de cocina con seguimiento de progreso |
| **Inventario** | Gestión de ingredientes disponibles del usuario |
| **Listas de compras** | Creación y gestión de listas para comprar ingredientes faltantes |
| **Perfil** | Visualización y edición de datos del usuario |
| **Tema oscuro** | Soporte completo de modo claro/oscuro vía `next-themes` |

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera el build de producción |
| `npm run start` | Inicia el servidor en modo producción |
| `npm run lint` | Ejecuta ESLint para análisis de código |
