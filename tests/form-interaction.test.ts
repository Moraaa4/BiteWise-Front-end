import { SeleniumConfig } from './selenium-config';
import { By } from 'selenium-webdriver';

describe('Pruebas de interacción con formularios', () => {
  let seleniumConfig: SeleniumConfig;
  const baseUrl = 'http://localhost:3000';

  beforeAll(async () => {
    seleniumConfig = new SeleniumConfig();
    await seleniumConfig.createDriver(true);
  });

  afterAll(async () => {
    await seleniumConfig.quitDriver();
  });

  test('Buscar y probar campos de formulario', async () => {
    await seleniumConfig.navigateTo(baseUrl);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar diferentes tipos de campos de formulario
      const inputs = await seleniumConfig.getDriver()?.findElements(By.css('input[type="text"], input[type="email"], input[type="password"], textarea'));
      const selects = await seleniumConfig.getDriver()?.findElements(By.css('select'));
      const checkboxes = await seleniumConfig.getDriver()?.findElements(By.css('input[type="checkbox"]'));
      const radioButtons = await seleniumConfig.getDriver()?.findElements(By.css('input[type="radio"]'));
      
      console.log(`Campos de texto encontrados: ${inputs?.length || 0}`);
      console.log(`Selects encontrados: ${selects?.length || 0}`);
      console.log(`Checkboxes encontrados: ${checkboxes?.length || 0}`);
      console.log(`Radio buttons encontrados: ${radioButtons?.length || 0}`);
      
      // Probar llenar campos de texto si existen
      if (inputs && inputs.length > 0) {
        for (let i = 0; i < Math.min(inputs.length, 3); i++) {
          const input = inputs[i];
          const inputType = await input.getAttribute('type');
          const placeholder = await input.getAttribute('placeholder');
          
          console.log(`Probando input ${i + 1}: type=${inputType}, placeholder=${placeholder}`);
          
          // Limpiar y llenar el campo
          await input.clear();
          
          if (inputType === 'email') {
            await input.sendKeys('test@example.com');
          } else if (inputType === 'password') {
            await input.sendKeys('password123');
          } else {
            await input.sendKeys(`Test value ${i + 1}`);
          }
          
          await seleniumConfig.sleep(500);
        }
      }
      
      // Probar selects si existen
      if (selects && selects.length > 0) {
        for (let i = 0; i < Math.min(selects.length, 2); i++) {
          const select = selects[i];
          
          // Obtener opciones disponibles
          const options = await select.findElements(By.css('option'));
          if (options.length > 1) {
            // Seleccionar la segunda opción (índice 1)
            await options[1].click();
            console.log(`Select ${i + 1}: Seleccionada opción ${await options[1].getText()}`);
          }
          
          await seleniumConfig.sleep(500);
        }
      }
      
      // Probar checkboxes si existen
      if (checkboxes && checkboxes.length > 0) {
        for (let i = 0; i < Math.min(checkboxes.length, 3); i++) {
          const checkbox = checkboxes[i];
          await checkbox.click();
          console.log(`Checkbox ${i + 1}: Marcado/desmarcado`);
          await seleniumConfig.sleep(500);
        }
      }
      
    } catch (error) {
      console.log('Error durante la prueba de formularios:', error);
    }
  }, 30000);

  test('Buscar y probar botones de envío', async () => {
    await seleniumConfig.navigateTo(baseUrl);
    await seleniumConfig.sleep(2000);
    
    try {
      // Buscar botones de envío
      const submitButtons = await seleniumConfig.getDriver()?.findElements(By.css('button[type="submit"], input[type="submit"], .btn-submit, .submit'));
      const regularButtons = await seleniumConfig.getDriver()?.findElements(By.css('button:not([type="submit"]), .btn:not(.btn-submit)'));
      
      console.log(`Botones de envío encontrados: ${submitButtons?.length || 0}`);
      console.log(`Botones regulares encontrados: ${regularButtons?.length || 0}`);
      
      // Probar botones regulares primero
      if (regularButtons && regularButtons.length > 0) {
        for (let i = 0; i < Math.min(regularButtons.length, 2); i++) {
          const button = regularButtons[i];
          const buttonText = await button.getText();
          console.log(`Haciendo clic en botón: "${buttonText}"`);
          
          await button.click();
          await seleniumConfig.sleep(1000);
          
          // Verificar si algo cambió
          const currentUrl = await seleniumConfig.getCurrentUrl();
          console.log('URL después del clic:', currentUrl);
        }
      }
      
      // Probar botones de envío (con cuidado de no enviar datos reales)
      if (submitButtons && submitButtons.length > 0) {
        console.log('Se encontraron botones de envío, pero no se probarán para evitar envíos no deseados');
      }
      
    } catch (error) {
      console.log('Error durante la prueba de botones:', error);
    }
  }, 30000);
});
