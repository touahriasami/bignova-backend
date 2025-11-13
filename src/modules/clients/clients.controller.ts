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
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Types } from 'mongoose';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { cpSync } from 'fs';

@Controller('clients')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Request() req, @Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(req.user._id, createClientDto);
  }

  @Get()
  findAll(@Request() req) {
    return this.clientsService.findAll(req.user._id);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: Types.ObjectId) {
    return this.clientsService.findOne(req.user._id, id);
  }

  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateClientDto })
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: Types.ObjectId,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return this.clientsService.update(req.user._id, id, updateClientDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: Types.ObjectId) {
    return this.clientsService.remove(req.user._id, id);
  }
}
