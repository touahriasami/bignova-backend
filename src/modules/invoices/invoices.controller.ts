import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  findAll(@Req() req) {
    return this.invoicesService.findAll(req.user._id);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id') id: Types.ObjectId) {
    return this.invoicesService.findOne(req.user._id, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: Types.ObjectId) {
    return this.invoicesService.remove(id);
  }

  @Patch(':id/mark-as-paid')
  markAsPaid(
    @Req() req,
    @Param('id') id: Types.ObjectId,
    @Body('paidDate') paidDate: string,
  ) {
    return this.invoicesService.markAsPaid(req.user._id, id, paidDate);
  }
}
