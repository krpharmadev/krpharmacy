import { defineType, defineField } from 'sanity'

export const atcClassification = defineType({
  name: 'atcClassification',
  title: 'ATC Classification',
  type: 'document',
  fields: [
    defineField({
      name: 'atcCode',
      title: 'ATC Code',
      type: 'string',
      validation: (Rule) => Rule.required().regex(/^[A-Z](\d{2}([A-Z](\d{2}([A-Z](\d{2})?)?)?)?)?$/, {
        name: 'ATC Format',
        invert: false,
      }),
    }),
    defineField({
      name: 'level1',
      title: 'Level 1 - Anatomical Main Group',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'level2',
      title: 'Level 2 - Therapeutic Subgroup',
      type: 'string',
    }),
    defineField({
      name: 'level3',
      title: 'Level 3 - Pharmacological Subgroup',
      type: 'string',
    }),
    defineField({
      name: 'level4',
      title: 'Level 4 - Chemical Subgroup',
      type: 'string',
    }),
    defineField({
      name: 'level5',
      title: 'Level 5 - Chemical Substance',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'descriptionTh',
      title: 'Description (Thai)',
      type: 'text',
    }),
    defineField({
      name: 'recommendedCategories',
      title: 'Recommended Product Categories',
      type: 'array',
      of: [{
        type: 'reference',
        to: [{type: 'category'}],
      }],
      description: 'Product categories commonly associated with this ATC code',
    }),
  ],
  preview: {
    select: {
      title: 'atcCode',
      subtitle: 'level5',
    },
  },
}) 