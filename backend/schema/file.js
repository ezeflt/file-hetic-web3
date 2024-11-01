import {Schema, module} from 'mongoose';
import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: { type: String, required: true },
  size: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  metadata: { type: Object }
});

const File = mongoose.model('files', fileSchema);

export default File;