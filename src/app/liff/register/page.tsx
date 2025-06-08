'use client';

import React, { Suspense } from 'react';
import { LineRegistrationForm } from '@/components/line/LineRegistrationForm';
import { useLIFFContext } from '@/contexts/LIFFProvider';
import { redirect } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

// ส่วนที่ใช้ useSearchParams ต้องอยู่ใน component แยก
const RegisterPage = () => {
  const { isLoggedIn, profile, isLoading } = useLIFFContext();

  // แสดงตัวโหลดถ้ากำลังโหลดข้อมูล
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // ถ้าไม่ได้ล็อกอินใน LIFF ให้ redirect กลับไปที่หน้าแรก
  if (!isLoggedIn || !profile) {
    redirect('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">ลงทะเบียนเพื่อใช้บริการ</h1>
      <LineRegistrationForm userId={profile.userId} />
    </div>
  );
};

// หน้าหลักที่ใช้ Suspense ครอบ RegisterPage
export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RegisterPage />
    </Suspense>
  );
} 