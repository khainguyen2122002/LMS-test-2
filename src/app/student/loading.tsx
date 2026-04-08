"use client"

import React from 'react'

export default function StudentLoading() {
  return (
    <div className="space-y-12 animate-pulse max-w-7xl mx-auto">
      {/* Hero Skeleton */}
      <div className="h-64 w-full bg-neutral-200 dark:bg-neutral-800 rounded-[2.5rem]" />

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
        ))}
      </div>

      {/* Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
          <div className="h-96 w-full bg-neutral-200 dark:bg-neutral-800 rounded-3xl" />
        </div>
        <div className="lg:col-span-4 h-96 bg-neutral-200 dark:bg-neutral-800 rounded-3xl" />
      </div>
    </div>
  )
}
