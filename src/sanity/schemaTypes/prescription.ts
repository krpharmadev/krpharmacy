import { defineType, defineField } from 'sanity'

export const prescription = defineType({
  name: 'prescription',
  title: 'Prescription',
  type: 'document',
  fields: [
    defineField({
      name: 'prescriptionNumber',
      title: 'Prescription Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'reference',
      to: [{type: 'customer'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'prescribingDoctor',
      title: 'Prescribing Doctor',
      type: 'reference',
      to: [{type: 'medicalProfessional'}],
    }),
    defineField({
      name: 'prescriptionImage',
      title: 'Prescription Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'prescriptionDate',
      title: 'Prescription Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'expiryDate',
      title: 'Expiry Date',
      type: 'date',
    }),
    defineField({
      name: 'medications',
      title: 'Prescribed Medications',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'product',
              title: 'Product',
              type: 'reference',
              to: [{type: 'product'}],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'quantity',
              title: 'Quantity',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'dosage',
              title: 'Dosage Instructions',
              type: 'string',
            }),
            defineField({
              name: 'duration',
              title: 'Duration',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'product.name',
              subtitle: 'quantity',
            },
            prepare(selection: any) {
              const {title, subtitle} = selection;
              return {
                title,
                subtitle: subtitle ? `Qty: ${subtitle}` : '',
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          {title: 'Pending Verification', value: 'pending'},
          {title: 'Verified', value: 'verified'},
          {title: 'Partially Filled', value: 'partial'},
          {title: 'Completed', value: 'completed'},
          {title: 'Expired', value: 'expired'},
          {title: 'Rejected', value: 'rejected'},
        ],
        layout: 'radio',
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'verifiedBy',
      title: 'Verified By (Pharmacist)',
      type: 'reference',
      to: [{type: 'medicalProfessional'}],
    }),
    defineField({
      name: 'verificationDate',
      title: 'Verification Date',
      type: 'datetime',
    }),
    defineField({
      name: 'notes',
      title: 'Notes',
      type: 'text',
    }),
  ],
  preview: {
    select: {
      title: 'prescriptionNumber',
      subtitle: 'status',
      customer: 'customer.firstName',
    },
    prepare(selection: any) {
      const {title, subtitle, customer} = selection;
      return {
        title,
        subtitle: `${subtitle ? `[${subtitle}]` : ''} ${customer ? `- ${customer}` : ''}`,
      };
    },
  },
}) 