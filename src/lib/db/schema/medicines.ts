import {
    pgTable,
    serial,
    text,
    varchar,
    decimal,
    integer,
    uniqueIndex,
    foreignKey,
  } from 'drizzle-orm/pg-core';
  
  // ใช้ type assertion แทนการใช้ interface inheritance
  import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
  
  // ตาราง atcCategory ตามหลักการแบ่งหมวดหมู่ ATC
  export const atcCategories = pgTable('atc_categories', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 10 }).notNull().unique(),
    name: text('name').notNull(),
    description: text('description'),
    level: integer('level').notNull(), // ระดับของ ATC (1-5)
    parentCode: varchar('parent_code', { length: 10 }), // รหัส ATC ของหมวดหมู่แม่
    anatomicalGroup: varchar('anatomical_group', { length: 255 }), // กลุ่มกายวิภาค (ระดับ 1)
    therapeuticGroup: varchar('therapeutic_group', { length: 255 }), // กลุ่มการรักษา (ระดับ 2)
    pharmacologicalGroup: varchar('pharmacological_group', { length: 255 }), // กลุ่มเภสัชวิทยา (ระดับ 3)
    chemicalGroup: varchar('chemical_group', { length: 255 }), // กลุ่มเคมี (ระดับ 4)
    chemicalSubstance: varchar('chemical_substance', { length: 255 }), // สารเคมี (ระดับ 5)
  }, (atcCategories) => {
    return {
      codeIdx: uniqueIndex('atc_categories_code_idx').on(atcCategories.code),
    };
  });
  
  export type AtcCategory = InferSelectModel<typeof atcCategories>;
  export type NewAtcCategory = InferInsertModel<typeof atcCategories>;
  
  // ข้อมูลหมวดหมู่ยา ATC เบื้องต้น
  export const mockAtcCategories = [
    // ระดับ 1: Anatomical Group
    {
      code: 'A',
      name: 'ระบบทางเดินอาหารและเมตาบอลิซึม',
      description: 'ยาที่เกี่ยวข้องกับระบบทางเดินอาหารและเมตาบอลิซึม',
      level: 1,
      parentCode: null,
      anatomicalGroup: 'ระบบทางเดินอาหารและเมตาบอลิซึม',
      therapeuticGroup: null,
      pharmacologicalGroup: null,
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    {
      code: 'B',
      name: 'เลือดและอวัยวะสร้างเลือด',
      description: 'ยาที่เกี่ยวข้องกับเลือดและอวัยวะสร้างเลือด',
      level: 1,
      parentCode: null,
      anatomicalGroup: 'เลือดและอวัยวะสร้างเลือด',
      therapeuticGroup: null,
      pharmacologicalGroup: null,
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    {
      code: 'C',
      name: 'ระบบหัวใจและหลอดเลือด',
      description: 'ยาที่เกี่ยวข้องกับระบบหัวใจและหลอดเลือด',
      level: 1,
      parentCode: null,
      anatomicalGroup: 'ระบบหัวใจและหลอดเลือด',
      therapeuticGroup: null,
      pharmacologicalGroup: null,
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    {
      code: 'J',
      name: 'ยาต้านการติดเชื้อสำหรับใช้ทางระบบ',
      description: 'ยาต้านการติดเชื้อสำหรับใช้ทางระบบ',
      level: 1,
      parentCode: null,
      anatomicalGroup: 'ยาต้านการติดเชื้อสำหรับใช้ทางระบบ',
      therapeuticGroup: null,
      pharmacologicalGroup: null,
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    {
      code: 'N',
      name: 'ระบบประสาท',
      description: 'ยาที่เกี่ยวข้องกับระบบประสาท',
      level: 1,
      parentCode: null,
      anatomicalGroup: 'ระบบประสาท',
      therapeuticGroup: null,
      pharmacologicalGroup: null,
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    
    // ระดับ 2: Therapeutic Group
    {
      code: 'A02',
      name: 'ยาสำหรับโรคที่เกี่ยวกับกรดในกระเพาะอาหาร',
      description: 'ยาที่ใช้รักษาโรคที่เกี่ยวข้องกับกรดในกระเพาะอาหาร',
      level: 2,
      parentCode: 'A',
      anatomicalGroup: 'ระบบทางเดินอาหารและเมตาบอลิซึม',
      therapeuticGroup: 'ยาสำหรับโรคที่เกี่ยวกับกรดในกระเพาะอาหาร',
      pharmacologicalGroup: null,
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    {
      code: 'A10',
      name: 'ยาสำหรับเบาหวาน',
      description: 'ยาที่ใช้รักษาเบาหวาน',
      level: 2,
      parentCode: 'A',
      anatomicalGroup: 'ระบบทางเดินอาหารและเมตาบอลิซึม',
      therapeuticGroup: 'ยาสำหรับเบาหวาน',
      pharmacologicalGroup: null,
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    {
      code: 'C01',
      name: 'ยาสำหรับโรคหัวใจ',
      description: 'ยาที่ใช้รักษาโรคหัวใจ',
      level: 2,
      parentCode: 'C',
      anatomicalGroup: 'ระบบหัวใจและหลอดเลือด',
      therapeuticGroup: 'ยาสำหรับโรคหัวใจ',
      pharmacologicalGroup: null,
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    {
      code: 'C03',
      name: 'ยาขับปัสสาวะ',
      description: 'ยาขับปัสสาวะ',
      level: 2,
      parentCode: 'C',
      anatomicalGroup: 'ระบบหัวใจและหลอดเลือด',
      therapeuticGroup: 'ยาขับปัสสาวะ',
      pharmacologicalGroup: null,
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    {
      code: 'J01',
      name: 'ยาปฏิชีวนะสำหรับใช้ทางระบบ',
      description: 'ยาปฏิชีวนะสำหรับใช้ทางระบบ',
      level: 2,
      parentCode: 'J',
      anatomicalGroup: 'ยาต้านการติดเชื้อสำหรับใช้ทางระบบ',
      therapeuticGroup: 'ยาปฏิชีวนะสำหรับใช้ทางระบบ',
      pharmacologicalGroup: null,
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    
    // ระดับ 3: Pharmacological Group
    {
      code: 'A02B',
      name: 'ยาสำหรับโรคแผลในกระเพาะอาหารและโรคกรดไหลย้อน',
      description: 'ยาที่ใช้รักษาโรคแผลในกระเพาะอาหารและโรคกรดไหลย้อน',
      level: 3,
      parentCode: 'A02',
      anatomicalGroup: 'ระบบทางเดินอาหารและเมตาบอลิซึม',
      therapeuticGroup: 'ยาสำหรับโรคที่เกี่ยวกับกรดในกระเพาะอาหาร',
      pharmacologicalGroup: 'ยาสำหรับโรคแผลในกระเพาะอาหารและโรคกรดไหลย้อน',
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    {
      code: 'A10B',
      name: 'ยาลดระดับกลูโคสในเลือด ไม่รวมอินซูลิน',
      description: 'ยาลดระดับกลูโคสในเลือด ไม่รวมอินซูลิน',
      level: 3,
      parentCode: 'A10',
      anatomicalGroup: 'ระบบทางเดินอาหารและเมตาบอลิซึม',
      therapeuticGroup: 'ยาสำหรับเบาหวาน',
      pharmacologicalGroup: 'ยาลดระดับกลูโคสในเลือด ไม่รวมอินซูลิน',
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    {
      code: 'J01C',
      name: 'ยาปฏิชีวนะกลุ่มเบต้า-แลคแตม',
      description: 'ยาปฏิชีวนะกลุ่มเบต้า-แลคแตม',
      level: 3,
      parentCode: 'J01',
      anatomicalGroup: 'ยาต้านการติดเชื้อสำหรับใช้ทางระบบ',
      therapeuticGroup: 'ยาปฏิชีวนะสำหรับใช้ทางระบบ',
      pharmacologicalGroup: 'ยาปฏิชีวนะกลุ่มเบต้า-แลคแตม',
      chemicalGroup: null,
      chemicalSubstance: null,
    },
    
    // ระดับ 4: Chemical Group
    {
      code: 'A02BC',
      name: 'ยายับยั้งโปรตอนปั้ม',
      description: 'ยายับยั้งโปรตอนปั้ม',
      level: 4,
      parentCode: 'A02B',
      anatomicalGroup: 'ระบบทางเดินอาหารและเมตาบอลิซึม',
      therapeuticGroup: 'ยาสำหรับโรคที่เกี่ยวกับกรดในกระเพาะอาหาร',
      pharmacologicalGroup: 'ยาสำหรับโรคแผลในกระเพาะอาหารและโรคกรดไหลย้อน',
      chemicalGroup: 'ยายับยั้งโปรตอนปั้ม',
      chemicalSubstance: null,
    },
    {
      code: 'A10BA',
      name: 'ไบกัวไนด์',
      description: 'ยาลดระดับกลูโคสในเลือดกลุ่มไบกัวไนด์',
      level: 4,
      parentCode: 'A10B',
      anatomicalGroup: 'ระบบทางเดินอาหารและเมตาบอลิซึม',
      therapeuticGroup: 'ยาสำหรับเบาหวาน',
      pharmacologicalGroup: 'ยาลดระดับกลูโคสในเลือด ไม่รวมอินซูลิน',
      chemicalGroup: 'ไบกัวไนด์',
      chemicalSubstance: null,
    },
    {
      code: 'J01CA',
      name: 'เพนิซิลลินชนิดออกฤทธิ์กว้าง',
      description: 'เพนิซิลลินชนิดออกฤทธิ์กว้าง',
      level: 4,
      parentCode: 'J01C',
      anatomicalGroup: 'ยาต้านการติดเชื้อสำหรับใช้ทางระบบ',
      therapeuticGroup: 'ยาปฏิชีวนะสำหรับใช้ทางระบบ',
      pharmacologicalGroup: 'ยาปฏิชีวนะกลุ่มเบต้า-แลคแตม',
      chemicalGroup: 'เพนิซิลลินชนิดออกฤทธิ์กว้าง',
      chemicalSubstance: null,
    },
    
    // ระดับ 5: Chemical Substance
    {
      code: 'A02BC01',
      name: 'โอเมพราโซล',
      description: 'โอเมพราโซล',
      level: 5,
      parentCode: 'A02BC',
      anatomicalGroup: 'ระบบทางเดินอาหารและเมตาบอลิซึม',
      therapeuticGroup: 'ยาสำหรับโรคที่เกี่ยวกับกรดในกระเพาะอาหาร',
      pharmacologicalGroup: 'ยาสำหรับโรคแผลในกระเพาะอาหารและโรคกรดไหลย้อน',
      chemicalGroup: 'ยายับยั้งโปรตอนปั้ม',
      chemicalSubstance: 'โอเมพราโซล',
    },
    {
      code: 'A02BC02',
      name: 'แพนโทพราโซล',
      description: 'แพนโทพราโซล',
      level: 5,
      parentCode: 'A02BC',
      anatomicalGroup: 'ระบบทางเดินอาหารและเมตาบอลิซึม',
      therapeuticGroup: 'ยาสำหรับโรคที่เกี่ยวกับกรดในกระเพาะอาหาร',
      pharmacologicalGroup: 'ยาสำหรับโรคแผลในกระเพาะอาหารและโรคกรดไหลย้อน',
      chemicalGroup: 'ยายับยั้งโปรตอนปั้ม',
      chemicalSubstance: 'แพนโทพราโซล',
    },
    {
      code: 'A10BA02',
      name: 'เมตฟอร์มิน',
      description: 'เมตฟอร์มิน',
      level: 5,
      parentCode: 'A10BA',
      anatomicalGroup: 'ระบบทางเดินอาหารและเมตาบอลิซึม',
      therapeuticGroup: 'ยาสำหรับเบาหวาน',
      pharmacologicalGroup: 'ยาลดระดับกลูโคสในเลือด ไม่รวมอินซูลิน',
      chemicalGroup: 'ไบกัวไนด์',
      chemicalSubstance: 'เมตฟอร์มิน',
    },
    {
      code: 'J01CA04',
      name: 'อะม็อกซิซิลลิน',
      description: 'อะม็อกซิซิลลิน',
      level: 5,
      parentCode: 'J01CA',
      anatomicalGroup: 'ยาต้านการติดเชื้อสำหรับใช้ทางระบบ',
      therapeuticGroup: 'ยาปฏิชีวนะสำหรับใช้ทางระบบ',
      pharmacologicalGroup: 'ยาปฏิชีวนะกลุ่มเบต้า-แลคแตม',
      chemicalGroup: 'เพนิซิลลินชนิดออกฤทธิ์กว้าง',
      chemicalSubstance: 'อะม็อกซิซิลลิน',
    }
  ] as const;
  
  // ฟังก์ชันสำหรับการนำเข้าข้อมูล ATC
  export function getAtcCategoriesData(): NewAtcCategory[] {
    return mockAtcCategories as unknown as NewAtcCategory[];
  }
  
  // ตาราง medicines
  export const medicines = pgTable('medicines', {
    id: serial('id').primaryKey(),
    medicineId: varchar('medicine_id', { length: 50 }).notNull().unique(),
    genericName: text('generic_name').notNull(),
    strength: varchar('strength', { length: 100 }).notNull(),
    form: varchar('form', { length: 100 }).notNull(),
    atcCode: varchar('atc_code', { length: 10 }).notNull(),
    atcCategoryId: integer('atc_category_id').notNull().references(() => atcCategories.id),
    indication: text('indication').notNull(),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    stock: integer('stock').notNull().default(0),
  }, (medicines) => {
    return {
      genericNameIdx: uniqueIndex('medicines_generic_name_idx').on(medicines.genericName),
      atcCodeIdx: uniqueIndex('medicines_atc_code_idx').on(medicines.atcCode),
    };
  });
  
  // ประเภทข้อมูลที่จะใช้ในแอปพลิเคชัน
  export type Medicine = InferSelectModel<typeof medicines>;
  export type NewMedicine = InferInsertModel<typeof medicines>;
  
  // ฟังก์ชันแปลงข้อมูลจาก mock data เป็นรูปแบบของ database
  export function mockMedicineToDbMedicine(mockMedicine: {
    id: string;
    genericName: string;
    strength: string;
    form: string;
    atcCode: string;
    atcCategory: string;
    indication: string;
    price: number;
    stock: number;
  }): NewMedicine {
    // ฟังก์ชันที่จะหา atcCategoryId จาก atcCode
    // ในตัวอย่างนี้เราจะใช้ค่าเริ่มต้น 1 สำหรับการทดสอบ
    const getAtcCategoryIdFromCode = (code: string): number => {
      // ในการใช้งานจริง ควรมีการค้นหา category ID จาก code ในฐานข้อมูล
      return 1;
    };
  
    return {
      medicineId: mockMedicine.id,
      genericName: mockMedicine.genericName,
      strength: mockMedicine.strength,
      form: mockMedicine.form,
      atcCode: mockMedicine.atcCode,
      atcCategoryId: getAtcCategoryIdFromCode(mockMedicine.atcCode),
      indication: mockMedicine.indication,
      price: mockMedicine.price as any, // แปลง number เป็น decimal
      stock: mockMedicine.stock,
    };
  } 