import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Quote, QuoteSchema } from './entities/quote.entity';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { CompanyModule } from '../company/company.module';
import { Invoice, InvoiceSchema } from '../invoices/entities/invoice.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Quote.name,
        useFactory: (connection: Connection) => {
          const schema = QuoteSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, { inc_field: 'quoteId', start_seq: 1 });
          return schema;
        },
        inject: [getConnectionToken()],
      },
      {
        name: Invoice.name,
        useFactory: (connection: Connection) => {
          const schema = InvoiceSchema;
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
    CompanyModule,
  ],
  controllers: [QuotesController],
  providers: [QuotesService],
})
export class QuotesModule {}
