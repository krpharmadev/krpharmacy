import { defineField, defineType } from 'sanity'

export const drugDetails = defineType({
    name: 'drugDetails',
    title: 'ข้อมูลยา',
    type: 'document',
    fields: [
      defineField({
        name: 'drugName',
        title: 'ชื่อยา',
        type: 'string',
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'genericName',
        title: 'ชื่อสามัญ',
        type: 'string',
      }),
      defineField({
        name: 'dosageForm',
        title: 'รูปแบบยา',
        type: 'string',
        options: {
          list: [
            { title: 'ยาเม็ด', value: 'tablet' },
            { title: 'ยาแคปซูล', value: 'capsule' },
            { title: 'น้ำเชื่อม', value: 'syrup' },
            { title: 'ฉีด', value: 'injection' },
            { title: 'ครีม', value: 'cream' },
            { title: 'เจล', value: 'gel' },
            { title: 'สเปรย์', value: 'spray' },
            { title: 'อื่น ๆ', value: 'other' },
          ],
        },
      }),
      defineField({
        name: 'atcCode',
        title: 'รหัส ATC',
        type: 'string',
        validation: (Rule) =>
          Rule.regex(/^[A-Z0-9]+$/).error('รหัส ATC ต้องเป็นตัวอักษรและตัวเลข'),
      }),
      defineField({
        name: 'fdaNumber',
        title: 'เลขทะเบียน อย.',
        type: 'string',
        validation: (Rule) =>
          Rule.regex(/^\d{1,2}-\d{1,5}-\d{1,5}-\d{1,2}-\d{1,2}$/).error(
            'รูปแบบเลขทะเบียน อย. ไม่ถูกต้อง เช่น 1A-12345-12345-12-12',
          ),
      }),
      defineField({
        name: 'prescriptionStatus',
        title: 'สถานะการสั่งจ่าย',
        type: 'string',
        options: {
          list: [
            { title: 'ยาทั่วไป (OTC)', value: 'otc' },
            { title: 'ยาต้องสั่งโดยแพทย์ (POM)', value: 'pom' },
            { title: 'ยาควบคุม', value: 'controlled' },
          ],
        },
        validation: (Rule) => Rule.required(),
      }),
      defineField({
        name: 'storageConditions',
        title: 'เงื่อนไขการเก็บรักษา',
        type: 'string',
      }),
    ],
    preview: {
      select: { title: 'drugName', subtitle: 'genericName' },
    },
  })
  