import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now, Types } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';
import { AuthorSchemaClass } from 'src/authors/infrastructure/persistence/document/entities/author.schema';

export type BookDocument = HydratedDocument<BookSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class BookSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    required: true,
    trim: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  isbn: string;

  @Prop({
    type: Date,
    default: null,
  })
  publishedDate?: Date | null;

  @Prop({
    type: String,
    default: null,
  })
  genre?: string | null;

  @Prop({
    type: Types.ObjectId,
    ref: AuthorSchemaClass.name,
    required: true,
  })
  author: Types.ObjectId;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const BookSchema = SchemaFactory.createForClass(BookSchemaClass);

// Optional index for performance
// BookSchema.index({ title: 1, isbn: 1 });
