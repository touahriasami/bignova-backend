import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './entities/invoice.entity';
import { Connection } from 'mongoose';
import * as AutoIncrementFactory from 'mongoose-sequence';
import { Item } from '../quotes/entities/quote.entity';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: Invoice.name,
        useFactory: (connection: Connection) => {
          const schema = InvoiceSchema;
          const AutoIncrement = AutoIncrementFactory(connection);
          schema.plugin(AutoIncrement, {
            inc_field: 'invoiceId',
            start_seq: 1,
          });
          return schema;
        },
        inject: [getConnectionToken()],
      },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
})
export class InvoicesModule {}
