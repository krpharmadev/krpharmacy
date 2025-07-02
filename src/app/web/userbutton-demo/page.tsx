'use client'

import UserButton from '@/components/UserButton';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/AppContext';

function CartIcon() {
  return <span role="img" aria-label="cart">🛒</span>;
}
function BagIcon() {
  return <span role="img" aria-label="bag">🛍️</span>;
}

export default function UserButtonDemoPage() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">ตัวอย่างการใช้งาน UserButton</h1>
      
      {/* แสดงข้อมูล User */}
      {user && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-2">ข้อมูลผู้ใช้:</h2>
          <div className="space-y-1 text-sm">
            <p><strong>ชื่อ:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>อีเมล:</strong> {user.emailAddresses[0]?.emailAddress}</p>
            <p><strong>Role:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                user.publicMetadata?.role === 'admin' ? 'bg-red-100 text-red-800' :
                user.publicMetadata?.role === 'medical_personnel' ? 'bg-blue-100 text-blue-800' :
                user.publicMetadata?.role === 'pharmacist' ? 'bg-green-100 text-green-800' :
                user.publicMetadata?.role === 'sales_staff' ? 'bg-purple-100 text-purple-800' :
                user.publicMetadata?.role === 'inventory_staff' ? 'bg-orange-100 text-orange-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.publicMetadata?.role === 'admin' ? 'Admin' :
                 user.publicMetadata?.role === 'medical_personnel' ? 'แพทย์' :
                 user.publicMetadata?.role === 'pharmacist' ? 'เภสัชกร' :
                 user.publicMetadata?.role === 'sales_staff' ? 'พนักงานขาย' :
                 user.publicMetadata?.role === 'inventory_staff' ? 'พนักงานคลัง' :
                 user.publicMetadata?.role === 'customer' ? 'ลูกค้า' :
                 user.publicMetadata?.role || 'ไม่ระบุ'}
              </span>
            </p>
            {user.publicMetadata?.isProfessionalApproved && (
              <p><strong>สถานะ:</strong> 
                <span className="ml-2 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                  ได้รับการอนุมัติ
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={() => router.push('/cart')} />
        </UserButton.MenuItems>
        <UserButton.MenuItems>
          <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={() => router.push('/my-orders')} />
        </UserButton.MenuItems>
      </UserButton>
      <p className="mt-8 text-gray-500">* ต้องล็อกอินก่อนจึงจะเห็น UserButton</p>
    </div>
  );
} 