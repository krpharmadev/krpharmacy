import { defineType, defineField } from 'sanity'

export const drugInteraction = defineType({
  name: 'drugInteraction',
  title: 'Drug Interaction',
  type: 'document',
  fields: [
    defineField({
      name: 'primaryDrug',
      title: 'Primary Drug',
      type: 'reference',
      to: [{type: 'product'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'interactingDrug',
      title: 'Interacting Drug',
      type: 'reference',
      to: [{type: 'product'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'severity',
      title: 'Interaction Severity',
      type: 'string',
      options: {
        list: [
          {title: 'Minor', value: 'minor'},
          {title: 'Moderate', value: 'moderate'},
          {title: 'Major', value: 'major'},
          {title: 'Contraindicated', value: 'contraindicated'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Interaction Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'recommendation',
      title: 'Clinical Recommendation',
      type: 'text',
      description: 'Recommended actions for healthcare providers',
    }),
    defineField({
      name: 'patientAdvice',
      title: 'Patient Advice',
      type: 'text',
      description: 'Information to provide to patients',
    }),
    defineField({
      name: 'references',
      title: 'References',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'url',
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      drug1: 'primaryDrug.name',
      drug2: 'interactingDrug.name',
      severity: 'severity',
    },
    prepare(selection: any) {
      const {drug1, drug2, severity} = selection;
      return {
        title: `${drug1 || 'Unknown'} + ${drug2 || 'Unknown'}`,
        subtitle: `Severity: ${severity || 'Unknown'}`,
      };
    },
  },
}) 