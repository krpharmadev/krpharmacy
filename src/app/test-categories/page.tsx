"use client"

import React from "react"
import { CategoriesGrid } from "@/components/categories-grid"

export default function TestCategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">หมวดหมู่สินค้า</h1>
      <CategoriesGrid />
    </div>
  )
} 