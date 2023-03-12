import { prop } from "@typegoose/typegoose";

export class Issue {
  @prop({ required: true })
  id: string;

  @prop({ required: true })
  title: string;

  @prop()
  link: string;

  @prop()
  description: string;

  @prop()
  storyPoints: string;

  @prop()
  voting: boolean;
}
