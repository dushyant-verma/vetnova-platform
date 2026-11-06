"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Enquiry = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enquirySchema = new mongoose_1.Schema({
    leadId: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    persona: {
        type: String,
        enum: ['student', 'practitioner', 'nurse', 'partner', 'general'],
        default: 'general',
        index: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    firstName: {
        type: String,
        default: '',
        trim: true
    },
    lastName: {
        type: String,
        default: '',
        trim: true
    },
    audience: {
        type: String,
        default: '',
        trim: true,
        index: true
    },
    programName: {
        type: String,
        default: '',
        trim: true
    },
    designation: {
        type: String,
        default: '',
        trim: true
    },
    organization: {
        type: String,
        default: '',
        trim: true
    },
    countryCode: {
        type: String,
        default: '+91',
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    email: {
        type: String,
        default: '',
        trim: true,
        lowercase: true
    },
    profile: {
        type: String,
        default: '',
        trim: true
    },
    course: {
        type: String,
        default: '',
        trim: true
    },
    message: {
        type: String,
        default: '',
        trim: true
    },
    formData: {
        type: mongoose_1.Schema.Types.Mixed,
        default: {}
    },
    notes: [
        {
            text: { type: String, required: true },
            author: { type: String, default: 'Admin' },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    source: {
        type: String,
        default: 'website',
        trim: true
    },
    sourcePage: {
        type: String,
        default: '',
        trim: true
    },
    formId: {
        type: String,
        default: '',
        trim: true
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Follow-up Required', 'Qualified', 'Closed', 'Converted'],
        default: 'New',
        index: true
    },
    notificationStatus: {
        type: String,
        enum: ['Sent', 'Failed', 'NotConfigured'],
        default: 'NotConfigured'
    }
}, {
    timestamps: true
});
enquirySchema.index({ createdAt: -1 });
enquirySchema.index({ email: 1 });
enquirySchema.index({ phone: 1 });
enquirySchema.index({ organization: 1 });
exports.Enquiry = mongoose_1.default.model('Enquiry', enquirySchema);
//# sourceMappingURL=Enquiry.js.map