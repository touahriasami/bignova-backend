import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/modules/auth/entities/user.entity';

export type ClientDocument = HydratedDocument<Client>;

@Schema({ timestamps: true })
export class Client {
  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  userId: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
