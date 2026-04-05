import { supabase } from './supabase.js'
import { initTheme, renderThemeSwitcher } from './theme.js'
import { initAssignment } from './assignment.js'

let currentUserId = null
let currentRole = 'learner'
let currentLessonId = null
let currentCourseId = null

// --- AUTH & ROLE INFO ---
async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    window.location.href = '/login.html'
    return
  }
  currentUserId = session.user.id

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, avatar_url')
    .eq('id', currentUserId)
    .single()

  currentRole = profile?.role || 'learner'

  // Update Header UI
  const headerInfo = document.getElementById('user-header-info')
    if (headerInfo) {
      headerInfo.innerHTML = `
        <div class="flex items-center gap-4">
          <div id="theme-switcher-container"></div>
          <div class="hidden md:block">
            <span class="text-sm font-medium text-on-surface-variant mr-4">Chào mừng, ${profile?.full_name || 'Học viên'}</span>
          </div>
          <img src="${profile?.avatar_url || 'https://via.placeholder.com/150'}" class="w-10 h-10 rounded-full object-cover border-2 border-primary-container cursor-pointer" onclick="window.location.href='/admin.html'">
        </div>
      `
    }

  // Adjust Role UI
  const adminOnly = document.querySelectorAll('.admin-instructor-only')
  const studentOnly = document.querySelectorAll('.student-only')

  if (currentRole === 'admin' || currentRole === 'instructor') {
    adminOnly.forEach(el => el.classList.remove('hidden'))
    studentOnly.forEach(el => el.classList.add('hidden'))
  } else {
    adminOnly.forEach(el => el.classList.add('hidden'))
    studentOnly.forEach(el => el.classList.remove('hidden'))
  }
}

// --- TAB SYSTEM ---
function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn')
  const panels = document.querySelectorAll('.tab-panel')

  tabs.forEach(tab => {
    tab.onclick = () => {
      const target = tab.getAttribute('data-tab')
      
      // Update Tab Styles
      tabs.forEach(t => {
        t.classList.remove('text-[#1B4D2E]', 'font-bold')
        t.classList.add('text-on-surface-variant', 'font-medium')
        const indicator = t.querySelector('.active-tab-indicator')
        if (indicator) indicator.classList.add('hidden')
      })
      
      tab.classList.add('text-[#1B4D2E]', 'font-bold')
      tab.classList.remove('text-on-surface-variant', 'font-medium')
      const activeIndicator = tab.querySelector('.active-tab-indicator')
      if (activeIndicator) activeIndicator.classList.remove('hidden')

      // Update Panels
      panels.forEach(p => p.classList.add('hidden'))
      const targetPanel = document.getElementById(`panel-${target}`)
      if (targetPanel) {
        targetPanel.classList.remove('hidden')
        // Tải bài tập nếu chuyển sang tab assignment
        if (target === 'assignment' && currentLessonId && currentUserId) {
          // fetch lại lesson hoặc dùng biến toàn cục nếu có
          loadAssignmentTab()
        }
      }
    }
  })
}

async function loadAssignmentTab() {
    const { data: lesson } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', currentLessonId)
        .single()
    
    if (lesson) {
        initAssignment(lesson, currentUserId)
    }
}

// --- DATA LOADING ---
async function loadLessonData() {
  const urlParams = new URLSearchParams(window.location.search)
  currentLessonId = urlParams.get('id')

  if (!currentLessonId) {
    alert('Không tìm thấy bài học!')
    window.location.href = '/'
    return
  }

  // Fetch lesson and course details
  const { data: lesson, error } = await supabase
    .from('lessons')
    .select(`
      *,
      courses (
        id,
        title,
        instructor_id,
        profiles!courses_instructor_id_fkey (full_name, avatar_url, role)
      )
    `)
    .eq('id', currentLessonId)
    .single()

  if (error || !lesson) {
    console.error('Error fetching lesson:', error)
    return
  }

  currentCourseId = lesson.courses.id
  document.getElementById('lesson-title').innerText = lesson.title
  document.getElementById('lesson-content').innerText = lesson.content || 'Nội dung bài học đang được cập nhật.'
  document.getElementById('course-title').innerText = lesson.courses.title

  // Embed YouTube
  const videoContainer = document.getElementById('video-container')
  if (videoContainer) {
    videoContainer.innerHTML = `
      <iframe class="w-full h-full" src="https://www.youtube.com/embed/${lesson.video_url}?autoplay=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    `
  }

  // Instructor Info
  const inst = lesson.courses.profiles
  const instCard = document.getElementById('instructor-card')
  if (instCard) {
      instCard.innerHTML = `
        <h3 class="text-xs font-bold uppercase tracking-widest text-on-tertiary-container mb-4">Giảng viên</h3>
        <div class="flex items-center gap-4">
            <img src="${inst?.avatar_url || 'https://via.placeholder.com/150'}" class="w-14 h-14 rounded-full object-cover">
            <div>
                <p class="font-bold text-on-surface">${inst?.full_name || 'Chưa cập nhật'}</p>
                <p class="text-xs text-on-surface-variant">Giảng viên hướng dẫn</p>
            </div>
        </div>
      `
  }

  loadCourseLessons()
}

async function loadCourseLessons() {
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, video_url, content_type')
    .eq('course_id', currentCourseId)
    .order('created_at', { ascending: true })

  const listContainer = document.getElementById('lesson-sidebar-list')
  if (listContainer && lessons) {
    listContainer.innerHTML = lessons.map((l, index) => {
        const isActive = l.id === currentLessonId
        return `
            <div onclick="window.location.href='/lesson.html?id=${l.id}'" class="flex items-center gap-4 p-4 rounded-lg transition-all group cursor-pointer mb-1 ${isActive ? 'bg-white shadow-sm ring-1 ring-tertiary-fixed-dim/30 border-l-4 border-tertiary-fixed-dim' : 'bg-surface-container-lowest/40 hover:bg-surface-container-lowest'}">
                <div class="flex-shrink-0 w-8 h-8 rounded-full ${isActive ? 'bg-tertiary-fixed-dim' : 'bg-surface-container-high'} flex items-center justify-center text-outline">
                    <span class="material-symbols-outlined text-sm ${isActive ? 'text-on-tertiary-fixed' : ''}" style="${isActive ? "font-variation-settings: 'FILL' 1;" : ''}">
                        ${isActive ? 'play_circle' : 'play_arrow'}
                    </span>
                </div>
                <div class="flex-1">
                    <p class="text-sm ${isActive ? 'font-extrabold text-primary' : 'font-semibold text-on-surface-variant group-hover:text-primary transition-colors'}">
                        ${index + 1}. ${l.title}
                    </p>
                    <p class="text-[10px] ${isActive ? 'text-primary/60 font-bold' : 'text-outline font-medium'} uppercase tracking-tighter">
                        ${isActive ? 'ĐANG HỌC' : 'VIDEO'}
                    </p>
                </div>
            </div>
        `
    }).join('')

    // Update Progress (Simulated based on index)
    const progress = Math.round(((lessons.findIndex(l => l.id === currentLessonId) + 1) / lessons.length) * 100)
    document.getElementById('progress-bar').style.width = `${progress}%`
    document.getElementById('progress-text').innerText = `${progress}% Hoàn thành`
  }
}

// --- ASSIGNMENT SUBMISSION ---
const submitBtn = document.getElementById('submit-assignment-btn')
if (submitBtn) {
    submitBtn.onclick = async () => {
        const urlInput = document.getElementById('assignment-url')
        const fileUrl = urlInput.value.trim()

        if (!fileUrl) {
            alert('Vui lòng nhập đường dẫn bài làm!')
            return
        }

        const { error } = await supabase
            .from('assignments')
            .upsert({
                user_id: currentUserId,
                lesson_id: currentLessonId,
                file_url: fileUrl,
                file_name: 'Bài tập của ' + (document.getElementById('user-header-info')?.innerText?.split(',')[1]?.trim() || 'Học viên'),
                status: 'pending'
            })

        if (error) {
            alert('Lỗi nộp bài: ' + error.message)
        } else {
            alert('Nộp bài thành công!')
            urlInput.value = ''
        }
    }
}

// --- INITIALIZE ---
document.addEventListener('DOMContentLoaded', async () => {
  initTheme()
  await initAuth()
  initTabs()
  loadLessonData()
  renderThemeSwitcher('theme-switcher-container')
})
