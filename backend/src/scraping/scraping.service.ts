import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { chromium } from 'playwright';
import { Position } from 'src/position/position.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScrapingService {
  constructor(
    @InjectRepository(Position)
    private readonly positionRepository: Repository<Position>,
  ) {}

  async scrapeRemoteOK() {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://remoteok.com', { waitUntil: 'networkidle' });
    await page.waitForSelector('tr.job');

    const jobs = await page.$$eval('tr.job', rows =>
      rows.map(row => {
        const position = row.querySelector('h2')?.textContent?.trim() ?? '';
        const company = row.querySelector('h3')?.textContent?.trim() ?? '';
        const linkEl = row.querySelector('a[href*="/remote-jobs/"]');
        const post_link = linkEl ? (linkEl as HTMLAnchorElement).href : '';
        const skills = Array.from(row.querySelectorAll('.tag'))
          .map(el => el.textContent?.trim() ?? '');
        const salary = row.querySelector('.salary')?.textContent?.trim() ?? '';
        let location = row.querySelector('.location')?.textContent?.trim() ?? '';
        if (location === "💰 Upgrade to Premium to see salary") location = '';
        const post_date = row.querySelector('time')?.getAttribute('datetime')
          ?? row.querySelector('.date')?.textContent?.trim()
          ?? '';
        const source ="remoteOk"

        const rawPayload = { position, location, salary, post_link, skills, company, post_date, source };

        return { position, location, salary, post_link, skills, company, rawPayload, post_date, source };
      })
    );

    await browser.close();

    for (const job of jobs) {
      try {
        const exists = await this.positionRepository.findOne({
          where: { post_link: job.post_link },
        });

        if (!exists) {
          const positionEntity = this.positionRepository.create(job);
          await this.positionRepository.save(positionEntity);
        } else {
          console.log(`Vaga já existe no banco: ${job.post_link}`);
        }
      } catch (error) {
        console.error(`Erro ao salvar vaga (${job.post_link}):`, error.message);
      }
    }

    return jobs;
  }

  async scrapeWeWorkRemotely() {
    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.goto('https://weworkremotely.com/remote-jobs', { waitUntil: 'networkidle' });
    await page.waitForSelector('li.new-listing-container');

    const jobs = await page.$$eval('li.new-listing-container', (listings) =>
      listings.map((li) => {
        const title = li.querySelector('h3.new-listing__header__title')?.textContent?.trim() ?? '';
        const company = li.querySelector('p.new-listing__company-name')?.textContent?.trim() ?? '';
        const location = li.querySelector('p.new-listing__company-headquarters')?.textContent?.trim() ?? '';
        const linkEl = li.querySelector('a.listing-link--unlocked');
        const post_link = linkEl ? (linkEl as HTMLAnchorElement).href : '';
        const post_date = li.querySelector('p.new-listing__header__icons__date')?.textContent?.trim() ?? '';
        const source="weWorkRemotely"
        const rawPayload = { title, company, location, post_link, post_date, source };

        return { position: title, company, location, post_link, rawPayload, post_date, source };
      })
    );

    const jobsWithDates = jobs.map(job => ({
      ...job,
      post_date: parseRelativeDate(job.post_date),
    }));

    await browser.close();

    for (const job of jobsWithDates) {
      try {
        const exists = await this.positionRepository.findOne({
          where: { post_link: job.post_link },
        });

        if (!exists) {
          const entity = this.positionRepository.create(job);
          await this.positionRepository.save(entity);
        } else {
          console.log(`Vaga já existe no banco: ${job.post_link}`);
        }
      } catch (error) {
        console.error(`Erro ao salvar vaga (${job.post_link}):`, error.message);
      }
    }

    return jobsWithDates;
  }
}

function parseRelativeDate(text: string): Date {
  const now = new Date();
  const match = text.match(/^(\d+)([smhdwMy])$/); 
    if (!match) {
    const d = new Date(text);
    return isNaN(d.getTime()) ? now : d;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return new Date(now.getTime() - value * 1000);
    case 'm': return new Date(now.getTime() - value * 60 * 1000);
    case 'h': return new Date(now.getTime() - value * 60 * 60 * 1000);
    case 'd': return new Date(now.getTime() - value * 24 * 60 * 60 * 1000);
    case 'w': return new Date(now.getTime() - value * 7 * 24 * 60 * 60 * 1000);
    case 'M': return new Date(now.getTime() - value * 30 * 24 * 60 * 60 * 1000);
    case 'y': return new Date(now.getTime() - value * 365 * 24 * 60 * 60 * 1000);
    default: return now;
  }
}
