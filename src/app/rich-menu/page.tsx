"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Upload, Trash2, Eye, Plus, RefreshCw, X } from 'lucide-react';

interface RichMenu {
  richMenuId: string;
  name: string;
  chatBarText: string;
  selected: boolean;
  size: {
    width: number;
    height: number;
  };
  areas: Array<{
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    action: {
      type: string;
      uri?: string;
    };
  }>;
}

const RichMenuAdmin = () => {
  const [richMenus, setRichMenus] = useState<RichMenu[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (msg: string, type: 'success' | 'error') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 5000);
  };

  const fetchRichMenus = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/line/rich-menu');
      const data = await response.json();
      
      if (response.ok) {
        setRichMenus(data.richmenus || []);
      } else {
        showMessage(data.error || 'เกิดข้อผิดพลาดในการดึงข้อมูล', 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const uploadImage = async () => {
    if (!selectedImage) {
      showMessage('กรุณาเลือกรูปภาพ Rich Menu', 'error');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      
      const response = await fetch('/api/line/upload-rich-menu-image', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showMessage('อัพโหลดรูปภาพสำเร็จแล้ว!', 'success');
        setSelectedImage(null);
        setShowUploadForm(false);
        createRichMenu();
      } else {
        showMessage(data.error || 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ', 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    } finally {
      setUploading(false);
    }
  };

  const createRichMenu = async () => {
    setCreating(true);
    try {
      const response = await fetch('/api/line/rich-menu', {
        method: 'POST'
      });
      const data = await response.json();
      
      if (response.ok) {
        showMessage('สร้าง Rich Menu สำเร็จแล้ว!', 'success');
        fetchRichMenus();
      } else {
        showMessage(data.error || 'เกิดข้อผิดพลาดในการสร้าง Rich Menu', 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    } finally {
      setCreating(false);
    }
  };

  const deleteRichMenu = async (richMenuId: string) => {
    if (!confirm('คุณต้องการลบ Rich Menu นี้หรือไม่?')) return;

    try {
      const response = await fetch(`/api/line/rich-menu?richMenuId=${richMenuId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (response.ok) {
        showMessage('ลบ Rich Menu สำเร็จแล้ว!', 'success');
        fetchRichMenus();
      } else {
        showMessage(data.error || 'เกิดข้อผิดพลาดในการลบ Rich Menu', 'error');
      }
    } catch (error) {
      showMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ', 'error');
    }
  };

  useEffect(() => {
    fetchRichMenus();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Line Rich Menu Management</h1>
            <div className="flex gap-3">
              <button
                onClick={fetchRichMenus}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                รีเฟรช
              </button>
              <button
                onClick={() => setShowUploadForm(true)}
                disabled={creating}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {creating ? 'กำลังสร้าง...' : 'สร้าง Rich Menu'}
              </button>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              messageType === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {showUploadForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">อัพโหลดรูปภาพ Rich Menu</h2>
                  <button 
                    onClick={() => setShowUploadForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {selectedImage ? (
                      <div>
                        <p className="mb-2 text-sm font-medium text-gray-700">{selectedImage.name}</p>
                        <img 
                          src={URL.createObjectURL(selectedImage)} 
                          alt="Rich Menu Preview" 
                          className="max-h-48 mx-auto"
                        />
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                        >
                          ลบรูปภาพ
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          คลิกเพื่อเลือกรูปภาพ หรือลากและวางรูปภาพที่นี่
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          (ขนาดที่แนะนำ: 2500x1686 พิกเซล)
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                        >
                          เลือกรูปภาพ
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowUploadForm(false)}
                      className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={uploadImage}
                      disabled={!selectedImage || uploading}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {uploading ? 'กำลังอัพโหลด...' : 'อัพโหลดและสร้าง Rich Menu'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">คำแนะนำการใช้งาน:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• ตรวจสอบให้แน่ใจว่าได้ตั้งค่า Environment Variables: LINE_CHANNEL_ACCESS_TOKEN, LIFF_ID_CATEGORIES, LIFF_ID_REGISTER</li>
              <li>• คลิกปุ่ม "สร้าง Rich Menu" เพื่ออัพโหลดรูปภาพ Rich Menu (ขนาดแนะนำ: 2500x1686 พิกเซล)</li>
              <li>• Rich Menu จะถูกตั้งเป็นค่าเริ่มต้นให้ผู้ใช้ทุกคนโดยอัตโนมัติ</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Rich Menus ที่มีอยู่</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">กำลังโหลด...</p>
            </div>
          ) : richMenus.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>ไม่มี Rich Menu</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {richMenus.map((menu) => (
                <div key={menu.richMenuId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{menu.name}</h3>
                      <p className="text-gray-600">Chat Bar Text: {menu.chatBarText}</p>
                      <p className="text-sm text-gray-500">ID: {menu.richMenuId}</p>
                      <p className="text-sm text-gray-500">
                        ขนาด: {menu.size.width}x{menu.size.height} พิกเซล
                      </p>
                      <p className="text-sm text-gray-500">
                        จำนวนปุ่ม: {menu.areas.length} ปุ่ม
                      </p>
                      {menu.selected && (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                          กำลังใช้งาน
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteRichMenu(menu.richMenuId)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        ลบ
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t pt-4">
                    <h4 className="font-medium mb-2">ปุ่มในเมนู:</h4>
                    <div className="grid gap-2">
                      {menu.areas.map((area, index) => (
                        <div key={index} className="text-sm bg-gray-50 p-2 rounded">
                          <p><strong>ปุ่มที่ {index + 1}:</strong></p>
                          <p>ตำแหน่ง: ({area.bounds.x}, {area.bounds.y})</p>
                          <p>ขนาด: {area.bounds.width}x{area.bounds.height}</p>
                          {area.action.uri && (
                            <p>ลิงค์: <a href={area.action.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{area.action.uri}</a></p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RichMenuAdmin;