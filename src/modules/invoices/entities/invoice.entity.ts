import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Item, Quote } from 'src/modules/quotes/entities/quote.entity';
import { InvoiceStatusEnum } from '../enums/invoice.enum';
import { CurrencyEnum } from 'src/modules/company/enums/currency.enum';
import { Client } from 'src/modules/clients/entities/client.entity';
import { User } from 'src/modules/auth/entities/user.entity';
import { Company } from 'src/modules/company/entities/company.entity';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ timestamps: true })
export class Invoice {
  @Prop({ type: Number, unique: true })
  invoiceId: number;

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  userId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Quote.name,
  })
  quoteId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: Company.name,
  })
  companyId: Types.ObjectId;

  @Prop({
    type: [Object],
    default: [],
  })
  items: Item[];

  @Prop()
  tvaTotal: number;

  @Prop()
  subTotalHT: number;

  @Prop()
  totalTTC: number;

  @Prop()
  invoiceNumber: string; // Numérotation : F-YYYY-0001 (par entreprise & par année)

  @Prop()
  paidDate: Date;

  @Prop()
  currency: CurrencyEnum;

  @Prop({
    enum: InvoiceStatusEnum,
    default: InvoiceStatusEnum.ISSUED,
  })
  status: InvoiceStatusEnum;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

InvoiceSchema.post<InvoiceDocument>('save', async function (doc, next) {
  try {
    let date = new Date();

    doc.invoiceNumber = `F-${date.getFullYear()}-${doc.invoiceId}`;

    doc.save();
    next();
  } catch (e) {
    next(e);
  }
});
