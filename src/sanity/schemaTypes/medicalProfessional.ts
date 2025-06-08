import { defineType, defineField } from 'sanity'

export const medicalProfessional = defineType({
  name: 'medicalProfessional',
  title: 'Medical Professional',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      options: {
        list: [
          {title: 'Doctor', value: 'doctor'},
          {title: 'Pharmacist', value: 'pharmacist'},
          {title: 'Nurse', value: 'nurse'},
          {title: 'Other', value: 'other'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'licenseNumber',
      title: 'License Number',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'specialization',
      title: 'Specialization',
      type: 'string',
      description: 'Medical specialty or area of expertise',
    }),
    defineField({
      name: 'hospital',
      title: 'Hospital/Clinic',
      type: 'string',
      description: 'Place of practice',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'profileImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'isVerified',
      title: 'Verified',
      type: 'boolean',
      description: 'Whether this professional\'s credentials have been verified',
      initialValue: false,
    }),
    defineField({
      name: 'canPrescribe',
      title: 'Can Prescribe Medications',
      type: 'boolean',
      description: 'Whether this professional can prescribe medications',
      initialValue: false,
    }),
    defineField({
      name: 'canVerifyPrescriptions',
      title: 'Can Verify Prescriptions',
      type: 'boolean',
      description: 'Whether this professional can verify prescriptions (typically pharmacists)',
      initialValue: false,
    }),
    defineField({
      name: 'specialAccessCategories',
      title: 'Special Access Categories',
      type: 'array',
      description: 'Product categories this professional has special access to',
      of: [{
        type: 'reference',
        to: [{type: 'category'}],
      }],
    }),
  ],
  preview: {
    select: {
      title: 'firstName',
      subtitle: 'lastName',
      description: 'title',
      media: 'profileImage',
    },
    prepare(selection: any) {
      const {title, subtitle, description, media} = selection;
      return {
        title: `${title} ${subtitle}`,
        subtitle: description,
        media,
      };
    },
  },
}) 