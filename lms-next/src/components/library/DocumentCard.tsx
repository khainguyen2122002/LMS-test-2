"use client"

import React from 'react'
import { Eye, Download, FileText, FileEdit, Megaphone, ShieldCheck } from 'lucide-react'

export interface Document {
  id: string
  title: string
  description: string
  iconType: 'pdf' | 'article' | 'policy' | 'notice'
  reference: string
  issuedDate: string
  docType: string
  signedBy: string
  isNew?: boolean
}

const ICON_MAP = {
  pdf:     { icon: FileText,    bg: 'bg-emerald-900/30', color: 'text-emerald-400' },
  article: { icon: FileEdit,    bg: 'bg-emerald-900/30', color: 'text-emerald-400' },
  policy:  { icon: ShieldCheck, bg: 'bg-emerald-900/30', color: 'text-emerald-400' },
  notice:  { icon: Megaphone,   bg: 'bg-emerald-900/30', color: 'text-emerald-400' },
}

const DOCUMENTS: Document[] = [
  {
    id: '1', iconType: 'article', isNew: true,
    title: 'Nghị định 123/2024/NĐ-CP về tiền lương và trợ cấp',
    description: 'Hướng dẫn chi tiết về việc điều chỉnh mức lương tối thiểu vùng và các khoản phụ cấp độc hại mới áp dụng cho doanh nghiệp FDI.',
    reference: '123/2024/NĐ-CP', issuedDate: '15/01/2025', docType: 'Nghị định', signedBy: 'Phạm Minh Chính',
  },
  {
    id: '2', iconType: 'pdf', isNew: true,
    title: 'Công văn 456/LĐTBXH về bảo hiểm xã hội',
    description: 'Hướng dẫn thủ tục gộp sổ bảo hiểm xã hội và quy trình giải quyết chế độ thai sản mới nhất cho người lao động tại TP.HCM.',
    reference: '456/2024/LĐTBXH', issuedDate: '20/12/2024', docType: 'Công văn', signedBy: 'Đào Ngọc Dung',
  },
  {
    id: '3', iconType: 'policy',
    title: 'Quy định 10/2025/QĐ-HR về đạo đức nghề nghiệp',
    description: 'Cập nhật bộ quy tắc ứng xử nội bộ, bảo mật thông tin và quản lý tài sản số dành cho nhân viên Inspiring HR.',
    reference: '10/2025/QĐ-HR', issuedDate: '02/01/2025', docType: 'Quy định', signedBy: 'Ban Giám Đốc',
  },
  {
    id: '4', iconType: 'notice',
    title: 'Thông báo 05/TB-HR về lịch nghỉ lễ 2025',
    description: 'Chi tiết lịch nghỉ Tết Nguyên Đán, Giỗ Tổ Hùng Vương và lễ 30/4 – 1/5 áp dụng cho toàn bộ hệ thống chi nhánh.',
    reference: '05/TB-HR', issuedDate: '10/01/2025', docType: 'Thông báo', signedBy: 'Phòng Nhân sự',
  },
]

const META = [
  { key: 'reference', label: 'Số hiệu' },
  { key: 'issuedDate', label: 'Ngày ban hành' },
  { key: 'docType', label: 'Loại văn bản' },
  { key: 'signedBy', label: 'Người ký' },
] as const

const DocumentCard: React.FC<{ doc: Document }> = ({ doc }) => {
  const style = ICON_MAP[doc.iconType]
  return (
    <article className="dark:bg-[#201f1f] light:bg-white p-6 rounded-2xl group border border-transparent hover:border-emerald-500/10 transition-all flex flex-col h-full min-w-0">
      {/* Icon + Badge */}
      <div className="flex justify-between items-start mb-5">
        <div className={`w-12 h-12 ${style.bg} rounded-xl flex items-center justify-center`}>
          <style.icon size={24} className={style.color} />
        </div>
        {doc.isNew && (
          <span className="bg-amber-500/10 text-amber-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-amber-500/20">
            Mới
          </span>
        )}
      </div>

      {/* Title + Desc */}
      <h3 className="text-lg font-bold dark:text-white light:text-neutral-900 mb-2 leading-snug group-hover:text-emerald-400 transition-colors">
        {doc.title}
      </h3>
      <p className="text-neutral-500 text-sm line-clamp-2 mb-5 leading-relaxed">{doc.description}</p>

      {/* Metadata grid */}
      <div className="mt-auto">
        <div className="grid grid-cols-2 gap-y-2 text-[11px] mb-4 border-t border-[var(--border)] pt-4">
          {META.map(({ key, label }) => (
            <React.Fragment key={key}>
              <span className="text-neutral-600 uppercase tracking-wider font-semibold">{label}</span>
              <span className="dark:text-white light:text-neutral-900 font-medium">{doc[key]}</span>
            </React.Fragment>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 py-2.5 px-4 dark:bg-[#2a2a2a] light:bg-neutral-100 hover:bg-[#1B4D2E] hover:text-emerald-300 transition-colors rounded-xl text-sm font-medium dark:text-neutral-300 light:text-neutral-600 flex items-center justify-center gap-2">
            <Eye size={16} /> Xem chi tiết
          </button>
          <button className="py-2.5 px-4 bg-emerald-800/50 text-emerald-400 hover:bg-emerald-700/60 hover:text-emerald-200 transition-all rounded-xl flex items-center justify-center">
            <Download size={16} />
          </button>
        </div>
      </div>
    </article>
  )
}

export const DocumentGrid: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {DOCUMENTS.map((doc) => (
      <DocumentCard key={doc.id} doc={doc} />
    ))}
  </div>
)
