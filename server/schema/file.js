import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  size: { type: Number, required: true },
  data: { type: Buffer, required: true },
  uploadDate: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tokenShare : { type: String, unique: true },
  expiresAt: { type: Date, expires: '3h' },
});

const File = mongoose.model('files', fileSchema);

export default File;