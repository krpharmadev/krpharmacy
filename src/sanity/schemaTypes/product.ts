import { defineType, defineField } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name (Thai)',
      type: 'string',
      description: 'Name of the product in Thai',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nameEn',
      title: 'Product Name (English)',
      type: 'string',
      description: 'Name of the product in English',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the product name (auto-generated)',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input: string) => 
          input.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .slice(0, 96)
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Stock Keeping Unit - unique product identifier used to sync with external database',
      validation: (Rule) => Rule.required().custom((sku: string | undefined) => {
        if (!sku || !/^[A-Z0-9\-_]{3,20}$/.test(sku)) {
          return 'SKU must be 3-20 characters and contain only uppercase letters, numbers, hyphens, and underscores';
        }
        return true;
      }),
    }),
    defineField({
      name: 'barcode',
      title: 'Barcode/EAN',
      type: 'string',
      description: 'Product barcode or EAN',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Full description of the product',
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Current selling price',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Compare at Price',
      type: 'number',
      description: 'Original price before discount (if applicable)',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'category',
      title: 'Product Category',
      type: 'reference',
      description: 'Main product category',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'reference',
      description: 'Product subcategory',
      to: [{ type: 'subcategory' }],
    }),
    defineField({
      name: 'atcClassification',
      title: 'ATC Classification',
      type: 'reference',
      description: 'Anatomical Therapeutic Chemical Classification',
      to: [{ type: 'atcClassification' }],
    }),
    defineField({
      name: 'genericName',
      title: 'Generic Name',
      type: 'string',
      description: 'Generic name of the medicine',
    }),
    defineField({
      name: 'activeIngredients',
      title: 'Active Ingredients',
      type: 'array',
      description: 'Active pharmaceutical ingredients',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'ingredient',
              title: 'Ingredient Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'strength',
              title: 'Strength',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'unit',
              title: 'Unit',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'ingredient',
              subtitle: 'strength',
            },
            prepare({ title, subtitle }: any) {
              return {
                title,
                subtitle: subtitle ? `${subtitle}` : '',
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'dosageForm',
      title: 'Dosage Form',
      type: 'string',
      description: 'Form of the medication',
      options: {
        list: [
          {title: 'Tablet', value: 'tablet'},
          {title: 'Capsule', value: 'capsule'},
          {title: 'Syrup', value: 'syrup'},
          {title: 'Injection', value: 'injection'},
          {title: 'Cream', value: 'cream'},
          {title: 'Ointment', value: 'ointment'},
          {title: 'Drops', value: 'drops'},
          {title: 'Spray', value: 'spray'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'manufacturer',
      title: 'Manufacturer',
      type: 'string',
      description: 'Company that produces the product',
    }),
    defineField({
      name: 'country',
      title: 'Country of Origin',
      type: 'string',
      description: 'Country where the product is manufactured',
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      description: 'Images of the product (first image will be used as the main image)',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Describe the image for accessibility and SEO',
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error('At least one product image is required'),
    }),
    defineField({
      name: 'variants',
      title: 'Product Variants',
      type: 'array',
      description: 'Different variations of the product (size, packaging, etc.)',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'variantName',
              title: 'Variant Name',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'sku',
              title: 'Variant SKU',
              type: 'string',
              description: 'Unique SKU for this variant - used to sync with external database',
              validation: (Rule) => Rule.required().custom((sku: string | undefined) => {
                if (!sku || !/^[A-Z0-9\-_]{3,20}$/.test(sku)) {
                  return 'SKU must be 3-20 characters and contain only uppercase letters, numbers, hyphens, and underscores';
                }
                return true;
              }),
            }),
            defineField({
              name: 'size',
              title: 'Size/Volume',
              type: 'string',
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity per Package',
              type: 'number',
            }),
            defineField({
              name: 'unit',
              title: 'Unit',
              type: 'string',
            }),
            defineField({
              name: 'price',
              title: 'Price (THB)',
              type: 'number',
              validation: (Rule) => Rule.required().min(0),
            }),
            defineField({
              name: 'wholesalePrice',
              title: 'Wholesale Price (THB)',
              type: 'number',
            }),
            defineField({
              name: 'isDefault',
              title: 'Default Variant',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'variantName',
              subtitle: 'price',
            },
            prepare({ title, subtitle }: any) {
              return {
                title,
                subtitle: subtitle ? `฿${subtitle}` : '',
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'indications',
      title: 'Indications',
      type: 'text',
      description: 'Medical conditions this product is used to treat',
    }),
    defineField({
      name: 'contraindications',
      title: 'Contraindications',
      type: 'text',
      description: 'Situations where this product should not be used',
    }),
    defineField({
      name: 'dosageInstructions',
      title: 'Dosage Instructions',
      type: 'text',
      description: 'How to use this product',
    }),
    defineField({
      name: 'sideEffects',
      title: 'Side Effects',
      type: 'text',
      description: 'Potential side effects of this product',
    }),
    defineField({
      name: 'warnings',
      title: 'Warnings',
      type: 'text',
      description: 'Important warnings about this product',
    }),
    defineField({
      name: 'storage',
      title: 'Storage Instructions',
      type: 'string',
      description: 'How to store this product',
    }),
    defineField({
      name: 'interactions',
      title: 'Drug Interactions',
      type: 'text',
      description: 'Potential drug interactions to be aware of',
    }),
    defineField({
      name: 'pregnancyCategory',
      title: 'Pregnancy Category',
      type: 'string',
      description: 'FDA pregnancy risk category',
      options: {
        list: [
          {title: 'Category A', value: 'A'},
          {title: 'Category B', value: 'B'},
          {title: 'Category C', value: 'C'},
          {title: 'Category D', value: 'D'},
          {title: 'Category X', value: 'X'},
          {title: 'Not Applicable', value: 'NA'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'alternativeProducts',
      title: 'Alternative Products',
      type: 'array',
      description: 'Similar or alternative products that can be recommended',
      of: [{
        type: 'reference',
        to: [{type: 'product'}],
      }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Keywords that describe the product for searching and filtering',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      description: 'Technical details and other specifications of the product',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ 
              name: 'key', 
              type: 'string', 
              title: 'Key', 
              description: 'Specification name (e.g., "Weight", "Dimensions")' 
            }),
            defineField({ 
              name: 'value', 
              type: 'string', 
              title: 'Value', 
              description: 'Specification value (e.g., "500g", "10x15x5cm")' 
            }),
          ],
          preview: {
            select: {
              title: 'key',
              subtitle: 'value',
            },
          },
        },
      ],
    }),
    defineField({
      name: 'prescriptionRequired',
      title: 'Prescription Required',
      type: 'boolean',
      description: 'Whether a prescription is required to purchase this product',
      initialValue: false,
    }),
    defineField({
      name: 'controlledSubstance',
      title: 'Controlled Substance',
      type: 'boolean',
      description: 'Whether this product is a controlled substance',
      initialValue: false,
    }),
    defineField({
      name: 'medicalProfessionalOnly',
      title: 'Medical Professional Only',
      type: 'boolean',
      description: 'Whether this product is only available to medical professionals',
      initialValue: false,
    }),
    defineField({
      name: 'ageRestriction',
      title: 'Age Restriction',
      type: 'object',
      description: 'Age restrictions for this product',
      fields: [
        defineField({
          name: 'minAge',
          title: 'Minimum Age',
          type: 'number',
        }),
        defineField({
          name: 'maxAge',
          title: 'Maximum Age',
          type: 'number',
        }),
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      description: 'Current status of this product',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Draft', value: 'draft' },
          { title: 'Archived', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Product',
      type: 'boolean',
      description: 'Show this product in featured sections',
      initialValue: false,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Title used for search engine optimization',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Description used for search engine optimization',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      price: 'price',
      status: 'status',
    },
    prepare({ title, media, price, status }: any) {
      return {
        title,
        media,
        subtitle: `${status ? `[${status}] ` : ''}฿${price || 0}`,
      };
    },
  },
})