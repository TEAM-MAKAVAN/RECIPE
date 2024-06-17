import mongoose,{Schema} from "mongoose";

const collectionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  recipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const Collection = mongoose.model('Collection', collectionSchema);
