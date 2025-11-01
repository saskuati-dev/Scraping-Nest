// src/items/dto/create-item.dto.ts
import { IsString, IsOptional, IsArray, IsDateString } from 'class-validator';

export class CreateItemDto {
  @IsString() position: string;
  @IsString() company: string;
  @IsString() @IsOptional() location?: string;
  @IsString() @IsOptional() salary?: string;
  @IsString() post_link: string;
  @IsArray() @IsOptional() skills?: string[];
  @IsDateString() @IsOptional() post_date?: string;
  @IsString() @IsOptional() source?: string;
}