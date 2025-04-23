import mongoose, { Schema } from 'mongoose';
import { 
  User, Issue, Comment, Attachment, Notification, 
  InsertUser, InsertIssue, InsertComment, InsertAttachment, InsertNotification,
  Priority, Status, Category
} from '@shared/schema';

// User Schema
const userSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Issue Schema
const issueSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: { 
    type: String, 
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  category: { 
    type: String, 
    enum: ['bug', 'feature', 'documentation', 'security', 'performance'],
    default: 'bug'
  },
  assigneeId: { type: Number, default: null },
  reporterId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Comment Schema
const commentSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  content: { type: String, required: true },
  userId: { type: Number, required: true },
  issueId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Attachment Schema
const attachmentSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  uploaderId: { type: Number, required: true },
  issueId: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Notification Schema
const notificationSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  userId: { type: Number, required: true },
  issueId: { type: Number, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Create models
export const UserModel = mongoose.model<User>('User', userSchema);
export const IssueModel = mongoose.model<Issue>('Issue', issueSchema);
export const CommentModel = mongoose.model<Comment>('Comment', commentSchema);
export const AttachmentModel = mongoose.model<Attachment>('Attachment', attachmentSchema);
export const NotificationModel = mongoose.model<Notification>('Notification', notificationSchema);

// Create counter schema for auto-incrementing IDs
const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

export const CounterModel = mongoose.model('Counter', counterSchema);

// Helper function to get next sequence value
export async function getNextSequence(name: string): Promise<number> {
  const counter = await CounterModel.findByIdAndUpdate(
    { _id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}