import mongoose, { Document, Schema } from 'mongoose';

export type Institution = 'GTBank' | 'Access Bank' | 'Kuda' | 'Opay' | 'Moniepoint';

export interface ILinkedAccount extends Document {
  userId: mongoose.Types.ObjectId;
  institution: Institution;
  maskedAccountNumber: string;
  accessToken: string;
  tokenExpiresAt: Date;
  balance: number;
  currency: string;
  accountType: string; 
  isActive: boolean;
  linkedAt: Date;
}

const LinkedAccountSchema = new Schema<ILinkedAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    institution: {
      type: String,
      required: true,
      enum: ['GTBank', 'Access Bank', 'Kuda', 'Opay', 'Moniepoint'],
    },
    maskedAccountNumber: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
      select: false,
    },
    tokenExpiresAt: {
      type: Date,
      required: true,
    },
    balance: {
      type: Number,
      default: 0, // Stored in kobo
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    accountType: {
      type: String,
      enum: ['current', 'savings', 'wallet', 'business'],
      default: 'current',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    linkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Compound indexes for fast user-scoped queries
LinkedAccountSchema.index({ userId: 1, institution: 1 });
LinkedAccountSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model<ILinkedAccount>('LinkedAccount', LinkedAccountSchema);
