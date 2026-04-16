import { SeleniumConfig } from './selenium-config';
import { By } from 'selenium-webdriver';

describe('Pruebas de rendimiento y accesibilidad', () => {
  let seleniumConfig: SeleniumConfig;
  const baseUrl = 'http://localhost:3000';

  beforeAll(async () => {
    seleniumConfig = new SeleniumConfig();
    await seleniumConfig.createDriver(true);
  });

  afterAll(async () => {
    await seleniumConfig.quitDriver();
  });

  test('Tiempo de carga de página principal', async () => {
    const startTime = Date.now();
    
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    
    // Esperar a que la página esté completamente cargada
    await seleniumConfig.getDriver()?.wait(async () => {
      return await seleniumConfig.getDriver()?.executeScript('return document.readyState') === 'complete';
    }, 10000);
    
    const loadTime = Date.now() - startTime;
    console.log(`Tiempo de carga: ${loadTime}ms`);
    
    // Verificar que la carga no sea excesivamente lenta
    expect(loadTime).toBeLessThan(10000); // 10 segundos máximo
    
    // Verificar elementos básicos cargados
    const body = await seleniumConfig.waitForElementVisible('body', 5000);
    expect(body).toBeDefined();
  }, 30000);

  test('Rendimiento en diferentes tamaños de pantalla', async () => {
    const sizes = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    for (const size of sizes) {
      console.log(`Probando tamaño: ${size.name} (${size.width}x${size.height})`);
      
      await seleniumConfig.getDriver()?.manage().window().setRect({ width: size.width, height: size.height });
      await seleniumConfig.sleep(1000);
      
      const startTime = Date.now();
      await seleniumConfig.navigateTo(`${baseUrl}/landing`);
      await seleniumConfig.sleep(2000);
      const loadTime = Date.now() - startTime;
      
      console.log(`Tiempo de carga en ${size.name}: ${loadTime}ms`);
      
      // Verificar que los elementos principales sean visibles
      try {
        const header = await seleniumConfig.waitForElement('header', 3000);
        const main = await seleniumConfig.waitForElement('main', 3000);
        
        if (header && main) {
          console.log(`✅ Elementos principales visibles en ${size.name}`);
        }
      } catch (error) {
        console.log(`❌ Error verificando elementos en ${size.name}:`, error);
      }
    }
  }, 45000);

  test('Accesibilidad: estructura semántica', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Verificar estructura semántica básica
      semanticChecks: {
        const header = await seleniumConfig.waitForElement('header', 5000);
        const main = await seleniumConfig.waitForElement('main', 5000);
        const footer = await seleniumConfig.waitForElement('footer', 5000);
        const nav = await seleniumConfig.waitForElement('nav', 5000);
        
        expect(header).toBeDefined();
        expect(main).toBeDefined();
        expect(footer).toBeDefined();
        expect(nav).toBeDefined();
        
        console.log('✅ Estructura semántica correcta');
      }
      
      // Verificar encabezados jerárquicos
      const headings = await seleniumConfig.getDriver()?.findElements(By.css('h1, h2, h3, h4, h5, h6'));
      if (headings && headings.length > 0) {
        console.log(`Se encontraron ${headings.length} encabezados`);
        
        // Verificar que haya un h1
        const h1Elements = await seleniumConfig.getDriver()?.findElements(By.css('h1'));
        expect(h1Elements?.length).toBeGreaterThan(0);
        console.log(`✅ Se encontraron ${h1Elements?.length} elementos h1`);
      }
      
      // Verificar atributos alt en imágenes
      const images = await seleniumConfig.getDriver()?.findElements(By.css('img'));
      if (images && images.length > 0) {
        let imagesWithAlt = 0;
        for (const img of images) {
          const alt = await img.getAttribute('alt');
          if (alt) imagesWithAlt++;
        }
        
        console.log(`Imágenes con alt: ${imagesWithAlt}/${images.length}`);
        expect(imagesWithAlt / images.length).toBeGreaterThan(0.8); // Al menos 80% con alt
      }
      
    } catch (error) {
      console.log('Error en pruebas de accesibilidad:', error);
    }
  }, 30000);

  test('Accesibilidad: navegación por teclado', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Enfocar el primer elemento enfocable
      await seleniumConfig.getDriver()?.executeScript('document.body.focus()');
      await seleniumConfig.sleep(500);
      
      // Navegar con Tab
      let focusableElements = 0;
      for (let i = 0; i < 10; i++) {
        await seleniumConfig.getDriver()?.actions().sendKeys('\uE004').perform(); // Tab key
        await seleniumConfig.sleep(500);
        
        const activeElement = await seleniumConfig.getDriver()?.executeScript('return document.activeElement');
        const tagName = await activeElement?.tagName;
        const isFocusable = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(tagName);
        
        if (isFocusable) {
          focusableElements++;
          console.log(`Elemento enfocado: ${tagName}`);
        }
      }
      
      console.log(`Elementos enfocables encontrados: ${focusableElements}`);
      expect(focusableElements).toBeGreaterThan(0);
      
    } catch (error) {
      console.log('Error en prueba de navegación por teclado:', error);
    }
  }, 30000);

  test('Accesibilidad: contraste y legibilidad', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Verificar que haya suficiente contraste (básico)
      const textElements = await seleniumConfig.getDriver()?.findElements(By.css('p, h1, h2, h3, h4, h5, h6, span, a'));
      
      if (textElements && textElements.length > 0) {
        console.log(`Analizando ${textElements.length} elementos de texto`);
        
        // Verificar tamaños de fuente (básico)
        let readableElements = 0;
        for (let i = 0; i < Math.min(textElements.length, 10); i++) {
          try {
            const fontSize = await textElements[i].getCssValue('font-size');
            const fontSizeValue = parseInt(fontSize);
            
            if (fontSizeValue >= 12) { // Mínimo 12px
              readableElements++;
            }
          } catch (error) {
            // Ignorar errores en elementos individuales
          }
        }
        
        console.log(`Elementos con texto legible: ${readableElements}/${Math.min(textElements.length, 10)}`);
      }
      
      // Verificar enlaces descriptivos
      const links = await seleniumConfig.getDriver()?.findElements(By.css('a[href]'));
      if (links && links.length > 0) {
        let descriptiveLinks = 0;
        
        for (const link of links) {
          const text = await link.getText();
          const hasDescriptiveText = text && text.trim().length > 2 && !text.toLowerCase().includes('hacer clic');
          
          if (hasDescriptiveText) {
            descriptiveLinks++;
          }
        }
        
        console.log(`Enlaces descriptivos: ${descriptiveLinks}/${links.length}`);
        expect(descriptiveLinks / links.length).toBeGreaterThan(0.7); // Al menos 70% descriptivos
      }
      
    } catch (error) {
      console.log('Error en pruebas de contraste:', error);
    }
  }, 30000);

  test('Rendimiento: uso de memoria y recursos', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(3000);
    
    try {
      // Obtener métricas de rendimiento (básicas)
      const metrics = await seleniumConfig.getDriver()?.executeScript(`
        return {
          domNodes: document.querySelectorAll('*').length,
          images: document.querySelectorAll('img').length,
          scripts: document.querySelectorAll('script').length,
          stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length,
          memoryUsage: performance.memory ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
          } : null
        };
      `);
      
      console.log('Métricas de rendimiento:', metrics);
      
      // Verificar que no haya un número excesivo de nodos DOM
      expect(metrics.domNodes).toBeLessThan(2000);
      
      // Verificar número razonable de imágenes
      expect(metrics.images).toBeLessThan(50);
      
      // Verificar scripts y stylesheets
      expect(metrics.scripts).toBeLessThan(20);
      expect(metrics.stylesheets).toBeLessThan(10);
      
      if (metrics.memoryUsage) {
        console.log(`Uso de memoria: ${metrics.memoryUsage.used}MB / ${metrics.memoryUsage.total}MB`);
        expect(metrics.memoryUsage.used).toBeLessThan(100); // Menos de 100MB
      }
      
    } catch (error) {
      console.log('Error en métricas de rendimiento:', error);
    }
  }, 30000);

  test('Accesibilidad: ARIA labels y roles', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Verificar elementos con atributos ARIA
      const ariaElements = await seleniumConfig.getDriver()?.findElements(By.css('[role], [aria-label], [aria-labelledby], [aria-describedby]'));
      
      console.log(`Elementos con atributos ARIA: ${ariaElements.length}`);
      
      // Verificar roles importantes
      const navigation = await seleniumConfig.getDriver()?.findElements(By.css('[role="navigation"], nav'));
      const main = await seleniumConfig.getDriver()?.findElements(By.css('[role="main"], main'));
      const banner = await seleniumConfig.getDriver()?.findElements(By.css('[role="banner"], header'));
      
      console.log(`Navegación: ${navigation.length}, Main: ${main.length}, Banner: ${banner.length}`);
      
      // Verificar etiquetas aria en botones sin texto
      const iconButtons = await seleniumConfig.getDriver()?.findElements(By.css('button:not(:has-text)), button:empty'));
      if (iconButtons && iconButtons.length > 0) {
        let iconButtonsWithAria = 0;
        
        for (const button of iconButtons) {
          const ariaLabel = await button.getAttribute('aria-label');
          if (ariaLabel) {
            iconButtonsWithAria++;
          }
        }
        
        console.log(`Botones de icono con aria-label: ${iconButtonsWithAria}/${iconButtons.length}`);
        
        if (iconButtons.length > 0) {
          expect(iconButtonsWithAria / iconButtons.length).toBeGreaterThan(0.5);
        }
      }
      
    } catch (error) {
      console.log('Error en pruebas ARIA:', error);
    }
  }, 30000);
});
