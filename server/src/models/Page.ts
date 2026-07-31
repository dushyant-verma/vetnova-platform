import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  description: String,
  richText: String,
  image: String,
  gallery: [String],
  background: String,
  ctaText: String,
  ctaLink: String,
  icon: String,
  order: { type: Number, default: 0 },
  visibility: { type: Boolean, default: true },
  theme: String,
  animation: String,
  type: { type: String, required: true }, // e.g., 'Hero', 'Features', 'Stats', 'FAQ'
  metadata: mongoose.Schema.Types.Mixed // JSON field for custom stats, cards, faqs
});

const PageSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  sections: [SectionSchema],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String,
    openGraph: String,
    twitterCard: String,
    canonical: String,
    jsonLd: String,
  },
  published: { type: Boolean, default: true }
}, { timestamps: true });

export const Page = mongoose.model('Page', PageSchema);
