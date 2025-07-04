export const headerData = [{ title: "Home", href: "/" }, { title: "Shop", href: "/shop" }, { title: "Blog", href: "/blog" }, { title: "Hot Deal", href: "/deal" }];

// ข้อมูล ATC Codes สำหรับ reference
export const ATC_CODES = {
  // A - ALIMENTARY TRACT AND METABOLISM
  A01: { code: "A01", name: "STOMATOLOGICAL PREPARATIONS", description: "ยาสำหรับช่องปาก" },
  A02: { code: "A02", name: "DRUGS FOR ACID RELATED DISORDERS", description: "ยารักษาโรคที่เกี่ยวข้องกับกรด" },
  A03: { code: "A03", name: "DRUGS FOR FUNCTIONAL GASTROINTESTINAL DISORDERS", description: "ยารักษาโรคทางเดินอาหาร" },
  A04: { code: "A04", name: "ANTIEMETICS AND ANTINAUSEANTS", description: "ยาต้านอาเจียนและคลื่นไส้" },
  A05: { code: "A05", name: "BILE AND LIVER THERAPY", description: "ยารักษาโรคตับและน้ำดี" },
  A06: { code: "A06", name: "LAXATIVES", description: "ยาระบาย" },
  A07: { code: "A07", name: "ANTIDIARRHEALS", description: "ยาต้านท้องเสีย" },
  A08: { code: "A08", name: "ANTIOBESITY PREPARATIONS", description: "ยาลดความอ้วน" },
  A09: { code: "A09", name: "DIGESTIVES", description: "ยาช่วยย่อย" },
  A10: { code: "A10", name: "DRUGS USED IN DIABETES", description: "ยารักษาโรคเบาหวาน" },
  A11: { code: "A11", name: "VITAMINS", description: "วิตามิน" },
  A12: { code: "A12", name: "MINERAL SUPPLEMENTS", description: "แร่ธาตุเสริม" },
  A13: { code: "A13", name: "TONICS", description: "ยาบำรุง" },
  A14: { code: "A14", name: "ANABOLIC AGENTS", description: "ยาอนาบอลิก" },
  A15: { code: "A15", name: "APPETITE STIMULANTS", description: "ยากระตุ้นความอยากอาหาร" },
  A16: { code: "A16", name: "OTHER ALIMENTARY TRACT PRODUCTS", description: "ผลิตภัณฑ์อื่นๆ" },

  // B - BLOOD AND BLOOD FORMING ORGANS
  B01: { code: "B01", name: "ANTITHROMBOTIC AGENTS", description: "ยาต้านการแข็งตัวของเลือด" },
  B02: { code: "B02", name: "ANTIHEMORRHAGICS", description: "ยาห้ามเลือด" },
  B03: { code: "B03", name: "ANTIANEMIC PREPARATIONS", description: "ยารักษาโรคโลหิตจาง" },
  B05: { code: "B05", name: "BLOOD SUBSTITUTES", description: "สารทดแทนเลือด" },
  B06: { code: "B06", name: "OTHER HEMATOLOGICAL AGENTS", description: "ยาอื่นๆ สำหรับระบบเลือด" },

  // C - CARDIOVASCULAR SYSTEM
  C01: { code: "C01", name: "CARDIAC THERAPY", description: "ยารักษาโรคหัวใจ" },
  C02: { code: "C02", name: "ANTIHYPERTENSIVES", description: "ยาลดความดันโลหิต" },
  C03: { code: "C03", name: "DIURETICS", description: "ยาขับปัสสาวะ" },
  C04: { code: "C04", name: "PERIPHERAL VASODILATORS", description: "ยาขยายหลอดเลือด" },
  C05: { code: "C05", name: "VASOPROTECTIVES", description: "ยาป้องกันหลอดเลือด" },
  C07: { code: "C07", name: "BETA BLOCKING AGENTS", description: "ยาต้านเบต้า" },
  C08: { code: "C08", name: "CALCIUM CHANNEL BLOCKERS", description: "ยาต้านแคลเซียม" },
  C09: { code: "C09", name: "RENIN-ANGIOTENSIN SYSTEM", description: "ระบบเรนิน-แองจิโอเทนซิน" },
  C10: { code: "C10", name: "LIPID MODIFYING AGENTS", description: "ยาปรับไขมัน" },

  // D - DERMATOLOGICALS
  D01: { code: "D01", name: "ANTIFUNGALS", description: "ยาต้านเชื้อรา" },
  D02: { code: "D02", name: "EMOLLIENTS AND PROTECTIVES", description: "ยาทำให้ผิวอ่อนนุ่ม" },
  D03: { code: "D03", name: "WOUND TREATMENT", description: "ยารักษาบาดแผล" },
  D04: { code: "D04", name: "ANTIPRURITICS", description: "ยาต้านอาการคัน" },
  D05: { code: "D05", name: "ANTIPSORIATICS", description: "ยารักษาโรคสะเก็ดเงิน" },
  D06: { code: "D06", name: "ANTIBIOTICS FOR DERMATOLOGICAL USE", description: "ยาปฏิชีวนะใช้ภายนอก" },
  D07: { code: "D07", name: "CORTICOSTEROIDS", description: "คอร์ติโคสเตอรอยด์" },
  D08: { code: "D08", name: "ANTISEPTICS", description: "ยาฆ่าเชื้อ" },
  D09: { code: "D09", name: "MEDICATED DRESSINGS", description: "ผ้าพันแผลที่มียา" },
  D10: { code: "D10", name: "ANTI-ACNE PREPARATIONS", description: "ยารักษาสิว" },
  D11: { code: "D11", name: "OTHER DERMATOLOGICAL PREPARATIONS", description: "ยาอื่นๆ ใช้ภายนอก" },

  // G - GENITO URINARY SYSTEM
  G01: { code: "G01", name: "GYNECOLOGICAL ANTIINFECTIVES", description: "ยาต้านเชื้อนรีเวช" },
  G02: { code: "G02", name: "OTHER GYNECOLOGICALS", description: "ยาอื่นๆ นรีเวช" },
  G03: { code: "G03", name: "SEX HORMONES", description: "ฮอร์โมนเพศ" },
  G04: { code: "G04", name: "UROLOGICALS", description: "ยารักษาโรคทางเดินปัสสาวะ" },

  // H - SYSTEMIC HORMONAL PREPARATIONS
  H01: { code: "H01", name: "PITUITARY AND HYPOTHALAMIC HORMONES", description: "ฮอร์โมนต่อมใต้สมอง" },
  H02: { code: "H02", name: "CORTICOSTEROIDS FOR SYSTEMIC USE", description: "คอร์ติโคสเตอรอยด์ใช้ทั่วร่างกาย" },
  H03: { code: "H03", name: "THYROID THERAPY", description: "ยารักษาโรคต่อมไทรอยด์" },
  H04: { code: "H04", name: "PANCREATIC HORMONES", description: "ฮอร์โมนตับอ่อน" },
  H05: { code: "H05", name: "CALCIUM HOMEOSTASIS", description: "การรักษาสมดุลแคลเซียม" },

  // J - ANTIINFECTIVES FOR SYSTEMIC USE
  J01: { code: "J01", name: "ANTIBACTERIALS", description: "ยาปฏิชีวนะ" },
  J02: { code: "J02", name: "ANTIMYCOTICS", description: "ยาต้านเชื้อรา" },
  J04: { code: "J04", name: "ANTIMYCOBACTERIALS", description: "ยาต้านเชื้อไมโคแบคทีเรีย" },
  J05: { code: "J05", name: "ANTIVIRALS", description: "ยาต้านไวรัส" },
  J06: { code: "J06", name: "IMMUNE SERUMS", description: "เซรุ่มภูมิคุ้มกัน" },
  J07: { code: "J07", name: "VACCINES", description: "วัคซีน" },

  // L - ANTINEOPLASTIC AND IMMUNOMODULATING AGENTS
  L01: { code: "L01", name: "ANTINEOPLASTIC AGENTS", description: "ยาต้านมะเร็ง" },
  L02: { code: "L02", name: "ENDOCRINE THERAPY", description: "การรักษาด้วยฮอร์โมน" },
  L03: { code: "L03", name: "IMMUNOSTIMULANTS", description: "ยากระตุ้นภูมิคุ้มกัน" },
  L04: { code: "L04", name: "IMMUNOSUPPRESSANTS", description: "ยากดภูมิคุ้มกัน" },

  // M - MUSCULO-SKELETAL SYSTEM
  M01: { code: "M01", name: "ANTIINFLAMMATORY AND ANTIRHEUMATIC", description: "ยาต้านการอักเสบและต้านรูมาติก" },
  M02: { code: "M02", name: "TOPICAL PRODUCTS FOR JOINT AND MUSCULAR PAIN", description: "ยาทาภายนอกสำหรับปวดข้อ" },
  M03: { code: "M03", name: "MUSCLE RELAXANTS", description: "ยาคลายกล้ามเนื้อ" },
  M04: { code: "M04", name: "ANTIGOUT PREPARATIONS", description: "ยารักษาโรคเกาต์" },
  M05: { code: "M05", name: "DRUGS FOR TREATMENT OF BONE DISEASES", description: "ยารักษาโรคกระดูก" },
  M09: { code: "M09", name: "OTHER MUSCULO-SKELETAL DRUGS", description: "ยาอื่นๆ ระบบกล้ามเนื้อและกระดูก" },

  // N - NERVOUS SYSTEM
  N01: { code: "N01", name: "ANESTHETICS", description: "ยาชา" },
  N02: { code: "N02", name: "ANALGESICS", description: "ยาแก้ปวด" },
  N03: { code: "N03", name: "ANTIEPILEPTICS", description: "ยาต้านโรคลมชัก" },
  N04: { code: "N04", name: "ANTIPARKINSON DRUGS", description: "ยารักษาโรคพาร์กินสัน" },
  N05: { code: "N05", name: "PSYCHOLEPTICS", description: "ยาระงับประสาท" },
  N06: { code: "N06", name: "PSYCHOANALEPTICS", description: "ยากระตุ้นประสาท" },
  N07: { code: "N07", name: "OTHER NERVOUS SYSTEM DRUGS", description: "ยาอื่นๆ ระบบประสาท" },

  // P - ANTIPARASITIC PRODUCTS
  P01: { code: "P01", name: "ANTIPROTOZOALS", description: "ยาต้านโปรโตซัว" },
  P02: { code: "P02", name: "ANTHELMINTICS", description: "ยาถ่ายพยาธิ" },
  P03: { code: "P03", name: "ECTOPARASITICIDES", description: "ยาฆ่าแมลงภายนอก" },

  // R - RESPIRATORY SYSTEM
  R01: { code: "R01", name: "NASAL PREPARATIONS", description: "ยาสำหรับจมูก" },
  R02: { code: "R02", name: "THROAT PREPARATIONS", description: "ยาสำหรับคอ" },
  R03: { code: "R03", name: "DRUGS FOR OBSTRUCTIVE AIRWAY DISEASES", description: "ยารักษาโรคทางเดินหายใจอุดกั้น" },
  R05: { code: "R05", name: "COUGH AND COLD PREPARATIONS", description: "ยาแก้ไอและยาแก้หวัด" },
  R06: { code: "R06", name: "ANTIHISTAMINES", description: "ยาต้านฮิสตามีน" },
  R07: { code: "R07", name: "OTHER RESPIRATORY SYSTEM PRODUCTS", description: "ผลิตภัณฑ์อื่นๆ ระบบหายใจ" },

  // S - SENSORY ORGANS
  S01: { code: "S01", name: "OPHTHALMOLOGICALS", description: "ยาสำหรับตา" },
  S02: { code: "S02", name: "OTOLOGICALS", description: "ยาสำหรับหู" },
  S03: { code: "S03", name: "OPHTHALMOLOGICAL AND OTOLOGICAL", description: "ยาสำหรับตาและหู" },

  // V - VARIOUS
  V01: { code: "V01", name: "ALLERGENS", description: "สารก่อภูมิแพ้" },
  V03: { code: "V03", name: "ALL OTHER THERAPEUTIC PRODUCTS", description: "ผลิตภัณฑ์รักษาอื่นๆ" },
  V04: { code: "V04", name: "DIAGNOSTIC AGENTS", description: "สารสำหรับการวินิจฉัย" },
  V06: { code: "V06", name: "GENERAL NUTRIENTS", description: "สารอาหารทั่วไป" },
  V07: { code: "V07", name: "ALL OTHER NON-THERAPEUTIC PRODUCTS", description: "ผลิตภัณฑ์อื่นๆ ที่ไม่ใช่ยารักษา" },
  V08: { code: "V08", name: "CONTRAST MEDIA", description: "สารทึบรังสี" },
  V09: { code: "V09", name: "DIAGNOSTIC RADIOPHARMACEUTICALS", description: "สารเภสัชรังสีสำหรับการวินิจฉัย" },
  V10: { code: "V10", name: "THERAPEUTIC RADIOPHARMACEUTICALS", description: "สารเภสัชรังสีสำหรับการรักษา" },
  V20: { code: "V20", name: "SURGICAL DRESSINGS", description: "ผ้าพันแผลผ่าตัด" }
} as const;

// Helper functions สำหรับ ATC codes
export const getATCCodeInfo = (code: string) => {
  return ATC_CODES[code as keyof typeof ATC_CODES] || null;
};

export const getATCCodeName = (code: string) => {
  const info = getATCCodeInfo(code);
  return info ? info.name : code;
};

export const getATCCodeDescription = (code: string) => {
  const info = getATCCodeInfo(code);
  return info ? info.description : '';
};

export const getAllATCCodes = () => {
  return Object.values(ATC_CODES);
};

export const getATCCodesByCategory = (category: string) => {
  return Object.values(ATC_CODES).filter(atc => 
    atc.code.startsWith(category)
  );
};

// ตัวอย่างการใช้งาน
export const COMMON_ATC_CODES = {
  // ยาแก้ปวด
  PARACETAMOL: "N02BE01",
  IBUPROFEN: "M01AE01",
  ASPIRIN: "N02BA01",
  
  // ยาปฏิชีวนะ
  AMOXICILLIN: "J01CA04",
  PENICILLIN: "J01CE01",
  
  // ยาลดความดัน
  AMLODIPINE: "C08CA01",
  LOSARTAN: "C09CA01",
  
  // ยาเบาหวาน
  METFORMIN: "A10BA02",
  GLIMEPIRIDE: "A10BB12",
  
  // ยาแก้ไข้
  PARACETAMOL_SYRUP: "N02BE01",
  
  // ยาแก้ไอ
  DEXTROMETHORPHAN: "R05DA09",
  
  // ยาแก้แพ้
  LORATADINE: "R06AX13",
  CETIRIZINE: "R06AE07"
} as const;
