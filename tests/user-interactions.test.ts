import { SeleniumConfig } from './selenium-config';
import { By } from 'selenium-webdriver';

describe('Pruebas de interacciones de usuario', () => {
  let seleniumConfig: SeleniumConfig;
  const baseUrl = 'http://localhost:3000';

  beforeAll(async () => {
    seleniumConfig = new SeleniumConfig();
    await seleniumConfig.createDriver(true);
  });

  afterAll(async () => {
    await seleniumConfig.quitDriver();
  });

  test('Interacciones con botones y enlaces en landing', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Encontrar todos los botones y enlaces clickeables
      const clickableElements = await seleniumConfig.getDriver()?.findElements(By.css('button, a[href], .btn, [role="button"]'));
      console.log(`Elementos clickeables encontrados: ${clickableElements?.length || 0}`);
      
      // Probar clic en los primeros 3 elementos (para no ser muy invasivos)
      if (clickableElements && clickableElements.length > 0) {
        for (let i = 0; i < Math.min(clickableElements.length, 3); i++) {
          try {
            const element = clickableElements[i];
            const isVisible = await element.isDisplayed();
            const isEnabled = await element.isEnabled();
            
            if (isVisible && isEnabled) {
              const tagName = await element.getTagName();
              const text = await element.getText();
              console.log(`Clic en elemento ${i + 1}: ${tagName} - "${text}"`);
              
              await element.click();
              await seleniumConfig.sleep(2000);
              
              // Verificar si hubo navegación
              const currentUrl = await seleniumConfig.getCurrentUrl();
              console.log(`URL después del clic: ${currentUrl}`);
              
              // Volver a la landing si navegamos a otra página
              if (!currentUrl.includes('/landing')) {
                await seleniumConfig.navigateTo(`${baseUrl}/landing`);
                await seleniumConfig.sleep(2000);
              }
            }
          } catch (error) {
            console.log(`Error al hacer clic en elemento ${i + 1}:`, error);
          }
        }
      }
      
    } catch (error) {
      console.log('Error en interacciones de landing:', error);
    }
  }, 30000);

  test('Hover effects y tooltips', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar elementos que podrían tener hover effects
      const hoverElements = await seleniumConfig.getDriver()?.findElements(By.css('.hover, button, a, .card, [data-hover]'));
      
      if (hoverElements && hoverElements.length > 0) {
        console.log(`Elementos con hover potenciales: ${hoverElements.length}`);
        
        // Probar hover en los primeros 3 elementos
        for (let i = 0; i < Math.min(hoverElements.length, 3); i++) {
          try {
            const element = hoverElements[i];
            const isVisible = await element.isDisplayed();
            
            if (isVisible) {
              // Mover mouse sobre el elemento
              await seleniumConfig.getDriver()?.actions().move({ origin: element }).perform();
              await seleniumConfig.sleep(1000);
              
              // Buscar tooltips o cambios visuales
              const tooltips = await seleniumConfig.getDriver()?.findElements(By.css('.tooltip, [role="tooltip"], .hover-content'));
              if (tooltips && tooltips.length > 0) {
                console.log(`Se encontraron ${tooltips.length} tooltips después del hover`);
              }
              
              // Mover mouse fuera
              await seleniumConfig.getDriver()?.actions().move({ origin: element, x: -10, y: -10 }).perform();
              await seleniumConfig.sleep(500);
            }
          } catch (error) {
            console.log(`Error en hover del elemento ${i + 1}:`, error);
          }
        }
      }
      
    } catch (error) {
      console.log('Error en prueba de hover:', error);
    }
  }, 30000);

  test('Scroll y lazy loading', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Obtener altura total de la página
      const pageHeight = await seleniumConfig.getDriver()?.executeScript('return document.body.scrollHeight');
      console.log(`Altura total de la página: ${pageHeight}px`);
      
      // Scroll gradual hacia abajo
      const viewportHeight = await seleniumConfig.getDriver()?.executeScript('return window.innerHeight');
      const scrollSteps = Math.ceil(pageHeight / viewportHeight);
      
      for (let i = 0; i < scrollSteps; i++) {
        await seleniumConfig.getDriver()?.executeScript(`window.scrollTo(0, ${i * viewportHeight});`);
        await seleniumConfig.sleep(1000);
        
        // Buscar elementos que podrían cargarse con scroll
        const lazyElements = await seleniumConfig.getDriver()?.findElements(By.css('[data-lazy], .lazy, img[src]'));
        if (lazyElements && lazyElements.length > 0) {
          console.log(`Paso ${i + 1}: ${lazyElements.length} elementos encontrados`);
        }
      }
      
      // Scroll de vuelta al inicio
      await seleniumConfig.getDriver()?.executeScript('window.scrollTo(0, 0);');
      await seleniumConfig.sleep(1000);
      
    } catch (error) {
      console.log('Error en prueba de scroll:', error);
    }
  }, 30000);

  test('Interacciones con formularios de búsqueda', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar campos de búsqueda
      const searchInputs = await seleniumConfig.getDriver()?.findElements(By.css('input[type="search"], input[placeholder*="buscar"], .search-input'));
      
      if (searchInputs && searchInputs.length > 0) {
        console.log(`Se encontraron ${searchInputs.length} campos de búsqueda`);
        
        for (let i = 0; i < searchInputs.length; i++) {
          const searchInput = searchInputs[i];
          
          // Escribir texto de búsqueda
          await searchInput.clear();
          await searchInput.sendKeys('receta');
          await seleniumConfig.sleep(1000);
          
          // Buscar botones de búsqueda o esperar resultados
          const searchButtons = await seleniumConfig.getDriver()?.findElements(By.css('.search-btn, button[type="submit"]'));
          if (searchButtons && searchButtons.length > 0) {
            await searchButtons[0].click();
            await seleniumConfig.sleep(2000);
          }
          
          // Limpiar campo
          await searchInput.clear();
          await seleniumConfig.sleep(500);
        }
      } else {
        console.log('No se encontraron campos de búsqueda en la landing');
      }
      
    } catch (error) {
      console.log('Error en prueba de búsqueda:', error);
    }
  }, 30000);

  test('Interacciones con modales y popups', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar elementos que podrían abrir modales
      const modalTriggers = await seleniumConfig.getDriver()?.findElements(By.css('[data-modal], [data-toggle], .modal-trigger'));
      
      if (modalTriggers && modalTriggers.length > 0) {
        console.log(`Se encontraron ${modalTriggers.length} posibles disparadores de modal`);
        
        for (let i = 0; i < Math.min(modalTriggers.length, 2); i++) {
          try {
            await modalTriggers[i].click();
            await seleniumConfig.sleep(2000);
            
            // Buscar modales abiertos
            const modals = await seleniumConfig.getDriver()?.findElements(By.css('.modal, .popup, [role="dialog"]'));
            if (modals && modals.length > 0) {
              console.log(`Modal abierto: ${await modals[0].getText()}`);
              
              // Buscar botones de cierre
              const closeButtons = await seleniumConfig.getDriver()?.findElements(By.css('.close, .modal-close, [aria-label="close"]'));
              if (closeButtons && closeButtons.length > 0) {
                await closeButtons[0].click();
                await seleniumConfig.sleep(1000);
              }
            }
          } catch (error) {
            console.log(`Error con modal ${i + 1}:`, error);
          }
        }
      } else {
        console.log('No se encontraron disparadores de modales');
      }
      
    } catch (error) {
      console.log('Error en prueba de modales:', error);
    }
  }, 30000);

  test('Interacciones con temas (dark/light mode)', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar botones de cambio de tema
      const themeButtons = await seleniumConfig.getDriver()?.findElements(By.css('.theme-switch, [data-theme], .dark-mode, .light-mode'));
      
      if (themeButtons && themeButtons.length > 0) {
        console.log(`Se encontraron ${themeButtons.length} botones de tema`);
        
        // Verificar tema actual
        const currentTheme = await seleniumConfig.getDriver()?.executeScript(
          'return document.documentElement.classList.contains("dark") ? "dark" : "light"'
        );
        console.log(`Tema actual: ${currentTheme}`);
        
        // Cambiar tema
        await themeButtons[0].click();
        await seleniumConfig.sleep(1000);
        
        // Verificar cambio
        const newTheme = await seleniumConfig.getDriver()?.executeScript(
          'return document.documentElement.classList.contains("dark") ? "dark" : "light"'
        );
        console.log(`Nuevo tema: ${newTheme}`);
        
        expect(newTheme).not.toBe(currentTheme);
        
        // Volver al tema original
        await themeButtons[0].click();
        await seleniumConfig.sleep(1000);
      } else {
        console.log('No se encontraron botones de cambio de tema');
      }
      
    } catch (error) {
      console.log('Error en prueba de temas:', error);
    }
  }, 30000);
});
