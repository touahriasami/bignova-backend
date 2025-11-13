import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Item, Quote, QuoteDocument } from './entities/quote.entity';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CompanyService } from '../company/company.service';
import { Invoice, InvoiceDocument } from '../invoices/entities/invoice.entity';

@Injectable()
export class QuotesService {
  constructor(
    @InjectModel(Quote.name)
    private readonly quoteModel: Model<QuoteDocument>,

    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,

    private readonly companyService: CompanyService,
  ) {}

  async create(userId: Types.ObjectId, createQuoteDto: CreateQuoteDto) {
    const company = await this.companyService.findOne(userId);

    // Instantiate to get _id for items' quoteId
    const quote = new this.quoteModel({
      companyId: company._id,
      clientId: new Types.ObjectId(createQuoteDto.clientId),
      currency: company.currency,
      ...this.calculateTotals(createQuoteDto.items),
      items: (createQuoteDto.items || []).map((item) => ({
        ...item,
      })),
    });

    // Attach items with quoteId and compute totals
    // quote.items = (createQuoteDto.items || []).map((item) => ({
    //   ...item,
    // }));

    return await quote.save();
  }

  async findAll(userId: Types.ObjectId) {
    const company = await this.companyService.findOne(userId);

    return this.quoteModel
      .find({
        companyId: company._id,
      })
      .populate('clientId')
      .populate('companyId')
      .sort({ createdAt: -1 });
  }

  async findOne(userId: Types.ObjectId, id: Types.ObjectId) {
    const company = await this.companyService.findOne(userId);

    return this.quoteModel
      .findOne({
        _id: id,
        companyId: company._id,
      })
      .populate('clientId')
      .populate('companyId');
  }

  update(
    userId: Types.ObjectId,
    id: Types.ObjectId,
    updateQuoteDto: UpdateQuoteDto,
  ) {
    return this.quoteModel.findByIdAndUpdate(id, updateQuoteDto, {
      new: true,
    });
  }

  async remove(userId: Types.ObjectId, id: Types.ObjectId) {
    // const quote = await this.quoteModel.findByIdAndDelete(id);

    // if (!quote) {
    //   throw new NotFoundException(`Quote not found`);
    // }

    // return { message: 'Quote deleted successfully' };

    const existing = await this.quoteModel.findById(id);
    if (!existing) {
      throw new NotFoundException('Quote not found');
    }

    await this.quoteModel.deleteOne({ _id: id });

    return { message: 'Quote deleted successfully' };
  }

  private calculateTotals(lineItems: Item[]) {
    let subtotalHT = 0;
    let tvaTotal = 0;

    lineItems.forEach((item) => {
      const itemTotal = item.quantity * item.unitPriceHT;
      subtotalHT += itemTotal;
      tvaTotal += (itemTotal * item.tvaRate) / 100;
    });

    return {
      subTotalHT: Math.round(subtotalHT * 100) / 100,
      tvaTotal: Math.round(tvaTotal * 100) / 100,
      totalTTC: Math.round((subtotalHT + tvaTotal) * 100) / 100,
    };
  }

  async convertToInvoice(userId: Types.ObjectId, id: Types.ObjectId) {
    const company = await this.companyService.findOne(userId);

    const quote = await this.quoteModel.findOne({
      _id: id,
      companyId: company._id,
    });

    if (!quote) {
      throw new NotFoundException(`Quote not found`);
    }

    const invoice = new this.invoiceModel({
      userId: userId,
      quoteId: quote._id,
      clientId: quote.clientId,
      companyId: quote.companyId,
      items: quote.items,
      tvaTotal: quote.tvaTotal,
      subTotalHT: quote.subTotalHT,
      totalTTC: quote.totalTTC,
      currency: quote.currency ?? company.currency,
    });

    return await invoice.save();
  }
}
