import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CurrencyEnum } from '../enums/currency.enum';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/modules/auth/entities/user.entity';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({ timestamps: true })
export class Company {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  userId: Types.ObjectId;

  @Prop({
    required: false,
  })
  logo: string;

  @Prop()
  name: string;

  @Prop({
    required: false,
  })
  raisonSociale: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop({
    required: false,
  })
  iban: string;

  @Prop({
    enum: CurrencyEnum,
    default: CurrencyEnum.EUR,
  })
  currency: CurrencyEnum;
}

export const CompanySchema = SchemaFactory.createForClass(Company);
