export interface SystemRole {
  id: string
  key: 'admin' | 'teacher' | 'student'
  name: string
  description: string
}

export interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  variables: string[]
}

export interface SystemIntegration {
  id: string
  name: string
  provider: string
  isEnabled: boolean
  config: Record<string, string>
}

export interface SystemConfig {
  platformName: string
  slogan: string
  language: 'vi' | 'en'
  logoUrl: string
  maintenanceMode: boolean
  openRegistration: boolean
  require2FA: boolean
  maxConcurrentSessions: number
  timeoutMinutes: number
  roles: SystemRole[]
  emailTemplates: EmailTemplate[]
  integrations: SystemIntegration[]
  heroTag: string
  heroHeadline: string
  heroSubtitle: string
  heroBgColor: string
  heroImageUrl?: string
}

export const defaultSystemConfig: SystemConfig = {
  platformName: 'Inspiring HR',
  slogan: 'Hệ thống quản trị năng lực và phát triển nhân sự toàn diện',
  language: 'vi',
  logoUrl: 'https://lh3.googleusercontent.com/aida-public/AONM_jQO0sN7M2Bw1hU23y4sN7Rwwg4Vv9wD6sL2H3V9YQnZ6PjCq4A0P2wM4O0zS9qP6E0H2M9Q8P5S8U1T3R',
  maintenanceMode: false,
  openRegistration: false,
  require2FA: true,
  maxConcurrentSessions: 1,
  timeoutMinutes: 30,
  roles: [
    { id: 'r1', key: 'admin', name: 'Admin (Quản trị viên)', description: 'Xem tất cả, tạo/sửa/xóa khóa học, quản lý người dùng, xem báo cáo toàn hệ thống.' },
    { id: 'r2', key: 'teacher', name: 'Giảng viên', description: 'Tạo bài học, upload video, xem dữ liệu báo cáo của học viên trực thuộc.' },
    { id: 'r3', key: 'student', name: 'Học viên', description: 'Xem và tương tác khóa học đã đăng ký, nhận thông báo hệ thống, làm bài test.' }
  ],
  emailTemplates: [
    { id: 'e1', name: 'Đăng ký thành công', subject: 'Chào mừng {{name}} đến với hệ thống Inspiring HR', body: 'Xin chào {{name}},\n\nTài khoản của bạn đã được khởi tạo thành công.\nBạn có thể bắt đầu khám phá các khóa học ngay hôm nay!', variables: ['name', 'email'] },
    { id: 'e2', name: 'Nhắc lịch học', subject: 'Bạn có bài học đang chờ', body: 'Xin chào {{name}},\n\nĐừng quên bài học "{{course_name}}" sắp diễn ra vào {{date}}.\nTheo dõi lịch để không bỏ lỡ.', variables: ['name', 'course_name', 'date'] },
    { id: 'e3', name: 'Reset mật khẩu', subject: 'Yêu cầu thay đổi mật khẩu tài khoản', body: 'Xin chào {{name}},\n\nNếu bạn yêu cầu khôi phục mật khẩu, vui lòng bấm vào link {{reset_url}}.\nLink chỉ có hiệu lực 30 phút.', variables: ['name', 'reset_url'] },
    { id: 'e4', name: 'Thông báo khóa học mới', subject: 'Khóa học mới: {{course_name}} đã ra mắt!', body: 'Xin chào {{name}},\n\nMột khóa học hấp dẫn vừa được ra mắt: {{course_name}}.\nHãy là người đầu tiên trải nghiệm!', variables: ['name', 'course_name', 'course_url'] },
  ],
  integrations: [
    { id: 'i1', name: 'Email (SMTP)', provider: 'SendGrid', isEnabled: true, config: { apiKey: 'SG.************.*****************', smtpPort: '587' } },
    { id: 'i2', name: 'Cổng thanh toán', provider: 'VNPay', isEnabled: false, config: { terminalId: 'VNP*******', secretKey: '************' } },
    { id: 'i3', name: 'Lớp học trực tuyến', provider: 'Zoom / Google Meet', isEnabled: true, config: { clientId: 'zoom-client-****', clientSecret: '******' } },
    { id: 'i4', name: 'Lịch biểu', provider: 'Google Calendar', isEnabled: false, config: { serviceAccount: 'service@****.iam.gserviceaccount.com' } },
    { id: 'i5', name: 'Push Notification', provider: 'Firebase FCM', isEnabled: true, config: { serverKey: 'AAAA*******' } },
  ],
  heroTag: 'INSTITUTIONAL CONTROL',
  heroHeadline: 'Khởi nguồn tăng trưởng, mỗi ngày.',
  heroSubtitle: 'Hệ thống học tập tối ưu hóa năng suất và chuẩn hóa quy trình đào tạo nhân sự cho doanh nghiệp hiện đại.',
  heroBgColor: '#1B4D2E',
  heroImageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxe138vAZERkIg-n7LuWaVBotfcHb_3llc6vUb3QxLyALXfm-t_YzfEJtDjrbidNAOqaIHHN5gFsOxLOjpeOcZfzQe0yGEc6YvZzkvhSBGk0qnb41dEwurtEwpMC2SkPMYNQrlQWg727g_Pr4XwHLStf5VwZ1p4PH84Dtg67EUcsO41azoz9sZDpSd9_EPZoyuNOQRCZuW7LXYsQM6hcjwtdDE55stK5m-y6BgtjOzd2CDwDiFCSN4hmakMl1v0sOPWMIO8n1tats',
}
