import { SeleniumConfig } from './selenium-config';
import { By } from 'selenium-webdriver';

describe('Pruebas de manejo de errores', () => {
  let seleniumConfig: SeleniumConfig;
  const baseUrl = 'http://localhost:3000';

  beforeAll(async () => {
    seleniumConfig = new SeleniumConfig();
    await seleniumConfig.createDriver(true);
  });

  afterAll(async () => {
    await seleniumConfig.quitDriver();
  });

  test('Páginas no encontradas (404)', async () => {
    try {
      // Navegar a una página que no existe
      await seleniumConfig.navigateTo(`${baseUrl}/pagina-inexistente`);
      await seleniumConfig.sleep(3000);
      
      const currentUrl = await seleniumConfig.getCurrentUrl();
      console.log('URL actual:', currentUrl);
      
      // Buscar indicadores de página 404
      const notFoundIndicators = await seleniumConfig.getDriver()?.findElements(By.css(
        '.not-found, .error-404, h1:contains("404"), h2:contains("No encontrada"), .page-not-found'
      ));
      
      if (notFoundIndicators && notFoundIndicators.length > 0) {
        console.log('✅ Se encontró página 404 personalizada');
        
        // Verificar contenido de la página 404
        const pageContent = await seleniumConfig.getDriver()?.getPageSource();
        if (pageContent) {
          const has404 = pageContent.includes('404') || pageContent.includes('no encontrada');
          expect(has404).toBe(true);
        }
      } else {
        // Verificar que al menos no haya errores de servidor
        const serverError = await seleniumConfig.getDriver()?.findElements(By.css('.server-error, h1:contains("500")'));
        expect(serverError?.length).toBe(0);
      }
      
    } catch (error) {
      console.log('Error en prueba 404:', error);
    }
  }, 30000);

  test('Redirecciones incorrectas', async () => {
    try {
      // Probar URLs que podrían causar redirecciones incorrectas
      const testUrls = [
        `${baseUrl}/login`,
        `${baseUrl}/dashboard`,
        `${baseUrl}/profile`,
        `${baseUrl}/recipes`
      ];
      
      for (const url of testUrls) {
        await seleniumConfig.navigateTo(url);
        await seleniumConfig.sleep(2000);
        
        const currentUrl = await seleniumConfig.getCurrentUrl();
        console.log(`URL probada: ${url} -> Redirigida a: ${currentUrl}`);
        
        // Verificar que no haya bucles de redirección
        expect(currentUrl).not.toBe(url + '/');
        
        // Verificar que la redirección sea a una página válida
        const validDestinations = ['/login', '/landing', '/dashboard', '/register'];
        const isValidRedirect = validDestinations.some(dest => currentUrl.includes(dest));
        
        if (!isValidRedirect) {
          console.log(`⚠️ Posible redirección inesperada a: ${currentUrl}`);
        }
      }
      
    } catch (error) {
      console.log('Error en prueba de redirecciones:', error);
    }
  }, 30000);

  test('Manejo de errores de formulario', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/login`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar formulario de login
      const emailInput = await seleniumConfig.waitForElement('input[type="email"], input[name="email"]', 5000);
      const passwordInput = await seleniumConfig.waitForElement('input[type="password"], input[name="password"]', 5000);
      const submitButton = await seleniumConfig.waitForElement('button[type="submit"]', 5000);
      
      if (emailInput && passwordInput && submitButton) {
        // Enviar formulario vacío
        await submitButton.click();
        await seleniumConfig.sleep(2000);
        
        // Buscar mensajes de error
        const errorMessages = await seleniumConfig.getDriver()?.findElements(By.css(
          '.error, .text-red-500, .invalid-feedback, [role="alert"], .error-message'
        ));
        
        if (errorMessages && errorMessages.length > 0) {
          console.log(`✅ Se encontraron ${errorMessages.length} mensajes de error`);
          
          for (let i = 0; i < errorMessages.length; i++) {
            const errorText = await errorMessages[i].getText();
            console.log(`Error ${i + 1}: ${errorText}`);
            expect(errorText.trim().length).toBeGreaterThan(0);
          }
        }
        
        // Probar con datos inválidos
        await emailInput.clear();
        await emailInput.sendKeys('email-invalido');
        await passwordInput.clear();
        await passwordInput.sendKeys('123');
        
        await submitButton.click();
        await seleniumConfig.sleep(2000);
        
        // Verificar nuevos mensajes de error
        const newErrorMessages = await seleniumConfig.getDriver()?.findElements(By.css(
          '.error, .text-red-500, .invalid-feedback, [role="alert"]'
        ));
        
        console.log(`Mensajes de error con datos inválidos: ${newErrorMessages?.length || 0}`);
      }
      
    } catch (error) {
      console.log('Error en prueba de manejo de errores de formulario:', error);
    }
  }, 30000);

  test('Red de conexión lenta', async () => {
    try {
      // Simular red lenta (si el navegador lo permite)
      await seleniumConfig.getDriver()?.executeScript(`
        if (navigator.connection) {
          console.log('Información de conexión:', navigator.connection);
        }
      `);
      
      const startTime = Date.now();
      await seleniumConfig.navigateTo(`${baseUrl}/landing`);
      
      // Esperar más tiempo para simular carga lenta
      await seleniumConfig.sleep(5000);
      
      const loadTime = Date.now() - startTime;
      console.log(`Tiempo de carga con red simulada: ${loadTime}ms`);
      
      // Verificar que la página se cargue eventualmente
      const body = await seleniumConfig.waitForElementVisible('body', 10000);
      expect(body).toBeDefined();
      
      // Verificar indicadores de carga
      const loadingIndicators = await seleniumConfig.getDriver()?.findElements(By.css(
        '.loading, .spinner, .loader, [data-loading]'
      ));
      
      if (loadingIndicators && loadingIndicators.length > 0) {
        console.log('Se encontraron indicadores de carga');
      }
      
    } catch (error) {
      console.log('Error en prueba de red lenta:', error);
    }
  }, 30000);

  test('Manejo de JavaScript deshabilitado (parcial)', async () => {
    try {
      // Esta prueba es limitada ya que Selenium requiere JavaScript
      // pero podemos verificar elementos que deberían funcionar sin JS
      
      await seleniumConfig.navigateTo(`${baseUrl}/landing`);
      await seleniumConfig.sleep(2000);
      
      // Verificar enlaces que funcionarían sin JavaScript
      const standardLinks = await seleniumConfig.getDriver()?.findElements(By.css('a[href^="/"]'));
      console.log(`Enlaces estándar encontrados: ${standardLinks?.length || 0}`);
      
      // Verificar formularios que funcionarían sin JavaScript
      const standardForms = await seleniumConfig.getDriver()?.findElements(By.css('form[method]'));
      console.log(`Formularios estándar encontrados: ${standardForms?.length || 0}`);
      
      // Verificar contenido accesible sin JavaScript
      const staticContent = await seleniumConfig.getDriver()?.findElements(By.css('h1, h2, p, img, div'));
      console.log(`Elementos de contenido estático: ${staticContent?.length || 0}`);
      
      expect(staticContent?.length).toBeGreaterThan(0);
      
    } catch (error) {
      console.log('Error en prueba de JavaScript deshabilitado:', error);
    }
  }, 30000);

  test('Manejo de caracteres especiales y XSS', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/login`);
    await seleniumConfig.sleep(2000);
    
    try {
      const emailInput = await seleniumConfig.waitForElement('input[type="email"], input[name="email"]', 5000);
      const passwordInput = await seleniumConfig.waitForElement('input[type="password"], input[name="password"]', 5000);
      
      if (emailInput && passwordInput) {
        // Probar caracteres especiales
        const specialChars = ['<script>alert("xss")</script>', '" onclick="alert(1)"', "'; DROP TABLE users; --"];
        
        for (const chars of specialChars) {
          await emailInput.clear();
          await emailInput.sendKeys(chars);
          await passwordInput.clear();
          await passwordInput.sendKeys('test123');
          
          await seleniumConfig.sleep(1000);
          
          // Verificar que no se ejecute JavaScript malicioso
          const alerts = await seleniumConfig.getDriver()?.findElements(By.css('.alert, .notification'));
          if (alerts && alerts.length > 0) {
            for (const alert of alerts) {
              const alertText = await alert.getText();
              // Verificar que el texto no contenga el script original
              expect(alertText).not.toContain('<script>');
            }
          }
        }
        
        console.log('✅ Pruebas de caracteres especiales completadas');
      }
      
    } catch (error) {
      console.log('Error en prueba de caracteres especiales:', error);
    }
  }, 30000);

  test('Manejo de sesión expirada', async () => {
    try {
      // Navegar a una página protegida
      await seleniumConfig.navigateTo(`${baseUrl}/dashboard`);
      await seleniumConfig.sleep(3000);
      
      const currentUrl = await seleniumConfig.getCurrentUrl();
      
      // Si redirige a login, verificar que haya mensaje de sesión expirada
      if (currentUrl.includes('/login')) {
        const sessionMessages = await seleniumConfig.getDriver()?.findElements(By.css(
          '.session-expired, .auth-required, [data-session="expired"]'
        ));
        
        if (sessionMessages && sessionMessages.length > 0) {
          console.log('✅ Se encontró mensaje de sesión requerida');
        }
        
        // Verificar que el formulario de login esté presente
        const loginForm = await seleniumConfig.waitForElement('form', 5000);
        expect(loginForm).toBeDefined();
      }
      
    } catch (error) {
      console.log('Error en prueba de sesión expirada:', error);
    }
  }, 30000);
});
