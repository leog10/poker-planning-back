import { prop } from '@typegoose/typegoose';

export class User {
  @prop({ required: true })
  clientId: string;

  @prop()
  username: string;

  @prop({ default: '' })
  card: string;
}
