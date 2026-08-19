import mongoose from 'mongoose';

function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  content: { type: String, required: true },
  excerpt: { type: String },
  author: { type: String, required: true },
  authorRole: { type: String, default: 'Veterinary Specialist' },
  authorImage: { type: String },
  category: { type: String, default: 'General' },
  categories: [{ type: String }],
  relatedPrograms: [{ type: String }],
  tags: [{ type: String }],
  image: { type: String },
  status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
  isFeatured: { type: Boolean, default: false },
  readTime: { type: String, default: '5 Min Read' },
  seoTitle: { type: String },
  seoDescription: { type: String },
  ogImage: { type: String },
}, { timestamps: true });

blogSchema.pre('validate', function(this: any, next: any) {
  if (this.slug) {
    this.slug = generateSlug(this.slug);
  } else if (this.title) {
    this.slug = generateSlug(this.title);
  }

  // Ensure categories array and legacy category field remain synced
  if (Array.isArray(this.categories) && this.categories.length > 0) {
    this.category = this.categories[0];
  } else if (this.category) {
    this.categories = [this.category];
  }

  if (typeof next === 'function') {
    next();
  }
});

export const Blog = mongoose.model('Blog', blogSchema);

