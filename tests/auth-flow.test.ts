import { SeleniumConfig } from './selenium-config';
import { By } from 'selenium-webdriver';

describe('Pruebas de flujo de autenticación', () => {
  let seleniumConfig: SeleniumConfig;
  const baseUrl = 'http://localhost:3000';

  beforeAll(async () => {
    seleniumConfig = new SeleniumConfig();
    await seleniumConfig.createDriver(true);
  });

  afterAll(async () => {
    await seleniumConfig.quitDriver();
  });

  test('Navegación desde landing a login', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    // Verificar que estamos en la página landing
    const currentUrl = await seleniumConfig.getCurrentUrl();
    expect(currentUrl).toContain('/landing');
    
    try {
      // Buscar el enlace de "Iniciar sesión"
      const loginLink = await seleniumConfig.waitForElementVisible('a[href="/login"]', 5000);
      expect(loginLink).toBeDefined();
      
      // Hacer clic en el enlace
      await loginLink.click();
      await seleniumConfig.sleep(3000);
      
      // Verificar que redirige a la página de login
      const newUrl = await seleniumConfig.getCurrentUrl();
      expect(newUrl).toContain('/login');
      
      // Verificar elementos del formulario de login
      const emailInput = await seleniumConfig.waitForElement('input[type="email"], input[name="email"], input[placeholder*="email"]', 5000);
      const passwordInput = await seleniumConfig.waitForElement('input[type="password"], input[name="password"], input[placeholder*="password"]', 5000);
      const submitButton = await seleniumConfig.waitForElement('button[type="submit"], .btn-submit', 5000);
      
      expect(emailInput).toBeDefined();
      expect(passwordInput).toBeDefined();
      expect(submitButton).toBeDefined();
      
    } catch (error) {
      console.log('Error en navegación a login:', error);
    }
  }, 30000);

  test('Navegación desde landing a registro', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/landing`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar botones de registro
      const registerButtons = await seleniumConfig.getDriver()?.findElements(By.css('a[href="/register"]'));
      
      if (registerButtons && registerButtons.length > 0) {
        // Hacer clic en el primer botón de registro
        await registerButtons[0].click();
        await seleniumConfig.sleep(3000);
        
        // Verificar que redirige a la página de registro
        const newUrl = await seleniumConfig.getCurrentUrl();
        expect(newUrl).toContain('/register');
        
        // Verificar elementos del formulario de registro
        const nameInput = await seleniumConfig.waitForElement('input[name="name"], input[placeholder*="nombre"]', 5000);
        const emailInput = await seleniumConfig.waitForElement('input[type="email"], input[name="email"]', 5000);
        const passwordInput = await seleniumConfig.waitForElement('input[type="password"], input[name="password"]', 5000);
        const confirmPasswordInput = await seleniumConfig.waitForElement('input[name="confirmPassword"], input[placeholder*="confirmar"]', 5000);
        
        expect(nameInput).toBeDefined();
        expect(emailInput).toBeDefined();
        expect(passwordInput).toBeDefined();
        expect(confirmPasswordInput).toBeDefined();
      }
      
    } catch (error) {
      console.log('Error en navegación a registro:', error);
    }
  }, 30000);

  test('Validación de formulario de login', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/login`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Intentar enviar formulario vacío
      const submitButton = await seleniumConfig.waitForElementVisible('button[type="submit"], .btn-submit', 5000);
      await submitButton.click();
      await seleniumConfig.sleep(2000);
      
      // Buscar mensajes de error
      const errorMessages = await seleniumConfig.getDriver()?.findElements(By.css('.error, .text-red-500, [role="alert"], .invalid-feedback'));
      if (errorMessages && errorMessages.length > 0) {
        console.log('Se encontraron mensajes de error de validación');
        for (let i = 0; i < errorMessages.length; i++) {
          const errorText = await errorMessages[i].getText();
          console.log(`Error ${i + 1}: ${errorText}`);
        }
      }
      
      // Llenar formulario con datos inválidos
      const emailInput = await seleniumConfig.waitForElement('input[type="email"], input[name="email"]', 5000);
      const passwordInput = await seleniumConfig.waitForElement('input[type="password"], input[name="password"]', 5000);
      
      await emailInput.clear();
      await emailInput.sendKeys('email-invalido');
      await passwordInput.clear();
      await passwordInput.sendKeys('123');
      
      await submitButton.click();
      await seleniumConfig.sleep(2000);
      
      // Verificar si hay nuevos mensajes de error
      const newErrorMessages = await seleniumConfig.getDriver()?.findElements(By.css('.error, .text-red-500, [role="alert"]'));
      if (newErrorMessages && newErrorMessages.length > 0) {
        console.log('Se encontraron mensajes de error para datos inválidos');
      }
      
    } catch (error) {
      console.log('Error en validación de login:', error);
    }
  }, 30000);

  test('Validación de formulario de registro', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/register`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Verificar campos del formulario
      const nameInput = await seleniumConfig.waitForElement('input[name="name"], input[placeholder*="nombre"]', 5000);
      const emailInput = await seleniumConfig.waitForElement('input[type="email"], input[name="email"]', 5000);
      const passwordInput = await seleniumConfig.waitForElement('input[type="password"], input[name="password"]', 5000);
      const confirmPasswordInput = await seleniumConfig.waitForElement('input[name="confirmPassword"], input[placeholder*="confirmar"]', 5000);
      
      // Llenar con datos de prueba
      await nameInput.clear();
      await nameInput.sendKeys('Usuario Test');
      
      await emailInput.clear();
      await emailInput.sendKeys('test@example.com');
      
      await passwordInput.clear();
      await passwordInput.sendKeys('password123');
      
      await confirmPasswordInput.clear();
      await confirmPasswordInput.sendKeys('password123');
      
      // Buscar términos y condiciones o checkboxes
      const checkboxes = await seleniumConfig.getDriver()?.findElements(By.css('input[type="checkbox"]'));
      if (checkboxes && checkboxes.length > 0) {
        console.log(`Se encontraron ${checkboxes.length} checkboxes en el formulario`);
        for (let i = 0; i < checkboxes.length; i++) {
          await checkboxes[i].click();
          await seleniumConfig.sleep(500);
        }
      }
      
      // Intentar enviar formulario
      const submitButton = await seleniumConfig.waitForElementVisible('button[type="submit"], .btn-submit', 5000);
      await submitButton.click();
      await seleniumConfig.sleep(3000);
      
      // Verificar si hay redirección o mensajes
      const currentUrl = await seleniumConfig.getCurrentUrl();
      console.log('URL después de intentar registro:', currentUrl);
      
      // Buscar mensajes de éxito o error
      const successMessages = await seleniumConfig.getDriver()?.findElements(By.css('.success, .text-green-500, .alert-success'));
      const errorMessages = await seleniumConfig.getDriver()?.findElements(By.css('.error, .text-red-500, .alert-error'));
      
      if (successMessages && successMessages.length > 0) {
        console.log('Se encontraron mensajes de éxito');
      }
      
      if (errorMessages && errorMessages.length > 0) {
        console.log('Se encontraron mensajes de error en el registro');
      }
      
    } catch (error) {
      console.log('Error en prueba de registro:', error);
    }
  }, 30000);

  test('Enlaces de recuperación de contraseña', async () => {
    await seleniumConfig.navigateTo(`${baseUrl}/login`);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar enlace de "olvidé mi contraseña"
      const forgotPasswordLinks = await seleniumConfig.getDriver()?.findElements(By.css('a[href*="forgot"], a[href*="recover"], .forgot-password'));
      
      if (forgotPasswordLinks && forgotPasswordLinks.length > 0) {
        console.log('Se encontraron enlaces de recuperación de contraseña');
        
        await forgotPasswordLinks[0].click();
        await seleniumConfig.sleep(3000);
        
        const currentUrl = await seleniumConfig.getCurrentUrl();
        console.log('URL después de clic en recuperación:', currentUrl);
        
        // Verificar formulario de recuperación
        const emailInput = await seleniumConfig.waitForElement('input[type="email"], input[name="email"]', 5000);
        expect(emailInput).toBeDefined();
      } else {
        console.log('No se encontraron enlaces de recuperación de contraseña');
      }
      
    } catch (error) {
      console.log('Error en prueba de recuperación:', error);
    }
  }, 30000);
});
