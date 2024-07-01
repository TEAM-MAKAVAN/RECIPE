import mongoose,{Schema} from "mongoose";

const likeSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  recipe: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true }
}, { timestamps: true });


export const Like = mongoose.model('Like', likeSchema);
