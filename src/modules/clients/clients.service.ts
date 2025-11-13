import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Client, ClientDocument } from './entities/client.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class ClientsService {
  constructor(
    @InjectModel(Client.name)
    private readonly clientModel: Model<ClientDocument>,
  ) {}

  async create(userId: Types.ObjectId, createClientDto: CreateClientDto) {
    const client = await this.clientModel.insertOne({
      ...createClientDto,
      userId,
    });
    return client;
  }

  findAll(userId: Types.ObjectId) {
    return this.clientModel
      .find({
        userId,
      })
      .exec();
  }

  findOne(userId: Types.ObjectId, id: Types.ObjectId) {
    return this.clientModel
      .findOne({
        id,
        userId,
      })
      .exec();
  }

  update(
    userId: Types.ObjectId,
    id: Types.ObjectId,
    updateClientDto: UpdateClientDto,
  ) {
    return this.clientModel.findByIdAndUpdate(id, updateClientDto, {
      new: true,
    });
  }

  async remove(userId: Types.ObjectId, id: Types.ObjectId) {
    const client = await this.clientModel.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return { message: 'Client deleted successfully' };
  }
}
