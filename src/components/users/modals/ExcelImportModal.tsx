"use client"

import React, { useRef, useState } from 'react'
import { X, UploadCloud, FileSpreadsheet, Download, AlertCircle } from 'lucide-react'
import { useUsers } from '@/components/users/UserProvider'
import { toast } from 'sonner'
import * as XLSX from 'xlsx'
import type { UserRole, UserStatus } from '@/lib/user-service'

interface ExcelImportModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({ isOpen, onClose }) => {
  const { addManyUsers } = useUsers()
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      ['Họ và tên', 'Email', 'Vai trò', 'Trạng thái'],
      ['Nguyễn Văn Mẫu', 'mau.nv@ví-dụ.com', 'Học viên', 'Hoạt động'],
      ['Trần Thị Test', 'test@ví-dụ.com', 'Giảng viên', 'Hoạt động']
    ])
    
    // Add some simple column widths
    ws['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 15 }]
    
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template')
    XLSX.writeFile(wb, 'Template_Nhap_Nguoi_Dung.xlsx')
  }

  const handleFileProcess = (file: File) => {
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      toast.error('Định dạng file không hỗ trợ. Vui lòng tải lên file Excel (.xlsx)')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        const workbook = XLSX.read(data, { type: 'binary' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const json = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 })
        
        // Skip header
        const rows = json.slice(1)
        
        const newUsers: any[] = []
        let errors = 0

        rows.forEach((row, index) => {
          if (!row.length) return // empty row
          
          const fullName = row[0]
          const email = row[1]
          const roleRaw = row[2] as string
          const status = row[3] as UserStatus

          const roleMap: Record<string, UserRole> = {
            'Học viên': 'learner',
            'Giảng viên': 'instructor',
            'Admin': 'admin'
          }
          const role = roleMap[roleRaw] || 'learner'
          
          if (!fullName || !email) {
            errors++
            return
          }

          newUsers.push({
            fullName,
            email,
            role,
            status: ['Hoạt động', 'Ngừng hoạt động'].includes(status) ? status : 'Hoạt động',
            joinDate: new Date().toLocaleDateString('vi-VN'),
            coursesCount: 0
          })
        })

        if (newUsers.length > 0) {
          addManyUsers(newUsers)
          toast.success(`Đã thêm thành công ${newUsers.length} người dùng!`)
          if (errors > 0) {
            toast.warning(`Bỏ qua ${errors} dòng không hợp lệ (thiếu Tên hoặc Email).`)
          }
          onClose()
        } else {
          toast.error('Không tìm thấy dữ liệu hợp lệ trong file.')
        }

      } catch (err) {
        toast.error('Có lỗi xảy ra khi đọc file Excel!')
        console.error(err)
      }
    }
    reader.readAsBinaryString(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="dark:bg-[#1c1b1b] light:bg-white border border-[var(--border)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 flex justify-between items-center border-b border-[var(--border)]">
          <h2 className="text-lg font-bold dark:text-white light:text-neutral-900">Nhập từ Excel</h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-lg text-neutral-400 hover:dark:bg-[#2a2a2a] light:hover:bg-neutral-100 hover:text-neutral-800 dark:hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <button
            onClick={handleDownloadTemplate}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-dashed border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-500">
                <FileSpreadsheet size={20} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold dark:text-white light:text-neutral-900">File mẫu chuẩn</p>
                <p className="text-xs text-neutral-500 mt-0.5">Tải template để nhập liệu</p>
              </div>
            </div>
            <Download size={18} className="text-emerald-500 group-hover:scale-110 transition-transform" />
          </button>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragActive(true) }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors ${
              isDragActive 
                ? 'border-[#F9A825] bg-[#F9A825]/5' 
                : 'border-[var(--border)] hover:border-emerald-500/50 bg-[var(--input-bg)]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleFileProcess(e.target.files[0])}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <div className={`p-4 rounded-full mb-3 shadow-lg ${isDragActive ? 'bg-[#F9A825]/20 text-[#F9A825]' : 'bg-white/5 text-neutral-400'}`}>
              <UploadCloud size={32} />
            </div>
            <p className="text-sm font-bold dark:text-white light:text-neutral-900 mb-1">
              {isDragActive ? 'Thả file vào đây' : 'Kéo thả file hoặc Click để tải lên'}
            </p>
            <p className="text-xs text-neutral-500">Hỗ trợ định dạng: .xlsx, .xls</p>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs">
            <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
            <p className="font-medium leading-relaxed">
              Lưu ý: Dữ liệu tải lên phải tuân thủ đúng cấu trúc cột của File mẫu để tránh lỗi hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
