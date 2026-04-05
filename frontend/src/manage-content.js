import { supabase } from './supabase.js'
import { initTheme, renderThemeSwitcher } from './theme.js'

let currentUser = null

async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        window.location.href = '/login.html'
        return
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

    if (profile.role !== 'admin' && profile.role !== 'instructor') {
        alert('Cần quyền Giảng viên/Admin để soạn nội dung!')
        window.location.href = '/'
        return
    }

    currentUser = profile
    return profile
}

async function loadCourses() {
    const select = document.getElementById('course-select')
    const { data: courses } = await supabase.from('courses').select('id, title')
    
    if (courses) {
        select.innerHTML = '<option value="new">+ Tạo khóa học mới...</option>' + 
            courses.map(c => `<option value="${c.id}">${c.title}</option>`).join('')
    }
}

async function loadMyLessons() {
    const list = document.getElementById('my-lessons-list')
    if (!list) return

    const { data: lessons, error } = await supabase
        .from('lessons')
        .select('*, courses(title, instructor_id)')
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
        return
    }

    if (!lessons || lessons.length === 0) {
        list.innerHTML = '<p class="text-xs text-on-surface-variant italic">Bạn chưa đăng bài giảng nào.</p>'
        return
    }

    list.innerHTML = lessons.map(l => {
        const isOwner = l.courses?.instructor_id === currentUser.id
        const isAdmin = currentUser.role === 'admin'
        const canEdit = isOwner || isAdmin

        return `
            <div class="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10 group ${!canEdit ? 'opacity-60' : ''}">
                <div class="flex justify-between items-start mb-2">
                    <span class="text-[10px] font-bold text-primary uppercase tracking-widest">${l.courses?.title || 'Khóa học'}</span>
                    ${!canEdit ? `
                        <div class="flex items-center gap-1 text-[9px] font-bold text-on-surface-variant uppercase bg-surface-dim px-2 py-1 rounded">
                            <span class="material-symbols-outlined text-[12px]">lock</span> Read Only
                        </div>
                    ` : (isAdmin && !isOwner ? `
                        <div class="flex items-center gap-1 text-[9px] font-bold text-tertiary-fixed-dim uppercase bg-tertiary-fixed-dim/10 px-2 py-1 rounded">
                            <span class="material-symbols-outlined text-[12px]">admin_panel_settings</span> Quản trị viên
                        </div>
                    ` : '')}
                </div>
                <h4 class="font-bold text-sm mb-4">${l.title}</h4>
                <div class="flex gap-4">
                    <button class="flex-1 bg-surface-container-lowest text-on-surface py-2 rounded-lg text-xs font-bold hover:bg-surface-dim transition-all">Xem</button>
                    ${canEdit ? `
                        <button class="flex-1 bg-primary text-on-primary py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-all">Sửa</button>
                        <button onclick="confirmDeleteLesson('${l.id}')" class="p-2 border border-outline-variant/20 rounded-lg text-error hover:bg-red-50 transition-all">
                            <span class="material-symbols-outlined text-sm">delete</span>
                        </button>
                    ` : ''}
                </div>
            </div>
        `
    }).join('')
}

window.confirmDeleteLesson = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa bài giảng này?')) return
    const { error } = await supabase.from('lessons').delete().eq('id', id)
    if (error) alert('Lỗi: ' + error.message)
    else loadMyLessons()
}

// --- FORM HANDLING ---
const form = document.getElementById('manage-course-form')
const courseSelect = document.getElementById('course-select')
const newCourseGroup = document.getElementById('new-course-input-group')

courseSelect.onchange = () => {
    if (courseSelect.value === 'new') {
        newCourseGroup.classList.remove('hidden')
    } else {
        newCourseGroup.classList.add('hidden')
    }
}

form.onsubmit = async (e) => {
    e.preventDefault()
    let courseId = courseSelect.value
    const newCourseTitle = document.getElementById('new-course-title').value.trim()
    const lessonTitle = document.getElementById('lesson-title').value.trim()
    const youtubeUrl = document.getElementById('youtube-url').value.trim()
    const position = document.getElementById('lesson-position').value

    // Tách Video ID
    const videoIdMatch = youtubeUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    const videoId = videoIdMatch ? videoIdMatch[1] : null

    if (!videoId) {
        alert('URL Youtube không hợp lệ!')
        return
    }

    try {
        // 1. Nếu tạo khóa học mới
        if (courseId === 'new') {
            if (!newCourseTitle) return alert('Vui lòng nhập tên khóa học mới!')
            const { data: newCourse, error } = await supabase
                .from('courses')
                .insert({ title: newCourseTitle, instructor_id: currentUser.id })
                .select().single()
            if (error) throw error
            courseId = newCourse.id
        }

        // 2. Kiểm tra quyền sở hữu khóa học nếu chọn khóa học cũ (Ngoại trừ Admin)
        if (courseSelect.value !== 'new' && currentUser.role !== 'admin') {
            const { data: checkC } = await supabase.from('courses').select('instructor_id').eq('id', courseId).single()
            if (checkC.instructor_id !== currentUser.id) {
                return alert('Bạn không có quyền đăng bài cho khóa học này (Chủ sở hữu khác)!')
            }
        }

        // 3. Đăng bài học
        const { error: lError } = await supabase.from('lessons').insert({
            course_id: courseId,
            title: lessonTitle,
            video_url: videoId,
            position: parseInt(position)
        })

        if (lError) throw lError

        alert('Thành công!')
        form.reset()
        newCourseGroup.classList.add('hidden')
        loadCourses()
        loadMyLessons()
    } catch (err) {
        alert('Lỗi: ' + err.message)
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    initTheme()
    renderThemeSwitcher('theme-switcher-container')
    
    if (await checkAuth()) {
        loadCourses()
        loadMyLessons()
    }
})
