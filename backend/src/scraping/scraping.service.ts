import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chromium, Browser } from 'playwright';
import { Position } from 'src/position/position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);

  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  private async launchBrowser(): Promise<Browser> {
    return chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-software-rasterizer',
      ],
    });
  }

  async scrapeRemoteOK() {
    const browser = await this.launchBrowser();
    const page = await browser.newPage();

    try {
      this.logger.log('Scraping RemoteOK...');
      await page.goto('https://remoteok.com', {
        waitUntil: 'domcontentloaded',
        timeout: 60000, // aumenta o timeout para ambientes lentos
      });
      await page.waitForSelector('tr.job', { timeout: 20000 });

      const jobs = await page.$$eval('tr.job', rows =>
        rows.map(row => {
          const position = row.querySelector('h2')?.textContent?.trim() ?? '';
          const company = row.querySelector('h3')?.textContent?.trim() ?? '';
          const linkEl = row.querySelector('a[href*="/remote-jobs/"]');
          const post_link = linkEl ? (linkEl as HTMLAnchorElement).href : '';
          const skills = Array.from(row.querySelectorAll('.tag')).map(
            el => el.textContent?.trim() ?? '',
          );
          const salary =
            row.querySelector('.salary')?.textContent?.trim() ?? '';
          let location =
            row.querySelector('.location')?.textContent?.trim() ?? '';
          if (location === '💰 Upgrade to Premium to see salary') location = '';
          const post_date =
            row.querySelector('time')?.getAttribute('datetime') ??
            row.querySelector('.date')?.textContent?.trim() ??
            '';
          const source = 'remoteOk';

          return {
            position,
            location,
            salary,
            post_link,
            skills,
            company,
            post_date,
            source,
            rawPayload: {
              position,
              location,
              salary,
              post_link,
              skills,
              company,
              post_date,
              source,
            },
          };
        }),
      );

      await this.saveJobs(jobs);
      return jobs;
    } catch (err) {
      this.logger.error(`Erro no RemoteOK: ${err.message}`);
      return [];
    } finally {
      await browser.close();
    }
  }

  async scrapeWeWorkRemotely() {
    const browser = await this.launchBrowser();
    const page = await browser.newPage();

    try {
      this.logger.log('Scraping WeWorkRemotely...');
      await page.goto('https://weworkremotely.com/remote-jobs', {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      });
      await page.waitForSelector('li.new-listing-container', { timeout: 20000 });

      const jobs = await page.$$eval('li.new-listing-container', listings =>
        listings.map(li => {
          const title =
            li.querySelector('h3.new-listing__header__title')?.textContent?.trim() ?? '';
          const company =
            li.querySelector('p.new-listing__company-name')?.textContent?.trim() ?? '';
          const location =
            li.querySelector('p.new-listing__company-headquarters')?.textContent?.trim() ?? '';
          const linkEl = li.querySelector('a.listing-link--unlocked');
          const post_link = linkEl ? (linkEl as HTMLAnchorElement).href : '';
          const post_date =
            li.querySelector('p.new-listing__header__icons__date')?.textContent?.trim() ?? '';
          const source = 'weWorkRemotely';
          return {
            position: title,
            company,
            location,
            post_link,
            post_date,
            source,
            rawPayload: { title, company, location, post_link, post_date, source },
          };
        }),
      );

      const jobsWithDates = jobs.map(job => ({
        ...job,
        post_date: parseRelativeDate(job.post_date),
      }));

      await this.saveJobs(jobsWithDates);
      return jobsWithDates;
    } catch (err) {
      this.logger.error(`Erro no WeWorkRemotely: ${err.message}`);
      return [];
    } finally {
      await browser.close();
    }
  }

  private async saveJobs(jobs: any[]) {
    for (const job of jobs) {
      try {
        const exists = await this.positionRepository.findOne({
          where: { post_link: job.post_link },
        });
        if (!exists) {
          const entity = this.positionRepository.create(job);
          await this.positionRepository.save(entity);
        } else {
          this.logger.debug(`Vaga já existe: ${job.post_link}`);
        }
      } catch (error) {
        this.logger.error(`Erro ao salvar vaga (${job.post_link}): ${error.message}`);
      }
    }
  }
}

// Função auxiliar: converte textos relativos tipo "3d" ou "2h"
function parseRelativeDate(text: string): Date {
  const now = new Date();
  const match = text.match(/^(\d+)([smhdwMy])$/);
  if (!match) {
    const d = new Date(text);
    return isNaN(d.getTime()) ? now : d;
  }
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const timeUnits = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
    M: 30 * 24 * 60 * 60 * 1000,
    y: 365 * 24 * 60 * 60 * 1000,
  } as const;

  const ms = timeUnits[unit] ?? 0
  return new Date(now.getTime() - value * ms);
}
