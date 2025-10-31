import { Controller, Get} from '@nestjs/common';

@Controller('scraping')
export class ScrapingController {
    
        @Get('')
        getPublicFeature() {
            return 'This is a public feature';
        }
}
