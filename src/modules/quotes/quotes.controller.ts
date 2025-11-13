import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

@Controller('quotes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  create(@Request() req, @Body() createQuoteDto: CreateQuoteDto) {
    return this.quotesService.create(req.user._id, createQuoteDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.quotesService.findAll(req.user._id);
  }

  @ApiParam({ name: 'id', type: String })
  @Get(':id')
  findOne(@Request() req, @Param('id') id: Types.ObjectId) {
    return this.quotesService.findOne(req.user._id, id);
  }

  @ApiParam({ name: 'id', type: String })
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: Types.ObjectId,
    @Body() updateQuoteDto: UpdateQuoteDto,
  ) {
    return this.quotesService.update(req.user._id, id, updateQuoteDto);
  }

  @ApiParam({ name: 'id', type: String })
  @Delete(':id')
  remove(@Request() req, @Param('id') id: Types.ObjectId) {
    return this.quotesService.remove(req.user._id, id);
  }

  @ApiParam({ name: 'id', type: String })
  @Post(':id/convert-to-invoice')
  convertToInvoice(@Request() req, @Param('id') id: Types.ObjectId) {
    return this.quotesService.convertToInvoice(req.user._id, id);
  }
}
