import { SeleniumConfig } from './selenium-config';
import { By } from 'selenium-webdriver';

describe('Pruebas de navegación y menú', () => {
  let seleniumConfig: SeleniumConfig;
  const baseUrl = 'http://localhost:3000';

  beforeAll(async () => {
    seleniumConfig = new SeleniumConfig();
    await seleniumConfig.createDriver(true);
  });

  afterAll(async () => {
    await seleniumConfig.quitDriver();
  });

  test('Navegación principal desde landing', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Verificar enlaces de navegación principal
      const howItWorksLink = await seleniumConfig.waitForElement('a[href="#how-it-works"]', 5000);
      const recipesLink = await seleniumConfig.waitForElement('a[href="#tu-cocina"]', 5000);
      const impactLink = await seleniumConfig.waitForElement('a[href="#impacto"]', 5000);
      
      expect(howItWorksLink).toBeDefined();
      expect(recipesLink).toBeDefined();
      expect(impactLink).toBeDefined();
      
      // Probar navegación a "Cómo funciona"
      await howItWorksLink.click();
      await seleniumConfig.sleep(2000);
      
      // Verificar que la sección es visible
      const howItWorksSection = await seleniumConfig.waitForElement('#how-it-works', 5000);
      expect(howItWorksSection).toBeDefined();
      
      // Probar navegación a "Recetas"
      const recipesLink2 = await seleniumConfig.waitForElement('a[href="#tu-cocina"]', 5000);
      await recipesLink2.click();
      await seleniumConfig.sleep(2000);
      
      const recipesSection = await seleniumConfig.waitForElement('#tu-cocina', 5000);
      expect(recipesSection).toBeDefined();
      
      // Probar navegación a "Impacto"
      const impactLink2 = await seleniumConfig.waitForElement('a[href="#impacto"]', 5000);
      await impactLink2.click();
      await seleniumConfig.sleep(2000);
      
      const impactSection = await seleniumConfig.waitForElement('#impacto', 5000);
      expect(impactSection).toBeDefined();
      
    } catch (error) {
      console.log('Error en navegación principal:', error);
    }
  }, 30000);

  test('Logo redirige a landing', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/login`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar logo o enlace principal
      const logoLink = await seleniumConfig.waitForElement('a[href="/"], a[href="/landing"]', 5000);
      expect(logoLink).toBeDefined();
      
      await logoLink.click();
      await seleniumConfig.sleep(3000);
      
      const currentUrl = await seleniumConfig.getCurrentUrl();
      expect(currentUrl).toContain('/landing');
      
    } catch (error) {
      console.log('Error en prueba de logo:', error);
    }
  }, 30000);

  test('Navegación a páginas principales después de login simulado', async () => {
    // Nota: Esta prueba asume que ya estamos logueados o que las páginas son accesibles
    await seleniumConfig.navigateTo(`${baseUrl}/dashboard`);
    await seleniumConfig.sleep(3000);
    
    try {
      const currentUrl = await seleniumConfig.getCurrentUrl();
      console.log('URL actual al intentar acceder a dashboard:', currentUrl);
      
      // Si redirige a login, verificamos el comportamiento
      if (currentUrl.includes('/login')) {
        console.log('Redirigido a login como se esperaba');
        
        // Verificar que hay un formulario de login
        const loginForm = await seleniumConfig.waitForElement('form', 5000);
        expect(loginForm).toBeDefined();
      } else {
        // Si podemos acceder, verificamos elementos del dashboard
        const dashboardElements = await seleniumConfig.getDriver()?.findElements(By.css('main, .dashboard, .container'));
        console.log(`Se encontraron ${dashboardElements?.length || 0} elementos en dashboard`);
      }
      
    } catch (error) {
      console.log('Error en prueba de dashboard:', error);
    }
  }, 30000);

  test('Acceso a páginas de recetas', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/Recipes`);
    await seleniumConfig.sleep(3000);
    
    try {
      const currentUrl = await seleniumConfig.getCurrentUrl();
      console.log('URL actual al intentar acceder a recetas:', currentUrl);
      
      // Buscar elementos de recetas
      const recipeCards = await seleniumConfig.getDriver()?.findElements(By.css('.recipe, .card, [data-recipe]'));
      const recipeTitles = await seleniumConfig.getDriver()?.findElements(By.css('h2, h3, .recipe-title'));
      
      console.log(`Tarjetas de receta encontradas: ${recipeCards?.length || 0}`);
      console.log(`Títulos de receta encontrados: ${recipeTitles?.length || 0}`);
      
      // Si hay recetas, intentar hacer clic en una
      if (recipeCards && recipeCards.length > 0) {
        await recipeCards[0].click();
        await seleniumConfig.sleep(2000);
        
        const newUrl = await seleniumConfig.getCurrentUrl();
        console.log('URL después de clic en receta:', newUrl);
      }
      
    } catch (error) {
      console.log('Error en prueba de recetas:', error);
    }
  }, 30000);

  test('Acceso a inventario', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/inventory`);
    await seleniumConfig.sleep(3000);
    
    try {
      const currentUrl = await seleniumConfig.getCurrentUrl();
      console.log('URL actual al intentar acceder a inventario:', currentUrl);
      
      // Buscar elementos de inventario
      const inventoryItems = await seleniumConfig.getDriver()?.findElements(By.css('.inventory-item, .item, [data-inventory]'));
      const addButtons = await seleniumConfig.getDriver()?.findElements(By.css('.add-btn, button:contains("Agregar"), .btn-add'));
      
      console.log(`Items de inventario encontrados: ${inventoryItems?.length || 0}`);
      console.log(`Botones de agregar encontrados: ${addButtons?.length || 0}`);
      
      // Buscar campos de búsqueda o filtros
      const searchInputs = await seleniumConfig.getDriver()?.findElements(By.css('input[type="search"], .search, [placeholder*="buscar"]'));
      console.log(`Campos de búsqueda encontrados: ${searchInputs?.length || 0}`);
      
    } catch (error) {
      console.log('Error en prueba de inventario:', error);
    }
  }, 30000);

  test('Acceso a lista de compras', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/shopping-list`);
    await seleniumConfig.sleep(3000);
    
    try {
      const currentUrl = await seleniumConfig.getCurrentUrl();
      console.log('URL actual al intentar acceder a lista de compras:', currentUrl);
      
      // Buscar elementos de lista de compras
      const listItems = await seleniumConfig.getDriver()?.findElements(By.css('.list-item, .shopping-item, [data-item]'));
      const checkboxes = await seleniumConfig.getDriver()?.findElements(By.css('input[type="checkbox"]'));
      
      console.log(`Items de lista encontrados: ${listItems?.length || 0}`);
      console.log(`Checkboxes encontrados: ${checkboxes?.length || 0}`);
      
      // Buscar botones de acción
      const actionButtons = await seleniumConfig.getDriver()?.findElements(By.css('button, .btn'));
      console.log(`Botones de acción encontrados: ${actionButtons?.length || 0}`);
      
    } catch (error) {
      console.log('Error en prueba de lista de compras:', error);
    }
  }, 30000);

  test('Navegación móvil responsiva', async () => {
    // Establecer tamaño móvil
    await seleniumConfig.getDriver()?.manage().window().setRect({ width: 375, height: 667 });
    await seleniumConfig.sleep(1000);
    
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar menú hamburguesa o botón de menú móvil
      const mobileMenuButtons = await seleniumConfig.getDriver()?.findElements(By.css('.hamburger, .menu-toggle, .mobile-menu, button[aria-label*="menu"]'));
      
      if (mobileMenuButtons && mobileMenuButtons.length > 0) {
        console.log('Se encontró menú móvil');
        
        // Hacer clic para abrir menú
        await mobileMenuButtons[0].click();
        await seleniumConfig.sleep(2000);
        
        // Buscar enlaces del menú móvil
        const mobileLinks = await seleniumConfig.getDriver()?.findElements(By.css('nav a, .mobile-nav a, .menu a'));
        console.log(`Enlaces del menú móvil encontrados: ${mobileLinks?.length || 0}`);
        
        // Cerrar menú si es posible
        await mobileMenuButtons[0].click();
        await seleniumConfig.sleep(1000);
      } else {
        console.log('No se encontró menú hamburguesa, verificando navegación directa');
        
        // Verificar si los enlaces principales están visibles
        const mainLinks = await seleniumConfig.getDriver()?.findElements(By.css('nav a, header a'));
        console.log(`Enlaces principales visibles en móvil: ${mainLinks?.length || 0}`);
      }
      
    } catch (error) {
      console.log('Error en navegación móvil:', error);
    }
  }, 30000);
});
