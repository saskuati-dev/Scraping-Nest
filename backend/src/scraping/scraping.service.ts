import { Injectable, Logger } from '@nestjs/common';
import { chromium } from 'playwright';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  async scrape()  {
    const url = ''
    this.logger.log(`Iniciando scraping da URL: ${url}`);
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      const content = await page.content();
      this.logger.log(`Scraping finalizado com sucesso.`);
      return content;
    } catch (error) {
      this.logger.error(`Erro durante o scraping: ${error}`);
      throw error;
    } finally {
      await browser.close();
    }
  
    }  
}