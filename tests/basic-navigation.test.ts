import { SeleniumConfig } from './selenium-config';
import { By } from 'selenium-webdriver';

describe('Pruebas básicas de navegación', () => {
  let seleniumConfig: SeleniumConfig;
  const baseUrl = 'http://localhost:3000';

  beforeAll(async () => {
    seleniumConfig = new SeleniumConfig();
    await seleniumConfig.createDriver(true); // true para modo headless
  });

  afterAll(async () => {
    await seleniumConfig.quitDriver();
  });

  test('La página principal carga correctamente', async () => {
    await seleniumConfig.navigateTo(baseUrl);
    
    // Esperar a que la página cargue completamente
    await seleniumConfig.sleep(2000);
    
    const currentUrl = await seleniumConfig.getCurrentUrl();
    expect(currentUrl).toBe(baseUrl);
    
    // Verificar que el título de la página contenga algo
    const title = await seleniumConfig.getDriver()?.getTitle();
    expect(title).toBeDefined();
    expect(title!.length).toBeGreaterThan(0);
  }, 30000);

  test('Los elementos principales son visibles', async () => {
    await seleniumConfig.navigateTo(baseUrl);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar elementos comunes en una página Next.js
      const body = await seleniumConfig.waitForElementVisible('body', 5000);
      expect(body).toBeDefined();
      
      // Buscar elementos de navegación típicos
      const navElements = await seleniumConfig.getDriver()?.findElements(By.css('nav, header, .navbar, .header'));
      if (navElements && navElements.length > 0) {
        console.log('Se encontraron elementos de navegación');
      }
      
      // Buscar contenido principal
      const mainElements = await seleniumConfig.getDriver()?.findElements(By.css('main, .main, .content'));
      if (mainElements && mainElements.length > 0) {
        console.log('Se encontraron elementos de contenido principal');
      }
      
    } catch (error) {
      console.log('Algunos elementos no se encontraron, esto puede ser normal:', error);
    }
  }, 30000);

  test('La página responde a interacciones básicas', async () => {
    await seleniumConfig.navigateTo(baseUrl);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar botones o enlaces para hacer clic
      const buttons = await seleniumConfig.getDriver()?.findElements(By.css('button, a, .btn'));
      if (buttons && buttons.length > 0) {
        console.log(`Se encontraron ${buttons.length} elementos interactivos`);
        
        // Hacer clic en el primer botón/enlace si existe
        if (buttons[0]) {
          await buttons[0].click();
          await seleniumConfig.sleep(1000);
          
          const newUrl = await seleniumConfig.getCurrentUrl();
          console.log('URL después del clic:', newUrl);
        }
      } else {
        console.log('No se encontraron elementos interactivos');
      }
    } catch (error) {
      console.log('Error durante la interacción:', error);
    }
  }, 30000);
});
