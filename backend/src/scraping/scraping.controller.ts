import { Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {ScrapingService} from './scraping.service'
import { Roles } from 'src/auth/roles.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@Controller('scrap')
export class ScrapingController {
        constructor(private readonly scrapingService: ScrapingService) {}

    
        @Post()
        @Roles('admin')
        @UseGuards(JwtAuthGuard)
        async scrape(@Body('site') site: string) {
            switch (site?.toLowerCase()) {
            case 'remoteok':
                return this.scrapingService.scrapeRemoteOK();
            case 'weworkremotely':
                return this.scrapingService.scrapeWeWorkRemotely();
            default:
                return { error: 'Site inválido. Use "remoteok" ou "weworkremotely".' };
            }
        }

        
}
