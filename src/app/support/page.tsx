import type { Metadata } from 'next'
import { HeroSearch } from '@/components/support/HeroSearch'
import { FAQAccordion } from '@/components/support/FAQAccordion'
import { TicketList } from '@/components/support/TicketList'
import { ContactPanel } from '@/components/support/ContactPanel'
import { KnowledgeBase } from '@/components/support/KnowledgeBase'

export const metadata: Metadata = {
  title: 'Hỗ trợ & Trợ giúp | Inspiring HR',
  description: 'Trung tâm hỗ trợ - Câu hỏi thường gặp, gửi yêu cầu và hướng dẫn sử dụng Inspiring HR LMS.',
}

export default function SupportPage() {
  return (
    <div className="py-8">
      {/* Hero Search */}
      <HeroSearch />

      {/* Main Content: 2/3 left + 1/3 right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-10 min-w-0">
          <FAQAccordion />
          <TicketList />
        </div>

        {/* Right column: Contact Form */}
        <div className="min-w-0">
          <ContactPanel />
        </div>
      </div>

      {/* Knowledge Base */}
      <KnowledgeBase />

      {/* Decorative blobs */}
      <div className="fixed top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />
    </div>
  )
}
