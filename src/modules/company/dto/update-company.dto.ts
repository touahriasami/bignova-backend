import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CurrencyEnum } from '../enums/currency.enum';

export class UpdateCompany {
  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  raisonSociale?: string;

  @IsString()
  name: string;

  @IsString()
  email?: string;

  @IsString()
  phone?: string;

  @IsString()
  @IsOptional()
  iban?: string;

  @IsOptional()
  @IsEnum(CurrencyEnum)
  currency?: CurrencyEnum;
}
