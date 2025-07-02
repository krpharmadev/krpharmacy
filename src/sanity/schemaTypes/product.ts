import { defineField, defineType } from 'sanity'

export const product = defineType({
    name: 'product',
    title: 'สินค้า',
    type: 'document',
    fields: [
      defineField({
        name: 'sku',
        title: 'รหัสสินค้า (SKU)',
        type: 'string',
        validation: (Rule) =>
          Rule.required()
            .regex(/^KR[0-9]{6}$/)
            .error('รูปแบบต้องเป็น KR ตามด้วย 6 ตัวเลข เช่น KR123456'),
      }),
      defineField({
        name: 'barcode',
        title: 'บาร์โค้ด',
        type: 'string',
        validation: (Rule) =>
          Rule.regex(/^[0-9]{8,13}$/).error('ต้องเป็นตัวเลข 8-13 หลัก'),
      }),
      defineField({
        name: 'name',
        title: 'ชื่อสินค้า',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'description',
        title: 'คำอธิบายสินค้า',
        type: 'text',
      }),
      defineField({
        name: 'category',
        title: 'หมวดหมู่สินค้า',
        type: 'reference',
        to: [{ type: 'category' }],
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'drugDetails',
        title: 'ข้อมูลยา (ถ้ามี)',
        type: 'reference',
        to: [{ type: 'drugDetails' }],
      }),
      defineField({
        name: 'price',
        title: 'ราคาขาย (บาท)',
        type: 'number',
        validation: (Rule) => Rule.required().min(0),
      }),
      defineField({
        name: 'costPrice',
        title: 'ราคาทุน (บาท)',
        type: 'number',
        validation: (Rule) => Rule.min(0),
      }),
      defineField({
        name: 'stock',
        title: 'จำนวนในสต็อก',
        type: 'number',
        readOnly: true,
        validation: (Rule) => Rule.min(0),
      }),
      defineField({
        name: 'images',
        title: 'รูปภาพสินค้า',
        type: 'array',
        of: [{ type: 'image', options: { hotspot: true } }],
      }),
      defineField({
        name: 'status',
        title: 'สถานะสินค้า',
        type: 'string',
        options: {
          list: [
            { title: 'เปิดขาย', value: 'active' },
            { title: 'ปิดขาย', value: 'inactive' },
            { title: 'เลิกผลิต', value: 'discontinued' },
            { title: 'สินค้าหมด', value: 'out_of_stock' },
          ],
        },
        initialValue: 'active',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'slug',
        title: 'URL Slug',
        type: 'slug',
        options: { source: 'name', maxLength: 96 },
        validation: (Rule) => Rule.required(),
      }),
    ],
    preview: {
      select: { title: 'name', subtitle: 'sku', media: 'images.0' },
    },
  })
  