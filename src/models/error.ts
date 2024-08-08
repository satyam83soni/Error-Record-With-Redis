import mongoose, { Document, Schema } from "mongoose";

interface IErrorLog extends Document {
  name: string;
  message: string;
  code: string | null;
  errno: number | null;
  path: string | null;
  syscall: string | null;
  stack: string;
  resolved: boolean;
  timestamp: Date;
  platform: string;
}

const errorLogSchema: Schema = new Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  code: { type: String, default: null },
  errno: { type: Number, default: null },
  path: { type: String, default: null },
  syscall: { type: String, default: null },
  stack: { type: String, required: true },
  resolved: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
  platform: { type: String, default: "Grovyo" },
});

const ErrorLog = mongoose.model<IErrorLog>("ErrorLog", errorLogSchema);

export {ErrorLog , IErrorLog} ;
