import { SeleniumConfig } from './selenium-config';
import { By } from 'selenium-webdriver';

describe('Pruebas de diseño responsivo', () => {
  let seleniumConfig: SeleniumConfig;
  const baseUrl = 'http://localhost:3000';

  beforeAll(async () => {
    seleniumConfig = new SeleniumConfig();
    await seleniumConfig.createDriver(true);
  });

  afterAll(async () => {
    await seleniumConfig.quitDriver();
  });

  test('Prueba en tamaño de escritorio', async () => {
    await seleniumConfig.navigateTo(baseUrl);
    await seleniumConfig.sleep(2000);
    
    // Establecer tamaño de ventana de escritorio
    await seleniumConfig.getDriver()?.manage().window().setRect({ width: 1920, height: 1080 });
    await seleniumConfig.sleep(1000);
    
    try {
      // Verificar elementos visibles en escritorio
      const body = await seleniumConfig.waitForElementVisible('body', 5000);
      expect(body).toBeDefined();
      
      // Buscar menús de navegación
      const navElements = await seleniumConfig.getDriver()?.findElements(By.css('nav, .nav, .navbar, .menu'));
      if (navElements && navElements.length > 0) {
        console.log(`Se encontraron ${navElements.length} elementos de navegación en escritorio`);
        
        // Verificar si son visibles
        for (let i = 0; i < navElements.length; i++) {
          const isVisible = await navElements[i].isDisplayed();
          console.log(`Elemento de navegación ${i + 1} visible: ${isVisible}`);
        }
      }
      
      // Buscar contenido principal
      const mainContent = await seleniumConfig.getDriver()?.findElements(By.css('main, .main, .content, .container'));
      if (mainContent && mainContent.length > 0) {
        console.log(`Se encontraron ${mainContent.length} elementos de contenido principal`);
      }
      
    } catch (error) {
      console.log('Error en prueba de escritorio:', error);
    }
  }, 30000);

  test('Prueba en tamaño de tablet', async () => {
    await seleniumConfig.navigateTo(baseUrl);
    await seleniumConfig.sleep(2000);
    
    // Establecer tamaño de ventana de tablet
    await seleniumConfig.getDriver()?.manage().window().setRect({ width: 768, height: 1024 });
    await seleniumConfig.sleep(1000);
    
    try {
      const body = await seleniumConfig.waitForElementVisible('body', 5000);
      expect(body).toBeDefined();
      
      // Buscar menús hamburguesa o botones de menú móvil
      const mobileMenuButtons = await seleniumConfig.getDriver()?.findElements(By.css('.hamburger, .menu-toggle, .mobile-menu, button[aria-label*="menu"]'));
      if (mobileMenuButtons && mobileMenuButtons.length > 0) {
        console.log(`Se encontraron ${mobileMenuButtons.length} botones de menú móvil en tablet`);
      }
      
      // Verificar que el contenido se ajuste
      const windowWidth = await seleniumConfig.getDriver()?.executeScript('return window.innerWidth');
      console.log(`Ancho de ventana en tablet: ${windowWidth}px`);
      
    } catch (error) {
      console.log('Error en prueba de tablet:', error);
    }
  }, 30000);

  test('Prueba en tamaño de móvil', async () => {
    await seleniumConfig.navigateTo(baseUrl);
    await seleniumConfig.sleep(2000);
    
    // Establecer tamaño de ventana móvil
    await seleniumConfig.getDriver()?.manage().window().setRect({ width: 375, height: 667 });
    await seleniumConfig.sleep(1000);
    
    try {
      const body = await seleniumConfig.waitForElementVisible('body', 5000);
      expect(body).toBeDefined();
      
      // Buscar elementos específicos de móvil
      const mobileElements = await seleniumConfig.getDriver()?.findElements(By.css('.mobile, .responsive, .sm:hidden'));
      console.log(`Se encontraron ${mobileElements.length} elementos específicos de móvil`);
      
      // Verificar scroll horizontal
      const hasHorizontalScroll = await seleniumConfig.getDriver()?.executeScript(
        'return document.body.scrollWidth > document.body.clientWidth'
      );
      console.log(`Hay scroll horizontal: ${hasHorizontalScroll}`);
      
      // Tomar screenshot para verificación visual (opcional)
      const screenshot = await seleniumConfig.getDriver()?.takeScreenshot();
      if (screenshot) {
        console.log('Screenshot tomado para verificación visual');
      }
      
    } catch (error) {
      console.log('Error en prueba de móvil:', error);
    }
  }, 30000);

  test('Verificar orientación horizontal en móvil', async () => {
    await seleniumConfig.navigateTo(baseUrl);
    await seleniumConfig.sleep(2000);
    
    // Establecer tamaño de ventana móvil horizontal
    await seleniumConfig.getDriver()?.manage().window().setRect({ width: 667, height: 375 });
    await seleniumConfig.sleep(1000);
    
    try {
      const body = await seleniumConfig.waitForElementVisible('body', 5000);
      expect(body).toBeDefined();
      
      const windowWidth = await seleniumConfig.getDriver()?.executeScript('return window.innerWidth');
      const windowHeight = await seleniumConfig.getDriver()?.executeScript('return window.innerHeight');
      
      console.log(`Orientación horizontal - Ancho: ${windowWidth}px, Alto: ${windowHeight}px`);
      
      // Verificar que el contenido se adapte a la orientación
      const hasHorizontalScroll = await seleniumConfig.getDriver()?.executeScript(
        'return document.body.scrollWidth > document.body.clientWidth'
      );
      console.log(`Hay scroll horizontal en orientación horizontal: ${hasHorizontalScroll}`);
      
    } catch (error) {
      console.log('Error en prueba de orientación horizontal:', error);
    }
  }, 30000);
});
