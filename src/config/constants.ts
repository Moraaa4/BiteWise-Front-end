export const DEFAULT_API_ENDPOINTS = {
    USERS_DEV: 'http://localhost:3001',
    CATALOG_DEV: 'http://localhost:3002',
    INVENTORY_DEV: 'http://localhost:3003',
    RECIPES_API: 'https://www.themealdb.com/api/json/v1/1',
} as const;

export const API_CONFIG = {
    USERS_URL: process.env.NEXT_PUBLIC_USERS_API_URL || DEFAULT_API_ENDPOINTS.USERS_DEV,
    CATALOG_URL: process.env.NEXT_PUBLIC_CATALOG_API_URL || DEFAULT_API_ENDPOINTS.CATALOG_DEV,
    INVENTORY_URL: process.env.NEXT_PUBLIC_INVENTORY_API_URL || DEFAULT_API_ENDPOINTS.INVENTORY_DEV,
    EXTERNAL_RECIPES_URL: process.env.NEXT_PUBLIC_RECIPES_API_URL || DEFAULT_API_ENDPOINTS.RECIPES_API,
};

export const STORAGE_KEYS = {
    TOKEN: 'token',
    USER_ID: 'userId',
    USER_DATA: 'user',
    LOGIN_TS: 'loginTimestamp',
    COOK_HISTORY: 'biteWise_cookHistory',
    SHOPPING_LISTS: 'biteWise_shoppingLists',
    PENDING_ITEMS: 'biteWise_pendingItems',
    COOKING_SESSIONS: 'biteWise_cookingSessions',
    STEP_BY_STEP: 'biteWise_stepByStep',
    LIST_ITEMS_PREFIX: 'biteWise_list_items_',
};

export const APP_VERSION = '1.2.0';

export const EXTERNAL_URLS = {
    GOOGLE_FONTS: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
    PRODUCTION_DOMAIN: 'render.com',
} as const;

export const DEV_PORTS = {
    USERS: 3001,
    CATALOG: 3002,
    INVENTORY: 3003,
} as const;

export const BRAND_TEXT = {
    APP_NAME: 'BiteWise',
    TAGLINE: 'Come mejor, desperdicia menos',
    FOOTER_COPYRIGHT: '© 2024',
    META_TITLE: 'BiteWise - Cocina Inteligente',
    META_DESCRIPTION: 'Ahorra tiempo y reduce el desperdicio de comida',
} as const;

export const APP_ROUTES = {
    LOGIN: '/login',
    REGISTER: '/register',
    DASHBOARD: '/dashboard',
    LANDING: '/landing',
    KITCHEN: '/kitchen',
    RECIPES: '/Recipes',
    INVENTORY: '/inventory',
    PROFILE: '/profile',
    SHOPPING_LIST: '/shopping-list',
    SHOPPING_LIST_DETAIL: '/shopping-list-detail',
    RECIPES_DETAILS: '/recipes-details',
    STEP_BY_STEP_KITCHEN: '/step-by-step-kitchen',
} as const;

export const VALIDATION_MESSAGES = {
    NAME_MAX_LENGTH: 'El nombre debe tener un máximo de 20 caracteres.',
    GENERIC_ERROR: 'Error al crear la cuenta',
} as const;

export const UI_TEXT = {
    REGISTER: {
        TITLE: '¡Crea tu cuenta!',
        SUBTITLE: 'Únete para reducir el desperdicio de comida.',
        NAME_LABEL: 'Nombre',
        NAME_PLACEHOLDER: 'Tu nombre',
        BUDGET_LABEL: '¿Cuánto gastas semanalmente en solo ingredientes de cocina?',
        BUDGET_PLACEHOLDER: '0.00 MXN',
        EMAIL_LABEL: 'Correo electrónico',
        EMAIL_PLACEHOLDER: 'ejemplo@correo.com',
        PASSWORD_LABEL: 'Contraseña',
        PASSWORD_PLACEHOLDER: '••••••••',
        SHOW_PASSWORD: 'Mostrar',
        HIDE_PASSWORD: 'Ocultar',
        SUBMIT_BUTTON: 'Crear cuenta',
        SUBMIT_LOADING: 'Creando...',
        LOGIN_LINK: '¿Ya tienes cuenta? ',
        LOGIN_ACTION: 'Inicia sesión',
    },
    LOGIN: {
        TITLE: '¡Hola de nuevo!',
        SUBTITLE: 'Entra para seguir reduciendo el desperdicio de comida.',
        EMAIL_LABEL: 'Correo electrónico',
        EMAIL_PLACEHOLDER: 'ejemplo@correo.com',
        PASSWORD_LABEL: 'Contraseña',
        PASSWORD_PLACEHOLDER: '••••••••',
        SHOW_PASSWORD: 'Mostrar',
        HIDE_PASSWORD: 'Ocultar',
        SUBMIT_BUTTON: 'INICIAR SESIÓN',
        SUBMIT_LOADING: 'Ingresando...',
        FORGOT_PASSWORD: '¿Olvidaste tu contraseña?',
        REGISTER_LINK: '¿No tienes cuenta? ',
        REGISTER_ACTION: 'Regístrate gratis',
    },
} as const;
