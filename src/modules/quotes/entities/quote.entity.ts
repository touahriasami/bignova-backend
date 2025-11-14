import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { QuotesStatusEnum } from '../enums/quotes.enum';
import { CurrencyEnum } from 'src/modules/company/enums/currency.enum';
import { Invoice } from 'src/modules/invoices/entities/invoice.entity';

export type QuoteDocument = HydratedDocument<Quote>;

@Schema({ timestamps: true })
export class Quote {
  @Prop({ type: Number, unique: true })
  quoteId: number;

  @Prop({
    type: Types.ObjectId,
    ref: Company.name,
  })
  companyId: Types.ObjectId;

  @Prop({
    ref: Client.name,
  })
  clientId: Types.ObjectId;

  @Prop({
    type: [Object],
    default: [],
  })
  items: Item[];

  @Prop({
    default: 0,
  })
  tvaTotal: number;

  @Prop({
    default: 0,
  })
  subTotalHT: number;

  @Prop({
    default: 0,
  })
  totalTTC: number;

  @Prop()
  quoteNumber: string; // Numérotation : Q-YYYY-0001 (par entreprise & par année)

  @Prop()
  currency: CurrencyEnum;

  @Prop({
    enum: QuotesStatusEnum,
    default: QuotesStatusEnum.DRAFT,
  })
  status: QuotesStatusEnum;
}

export class Item {
  @Prop()
  description: string;

  @Prop()
  quantity: number;

  @Prop()
  unitPriceHT: number;

  @Prop()
  tvaRate: number;

  @Prop({
    type: Types.ObjectId,
    ref: Quote.name,
  })
  quoteId: Types.ObjectId;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);

QuoteSchema.post<QuoteDocument>('save', async function (doc, next) {
  try {
    const createdAt = (doc as any).createdAt
      ? new Date((doc as any).createdAt)
      : new Date();
    const year = createdAt.getFullYear();

    const QuoteModel = doc.constructor as any;

    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);

    const countForCompanyYear = await QuoteModel.countDocuments({
      companyId: doc.companyId,
      createdAt: { $gte: startOfYear, $lt: startOfNextYear },
    });

    const sequence = String(countForCompanyYear).padStart(4, '0');
    const formattedNumber = `Q-${year}-${sequence}`;

    await QuoteModel.updateOne(
      { _id: doc._id },
      { $set: { quoteNumber: formattedNumber } },
    );

    next();
  } catch (e) {
    next(e);
  }
});
