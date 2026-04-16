import { Builder, WebDriver, By, until, Options } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

export class SeleniumConfig {
  private driver: WebDriver | null = null;

  async createDriver(headless: boolean = false): Promise<WebDriver> {
    const options = new Options();
    
    if (headless) {
      options.addArguments('--headless');
    }
    
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    this.driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .build();

    return this.driver;
  }

  async quitDriver(): Promise<void> {
    if (this.driver) {
      await this.driver.quit();
      this.driver = null;
    }
  }

  getDriver(): WebDriver | null {
    return this.driver;
  }

  async waitForElement(selector: string, timeout: number = 10000): Promise<any> {
    if (!this.driver) throw new Error('Driver not initialized');
    return await this.driver.wait(until.elementLocated(By.css(selector)), timeout);
  }

  async waitForElementVisible(selector: string, timeout: number = 10000): Promise<any> {
    if (!this.driver) throw new Error('Driver not initialized');
    const element = await this.waitForElement(selector, timeout);
    await this.driver.wait(until.elementIsVisible(element), timeout);
    return element;
  }

  async clickElement(selector: string): Promise<void> {
    if (!this.driver) throw new Error('Driver not initialized');
    const element = await this.waitForElementVisible(selector);
    await element.click();
  }

  async typeText(selector: string, text: string): Promise<void> {
    if (!this.driver) throw new Error('Driver not initialized');
    const element = await this.waitForElementVisible(selector);
    await element.sendKeys(text);
  }

  async getText(selector: string): Promise<string> {
    if (!this.driver) throw new Error('Driver not initialized');
    const element = await this.waitForElementVisible(selector);
    return await element.getText();
  }

  async navigateTo(url: string): Promise<void> {
    if (!this.driver) throw new Error('Driver not initialized');
    await this.driver.get(url);
  }

  async getCurrentUrl(): Promise<string> {
    if (!this.driver) throw new Error('Driver not initialized');
    return await this.driver.getCurrentUrl();
  }

  async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
