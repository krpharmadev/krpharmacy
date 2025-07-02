import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'หมวดหมู่สินค้า',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'ชื่อหมวดหมู่',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'คำอธิบาย',
      type: 'text',
    }),
    defineField({
      name: 'parentCategory',
      title: 'หมวดหมู่หลัก',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'description' },
  },
})
