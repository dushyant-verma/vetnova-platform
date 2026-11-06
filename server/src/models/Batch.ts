import mongoose, { Document } from 'mongoose';

export interface IBatch extends Document {
  batchTitle?: string;
  programName: string;
  programSlug?: string;
  programId?: mongoose.Types.ObjectId;
  facultyName: string;
  facultyId?: mongoose.Types.ObjectId;
  startDate: Date;
  endDate?: Date;
  duration: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  seatStatus?: string;
  location?: string;
  maxSeats?: number;
  notes?: string;
  displayOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const batchSchema = new mongoose.Schema({
  batchTitle: { type: String, trim: true },
  programName: { type: String, required: true, trim: true },
  programSlug: { type: String, trim: true },
  programId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Program',
    set: (v: any) => (v === '' || !v ? undefined : v)
  },
  facultyName: { type: String, required: true, trim: true },
  facultyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Expert',
    set: (v: any) => (v === '' || !v ? undefined : v)
  },
  startDate: { type: Date, required: true },
  endDate: { 
    type: Date,
    set: (v: any) => (v === '' || !v ? undefined : v),
    validate: {
      validator: function(this: any, val: Date) {
        if (!val) return true;
        let start = this?.startDate;
        if (!start && typeof this?.getUpdate === 'function') {
          const update = this.getUpdate();
          start = update?.startDate || update?.$set?.startDate;
        }
        if (start) {
          const s = new Date(start).getTime();
          const e = new Date(val).getTime();
          if (!isNaN(s) && !isNaN(e) && s > e) {
            return false;
          }
        }
        return true;
      },
      message: 'Batch end date cannot be earlier than start date'
    }
  },
  duration: { type: String, default: '3 Days', trim: true },
  status: { 
    type: String, 
    enum: ['Upcoming', 'Ongoing', 'Completed'], 
    default: 'Upcoming',
    index: true 
  },
  seatStatus: { type: String, default: 'Admissions Open', trim: true },
  location: { type: String, default: 'Pune Campus', trim: true },
  maxSeats: { type: Number, default: 12 },
  notes: { type: String, trim: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

batchSchema.pre('validate', function(this: any) {
  if (this.startDate && this.endDate) {
    const start = new Date(this.startDate).getTime();
    const end = new Date(this.endDate).getTime();
    if (!isNaN(start) && !isNaN(end) && start > end) {
      this.invalidate('endDate', 'Batch end date cannot be earlier than start date');
    }
  }
});

export const Batch = mongoose.model<IBatch>('Batch', batchSchema);

