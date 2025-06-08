import { defineType, defineField } from 'sanity'

export const dosageCalculation = defineType({
  name: 'dosageCalculation',
  title: 'Dosage Calculation',
  type: 'document',
  fields: [
    defineField({
      name: 'product',
      title: 'Product',
      type: 'reference',
      to: [{type: 'product'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'calculationType',
      title: 'Calculation Type',
      type: 'string',
      options: {
        list: [
          {title: 'By Weight (kg)', value: 'weight'},
          {title: 'By Age', value: 'age'},
          {title: 'By Body Surface Area', value: 'bsa'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'formula',
      title: 'Calculation Formula',
      type: 'text',
      description: 'Describe the formula for dosage calculation',
    }),
    defineField({
      name: 'minValue',
      title: 'Minimum Value',
      type: 'number',
      description: 'Minimum weight or age',
    }),
    defineField({
      name: 'maxValue',
      title: 'Maximum Value',
      type: 'number',
      description: 'Maximum weight or age',
    }),
    defineField({
      name: 'defaultUnit',
      title: 'Default Unit',
      type: 'string',
      description: 'Default unit for dosage (e.g., mg, ml, etc.)',
    }),
    defineField({
      name: 'warningThresholds',
      title: 'Warning Thresholds',
      type: 'object',
      fields: [
        defineField({
          name: 'minDailyDose',
          title: 'Minimum Daily Dose',
          type: 'number',
          description: 'Minimum recommended daily dose',
        }),
        defineField({
          name: 'maxDailyDose',
          title: 'Maximum Daily Dose',
          type: 'number',
          description: 'Maximum recommended daily dose',
        }),
        defineField({
          name: 'unit',
          title: 'Unit',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'dosageTiers',
      title: 'Dosage Tiers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'minRange',
              title: 'Minimum Range',
              type: 'number',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'maxRange',
              title: 'Maximum Range',
              type: 'number',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'dosage',
              title: 'Recommended Dosage',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'frequency',
              title: 'Frequency',
              type: 'string',
              description: 'How often the dose should be taken',
            }),
            defineField({
              name: 'notes',
              title: 'Notes',
              type: 'text',
            }),
          ],
          preview: {
            select: {
              min: 'minRange',
              max: 'maxRange',
              dosage: 'dosage',
            },
            prepare(selection: any) {
              const {min, max, dosage} = selection;
              return {
                title: `${min} - ${max}`,
                subtitle: `Dosage: ${dosage}`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'specialInstructions',
      title: 'Special Instructions',
      type: 'text',
      description: 'Any special instructions for dosage calculation',
    }),
  ],
  preview: {
    select: {
      title: 'product.name',
      subtitle: 'calculationType',
    },
    prepare(selection: any) {
      const {title, subtitle} = selection;
      const calcTypeMap: {[key: string]: string} = {
        weight: 'By Weight',
        age: 'By Age',
        bsa: 'By Body Surface Area',
      };
      return {
        title: title || 'Unnamed Product',
        subtitle: subtitle ? `${calcTypeMap[subtitle] || subtitle}` : '',
      };
    },
  },
}) 