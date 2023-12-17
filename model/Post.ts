import mongoose, { Schema, Document } from "mongoose";

export interface Post extends Document {
  title: string;
  description: string;
  organizationId: string;
  userId: string;
  user?: {
    firstName: string;
    lastName: string;
  };
  createdAt: Date;
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
  organizationId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const PostModel =
  (mongoose.models.Post as mongoose.Model<Post>) ||
  mongoose.model<Post>("Post", PostSchema);

export default PostModel;
