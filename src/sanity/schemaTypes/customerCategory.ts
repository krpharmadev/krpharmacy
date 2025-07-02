import { defineField, defineType } from 'sanity'

export const customerCategory = defineType({
    name: 'customerCategory',
    title: 'หมวดหมู่ลูกค้า',
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
        name: 'isActive',
        title: 'สถานะใช้งาน',
        type: 'boolean',
        initialValue: true,
      }),
    ],
    preview: {
      select: { title: 'name', subtitle: 'description' },
    },
  })
  