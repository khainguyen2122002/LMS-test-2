import { supabase } from './supabase.js'
import { initTheme, renderThemeSwitcher } from './theme.js'

// Từ điển đa ngôn ngữ
const translations = {
  vn: {
    nav_home: 'Trang chủ',
    nav_courses: 'Khóa học',
    nav_library: 'Thư viện',
    nav_dashboard: 'Bảng điều khiển',
    login_btn: 'Đăng nhập',
    my_courses: 'Khóa học của tôi',
    profile: 'Trang cá nhân',
    logout: 'Đăng xuất',
    role_learner: 'Học viên',
    hero_title: 'Khởi nguồn tăng trưởng, mỗi ngày.',
    hero_desc: 'Quản trị thời gian thực chuyên biệt cho chuyên gia nhân sự và các đội ngũ xử lý hồ sơ cao cấp.',
    active_curriculums: 'Giáo trình đang học',
    all_courses: 'Tất cả khóa học',
    workflow_tools: 'Công cụ quy trình',
    create_course: 'Tạo khóa học',
    generate_report: 'Tạo báo cáo',
    invite_users: 'Mời thành viên',
    review_assets: 'Duyệt tài liệu',
    system_health: 'Trạng thái hệ thống',
    recent_activity: 'Hoạt động gần đây',
    admin_desc: 'Quản trị hệ thống',
    nav_users: 'Quản lý người dùng',
    nav_analytics: 'Phân tích',
    admin_terminal: 'Trung tâm điều hành',
    admin_title: 'Bảng điều khiển Quản trị',
    student_mgt: 'Quản lý học viên',
    student_mgt_desc: 'Quản lý học viên và phân quyền hệ thống',
    add_student: 'Thêm học viên mới',
    th_name: 'Tên học viên',
    th_role: 'Vai trò',
    th_date: 'Ngày tham gia',
    th_action: 'Thao tác',
    create_course_title: 'Tạo khóa học mới',
    label_course_name: 'Tên khóa học',
    label_lesson_title: 'Tên bài học',
    publish_btn: 'Đăng bài học',
    resource_mgt: 'Quản lý tài nguyên',
    resource_mgt_desc: 'Thêm tài liệu tham khảo cho bài giảng',
    attach_btn: 'Đính kèm tài nguyên',
    grading_title: 'Chấm điểm bài tập',
    grading_desc: 'Chấm điểm bài tập và cập nhật trạng thái',
    change_role: 'Đổi vai trò',
    pending: 'Chờ duyệt',
    graded: 'Đã chấm',
    open_link: 'Mở link',
    mark_graded: 'Xác nhận chấm'
  },
  en: {
    nav_home: 'Home',
    nav_courses: 'Courses',
    nav_library: 'Library',
    nav_dashboard: 'Dashboard',
    login_btn: 'Login',
    my_courses: 'My Courses',
    profile: 'Profile',
    logout: 'Sign Out',
    role_learner: 'Learner',
    hero_title: 'Inspiring Growth, Daily.',
    hero_desc: 'Real-time management for HR professionals and high-stakes document processing teams.',
    active_curriculums: 'Active Curriculums',
    all_courses: 'All Courses',
    workflow_tools: 'Workflow Tools',
    create_course: 'Create Course',
    generate_report: 'Generate Report',
    invite_users: 'Invite Users',
    review_assets: 'Review Assets',
    system_health: 'System Health',
    recent_activity: 'Recent Activity',
    admin_desc: 'Institutional Control',
    nav_users: 'User Management',
    nav_analytics: 'Analytics',
    admin_terminal: 'Administrative Terminal',
    admin_title: 'Academic Atelier Dashboard',
    student_mgt: 'Student Management',
    student_mgt_desc: 'Manage learners and permissions',
    add_student: 'Add New Student',
    th_name: 'Student Name',
    th_role: 'Current Role',
    th_date: 'Enrolled Since',
    th_action: 'Actions',
    create_course_title: 'Create New Course',
    label_course_name: 'Course Name',
    label_lesson_title: 'Lesson Title',
    publish_btn: 'Publish Lesson',
    resource_mgt: 'Resource Manager',
    resource_mgt_desc: 'Add reference documents',
    attach_btn: 'Attach Resource',
    grading_title: 'Assignment Grading',
    grading_desc: 'Grade assignments and update status',
    change_role: 'Change Role',
    pending: 'Pending',
    graded: 'Graded',
    open_link: 'Open Link',
    mark_graded: 'Mark Graded'
  }
}

/**
 * Hàm chuyển đổi ngôn ngữ
 */
function setLanguage(lang) {
  localStorage.setItem('lang', lang)
  document.getElementById('current-lang-text').innerText = lang.toUpperCase()
  
  // Cập nhật tất cả các phần tử có thuộc tính data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (translations[lang][key]) {
      // Nếu là input placeholder
      if (el.tagName === 'INPUT' && el.placeholder) {
        el.placeholder = translations[lang][key]
      } else {
        el.innerText = translations[lang][key]
      }
    }
  })
}

// Khởi tạo ngôn ngữ & Theme (Mặc định VN, System)
const savedLang = localStorage.getItem('lang') || 'vn'
initTheme()

document.addEventListener('DOMContentLoaded', () => {
  setLanguage(savedLang)
  
  // Lắng nghe sự kiện click chọn ngôn ngữ
  document.querySelectorAll('.lang-select').forEach(btn => {
    btn.onclick = (e) => {
      const selectedLang = e.target.getAttribute('data-lang')
      setLanguage(selectedLang)
    }
  })
})

const authContainer = document.getElementById('auth-header-container')
const loginForm = document.getElementById('login-form')
const googleLoginBtn = document.getElementById('google-login')

/**
 * Hiển thị giao diện Header dựa trên trạng thái đăng nhập
 */
async function updateAuthUI(user) {
  if (!authContainer) return

  if (user) {
    // Lấy role thực tế từ database
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    
    // Hiển thị các mục admin-only
    document.querySelectorAll('.admin-only').forEach(el => {
      if (isAdmin) {
        el.classList.remove('hidden')
        el.classList.add('flex')
      } else {
        el.classList.add('hidden')
        el.classList.remove('flex')
      }
    })

    // Hiện Theme Switcher, Avatar + Dropdown
    authContainer.innerHTML = `
      <div class="flex items-center gap-4">
        <div id="theme-switcher-container"></div>
        <div class="relative group" id="user-menu-container">
        <button class="flex items-center gap-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-card transition-all border border-transparent hover:border-accent/30" id="user-avatar-btn">
          <div class="w-8 h-8 rounded-full overflow-hidden border-2 border-accent">
            <img src="${user.user_metadata?.avatar_url || 'https://via.placeholder.com/150'}" alt="Avatar" class="w-full h-full object-cover">
          </div>
          <div class="hidden lg:block text-left mr-2">
            <p class="text-[10px] font-bold text-primary dark:text-white uppercase leading-none">${user.user_metadata?.full_name || 'User'}</p>
            <p class="text-[9px] text-gray-500 uppercase tracking-tighter" data-i18n="role_learner">Học viên</p>
          </div>
          <span class="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
        </button>
        
        <!-- Dropdown Menu -->
        <div id="user-dropdown" class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-2xl shadow-xl opacity-0 invisible transition-all z-50 overflow-hidden">
          <div class="py-2">
            <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/20 transition-colors">
              <span class="material-symbols-outlined text-lg">auto_stories</span>
              <span data-i18n="my_courses">Khóa học của tôi</span>
            </a>
            <a href="#" class="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-primary/20 transition-colors">
              <span class="material-symbols-outlined text-lg">person</span>
              <span data-i18n="profile">Trang cá nhân</span>
            </a>
            <div class="h-[1px] bg-gray-100 dark:bg-dark-border my-1"></div>
            <button id="sign-out-btn" class="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <span class="material-symbols-outlined text-lg">logout</span>
              <span data-i18n="logout">Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    `
    // Sau khi cập nhật innerHTML, cần chạy lại setLanguage để dịch các phần tử mới chèn vào
    setLanguage(localStorage.getItem('lang') || 'vn')

    // Xử lý toggle Dropdown
    const avatarBtn = document.getElementById('user-avatar-btn')
    const dropdown = document.getElementById('user-dropdown')
    if (avatarBtn && dropdown) {
      avatarBtn.onclick = (e) => {
        e.stopPropagation()
        dropdown.classList.toggle('opacity-0')
        dropdown.classList.toggle('invisible')
      }
      // Đóng khi click ngoài
      document.addEventListener('click', () => {
        dropdown.classList.add('opacity-0')
        dropdown.classList.add('invisible')
      })
    }

    // Xử lý Đăng xuất
    const signOutBtn = document.getElementById('sign-out-btn')
    if (signOutBtn) {
      signOutBtn.onclick = async () => {
        await supabase.auth.signOut()
        window.location.href = '/'
      }
    }
  } else {
    // Chưa đăng nhập: Hiện nút Login + Theme Switcher
    authContainer.innerHTML = `
      <div class="flex items-center gap-4">
        <div id="theme-switcher-container"></div>
        <a href="/login.html" class="px-6 py-2 bg-primary dark:bg-accent text-white dark:text-black text-xs font-bold uppercase rounded-full hover:opacity-90 transition-all editorial-shadow flex items-center gap-2">
        <span class="material-symbols-outlined text-sm">login</span>
        <span data-i18n="login_btn">Đăng nhập</span>
      </a>
    `
    setLanguage(localStorage.getItem('lang') || 'vn')
    renderThemeSwitcher('theme-switcher-container')
  }
}

// ---------------------------------------------------------
// LOGIC XỬ LÝ TRANG LOGIN (Nếu đang ở login.html)
// ---------------------------------------------------------

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
      return
    }
    window.location.href = '/'
  })
}

if (googleLoginBtn) {
  googleLoginBtn.addEventListener('click', async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  })
}

// --- DASHBOARD DATA ---
async function loadDashboardCourses() {
    const container = document.getElementById('courses-container')
    if (!container) return

    // Lấy khóa học kèm theo bài học đầu tiên của nó
    const { data: courses, error } = await supabase
        .from('courses')
        .select(`
            *,
            lessons(id)
        `)
        .order('created_at', { ascending: false })

    if (error || !courses) {
        console.error('Error fetching courses:', error)
        return
    }

    if (courses.length === 0) {
        container.innerHTML = `
            <div class="p-12 text-center bg-gray-50 dark:bg-dark-bg rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-border">
                <p class="text-gray-400 italic">Chưa có khóa học nào được xuất bản.</p>
            </div>
        `
        return
    }

    container.innerHTML = courses.map(course => {
        const firstLessonId = course.lessons?.[0]?.id
        const link = firstLessonId ? `/lesson.html?id=${firstLessonId}` : '#'
        
        return `
            <div class="group flex items-center justify-between p-4 bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border hover:shadow-lg transition-all cursor-pointer" onclick="window.location.href='${link}'">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-accent">
                        <span class="material-symbols-outlined">school</span>
                    </div>
                    <div>
                        <h4 class="font-bold text-sm text-primary dark:text-white group-hover:text-accent transition-colors">${course.title}</h4>
                        <p class="text-[10px] text-gray-500 uppercase tracking-widest">${course.lessons?.length || 0} Lessons</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="hidden sm:block text-right">
                        <div class="h-1 w-24 bg-gray-100 dark:bg-dark-bg rounded-full overflow-hidden">
                            <div class="h-full bg-accent" style="width: 0%"></div>
                        </div>
                        <p class="text-[8px] font-bold text-gray-400 mt-1 uppercase">0% Complete</p>
                    </div>
                    <span class="material-symbols-outlined text-gray-300 group-hover:text-accent transition-colors">chevron_right</span>
                </div>
            </div>
        `
    }).join('')
}

// ---------------------------------------------------------
// THEO DÕI TRẠNG THÁI AUTH
// ---------------------------------------------------------

// Kiểm tra session khi load trang
supabase.auth.onAuthStateChange((event, session) => {
  updateAuthUI(session?.user || null)
  if (session) loadDashboardCourses()
})

// Kiểm tra session ban đầu
supabase.auth.getSession().then(({ data: { session } }) => {
  updateAuthUI(session?.user || null)
  if (session) loadDashboardCourses()
})
