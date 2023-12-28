import mongoose, { Document, Schema } from "mongoose";

export interface UserOrganizationCount extends Document {
  userId: string;
  organizationIds: string[];
}

const UserOrganizationCountSchema: Schema<UserOrganizationCount> =
  new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    organizationIds: {
      type: [String],
      required: true,
      default: [],
    },
  });

const UserOrganizationCountModel =
  (mongoose.models
    .UserOrganizationCount as mongoose.Model<UserOrganizationCount>) ||
  mongoose.model<UserOrganizationCount>(
    "UserOrganizationCount",
    UserOrganizationCountSchema
  );

export default UserOrganizationCountModel;
