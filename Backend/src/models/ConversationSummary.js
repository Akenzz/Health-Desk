const mongoose = require('mongoose');

const conversationSummarySchema = new mongoose.Schema(
  {
    context: { type: String, default: '' },
    patient_phonenumber: { type: String, required: true, index: true },
    doctor_email_id: { type: String, required: true, index: true },
    summary_data: {
      symptoms: { type: [String], default: [] },
      diagnosis: { type: [String], default: [] },
      prescription: { type: [String], default: [] },
      vitals: { type: [String], default: [] },
      lifestyle_advice: { type: [String], default: [] },
      tests_recommended: { type: [String], default: [] },
      follow_up_plan: { type: [String], default: [] },
    },
    datetime: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

conversationSummarySchema.index({ patient_phonenumber: 1, datetime: -1 });
conversationSummarySchema.index({ doctor_email_id: 1, datetime: -1 });

module.exports = mongoose.model('ConversationSummary', conversationSummarySchema);
