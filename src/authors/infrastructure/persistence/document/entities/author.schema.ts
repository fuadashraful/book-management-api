import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, now } from 'mongoose';
import { EntityDocumentHelper } from '../../../../../utils/document-entity-helper';

export type AuthorDocument = HydratedDocument<AuthorSchemaClass>;

@Schema({
  timestamps: true, // automatically adds createdAt and updatedAt
  toJSON: {
    virtuals: true,
    getters: true,
  },
})
export class AuthorSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
    required: true,
  })
  firstName: string;

  @Prop({
    type: String,
    required: true,
  })
  lastName: string;

  @Prop({
    type: String,
    default: null,
  })
  bio?: string | null;

  @Prop({
    type: Date,
    default: null,
  })
  birthDate?: Date | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const AuthorSchema = SchemaFactory.createForClass(AuthorSchemaClass);

// Optional: create indexes if needed
// AuthorSchema.index({ firstName: 1, lastName: 1 });
