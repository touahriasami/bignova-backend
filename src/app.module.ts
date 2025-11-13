import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from './modules/clients/clients.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { CompanyModule } from './modules/company/company.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URI as string),
    ClientsModule,
    InvoicesModule,
    QuotesModule,
    CompanyModule,
    AuthModule,
  ],
})
export class AppModule {}
