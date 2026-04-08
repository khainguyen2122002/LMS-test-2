"use client"

import React from 'react'

export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse p-4">
      {/* Header Skeleton */}
      <div className="flex justify-between items-end">
        <div className="space-y-3">
          <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-10 w-64 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
        <div className="h-12 w-32 bg-neutral-200 dark:bg-neutral-800 rounded-lg" />
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 h-[400px] bg-neutral-200 dark:bg-neutral-800 rounded-3xl" />
        <div className="lg:col-span-4 h-[400px] bg-neutral-200 dark:bg-neutral-800 rounded-3xl" />
      </div>
    </div>
  )
}
