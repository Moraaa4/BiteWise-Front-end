export const API_CONFIG = {
    USERS_URL: process.env.NEXT_PUBLIC_USERS_API_URL || 'http://localhost:3001',
    CATALOG_URL: process.env.NEXT_PUBLIC_CATALOG_API_URL || 'http://localhost:3002',
    INVENTORY_URL: process.env.NEXT_PUBLIC_INVENTORY_API_URL || 'http://localhost:3003',
    EXTERNAL_RECIPES_URL: 'https://www.themealdb.com/api/json/v1/1',
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
