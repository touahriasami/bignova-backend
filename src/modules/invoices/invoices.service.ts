import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, InvoiceDocument } from './entities/invoice.entity';
import { Model, Types } from 'mongoose';
import { InvoiceStatusEnum } from './enums/invoice.enum';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name)
    private readonly invoiceModel: Model<InvoiceDocument>,
  ) {}
  create(createInvoiceDto: CreateInvoiceDto) {
    return 'This action adds a new invoice';
  }

  findAll(userId: Types.ObjectId) {
    return this.invoiceModel
      .find({ userId })
      .populate('clientId')
      .populate('companyId')
      .sort({ createdAt: -1 });
  }

  findOne(id: number) {
    return `This action returns a #${id} invoice`;
  }

  update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    return `This action updates a #${id} invoice`;
  }

  async remove(id: Types.ObjectId) {
    const existing = await this.invoiceModel.findById(id);
    if (!existing) {
      throw new NotFoundException('Invoice not found');
    }

    await this.invoiceModel.deleteOne({ _id: id });

    return { message: 'Invoice deleted successfully' };
  }

  async markAsPaid(
    userId: Types.ObjectId,
    id: Types.ObjectId,
    paidDate: string,
  ) {
    return this.invoiceModel.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        status: InvoiceStatusEnum.PAID,
        paidDate: paidDate,
      },
    );
  }
}
