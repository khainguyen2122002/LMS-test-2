import type { Metadata } from 'next'
import { Upload } from 'lucide-react'
import { LibrarySearchBar } from '@/components/library/LibraryHeader'
import { DocumentGrid } from '@/components/library/DocumentCard'
import { LibrarySidebar } from '@/components/library/LibrarySidebar'

export const metadata: Metadata = {
  title: 'Thư viện | Inspiring HR',
  description: 'Tập hợp công văn, nghị định, thông báo và tài liệu chính thức dành riêng cho hệ thống Inspiring HR.',
}

export default function LibraryPage() {
  return (
    <div className="py-8">
      {/* Page Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight dark:text-white light:text-neutral-900 mb-3">Thư viện</h2>
          <p className="dark:text-neutral-400 light:text-neutral-500 text-lg leading-relaxed">
            Tập hợp công văn, nghị định, thông báo và tài liệu chính thức dành riêng cho hệ thống Inspiring HR.
          </p>
        </div>
        <button
          className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #ffb957 0%, #dc9000 100%)', color: '#2a1800' }}
        >
          <Upload size={17} />
          Tải lên tài liệu mới
        </button>
      </div>

      {/* Search + Filters */}
      <LibrarySearchBar />

      {/* Grid layout: 8 cols docs + 4 cols sidebar */}
      <div className="grid grid-cols-12 gap-8 items-start">
        {/* Document grid (70%) */}
        <div className="col-span-12 lg:col-span-8 min-w-0">
          <DocumentGrid />
        </div>

        {/* Right Sidebar (30%) */}
        <div className="col-span-12 lg:col-span-4 min-w-0">
          <LibrarySidebar />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 pt-8 border-t border-[var(--border)]">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-neutral-600 text-xs font-medium">
          <p>© 2025 Inspiring HR Portal. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6 uppercase tracking-widest">
            {['Điều khoản', 'Bảo mật', 'Liên hệ'].map((t) => (
              <a key={t} href="#" className="hover:text-emerald-400 transition-colors">{t}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}
