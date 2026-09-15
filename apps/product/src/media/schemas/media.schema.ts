import { Prop, Schema } from '@nestjs/mongoose';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
}

@Schema({ collection: 'media', timestamps: true })
export class Media {
  @Prop({
    type: String,
    enum: MediaType,
    default: MediaType.IMAGE,
  })
  type: MediaType;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String })
  alt?: string;

  @Prop({ type: Number })
  width?: number;

  @Prop({ type: Number })
  height?: number;

  @Prop({ type: Number })
  size?: number;

  @Prop({
    type: String,
    enum: ['local', 's3', 'cloudinary'],
    default: 'local',
  })
  mimeType?: String;
}
