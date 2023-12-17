import mongoose, { Schema, Document } from "mongoose";

interface Post extends Document {
  title: string;
  description: string;
}

const PostSchema: Schema<Post> = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title"],
    unique: true,
    trim: true,
    maxlength: [40, "Title cannot be more than 40 characters"],
  },
  description: {
    type: String,
    required: true,
    maxlength: [200, "Description cannot be more than 200 characters"],
  },
});

const Post =
  (mongoose.models.Post as mongoose.Model<Post>) ||
  mongoose.model<Post>("Post", PostSchema);

export default Post;
