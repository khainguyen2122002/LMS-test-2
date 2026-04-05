import { supabase } from './supabase.js'
import { initTheme, renderThemeSwitcher } from './theme.js'

// --- AUTH CHECK ---
async function checkAdmin() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        window.location.href = '/login.html'
        return
    }

    const { data: profile, error } = await supabase
        .from('profiles')
        .select('role, avatar_url, full_name, id')
        .eq('id', session.user.id)
        .single()

    if (error || (profile.role !== 'admin' && profile.role !== 'instructor')) {
        alert('Bạn không có quyền truy cập trang này!')
        window.location.href = '/'
        return
    }

    // Update Admin UI
    const adminAvatar = document.getElementById('admin-avatar')
    if (adminAvatar) adminAvatar.src = profile.avatar_url || 'https://via.placeholder.com/150'
    
    return profile
}

// --- STUDENT MANAGEMENT ---
async function loadStudents() {
    const tbody = document.getElementById('student-tbody')
    if (!tbody) return

    const { data: students, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching students:', error)
        return
    }

    tbody.innerHTML = students.map(student => `
        <tr class="hover:bg-surface-container-low transition-colors">
            <td class="py-5 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container">
                    ${student.full_name?.charAt(0) || 'U'}
                </div>
                <div>
                    <div class="font-semibold text-sm">${student.full_name || 'Học viên'}</div>
                    <div class="text-[10px] text-on-surface-variant">${student.email || ''}</div>
                </div>
            </td>
            <td class="py-5 text-sm font-medium">
                ${student.department || '<span class="opacity-30 italic">Chưa cập nhật</span>'}
            </td>
            <td class="py-5">
                <span class="px-3 py-1 rounded-full text-[10px] font-bold ${
                    student.role === 'admin' ? 'bg-tertiary-fixed-dim text-on-tertiary-fixed' : 
                    student.role === 'instructor' ? 'bg-primary-container text-on-primary-container' : 
                    'bg-secondary-container text-on-secondary-container'
                }">
                    ${student.role.toUpperCase()}
                </span>
            </td>
            <td class="py-5 text-sm text-on-surface-variant">
                ${new Date(student.created_at).toLocaleDateString('vi-VN')}
            </td>
            <td class="py-5 text-right flex gap-3 justify-end items-center">
                <button onclick="editDepartment('${student.id}', '${student.department || ''}')" class="text-on-surface-variant hover:text-primary p-1 rounded-lg hover:bg-surface-container-high transition-all">
                    <span class="material-symbols-outlined text-sm">domain</span>
                </button>
                <button onclick="changeUserRole('${student.id}', '${student.role}')" class="text-primary hover:text-tertiary-fixed-dim font-bold text-xs uppercase tracking-tighter underline">Đổi vai trò</button>
            </td>
        </tr>
    `).join('')
}

window.editDepartment = async (userId, currentDept) => {
    const newDept = prompt('Nhập tên phòng ban mới:', currentDept)
    if (newDept === null) return

    const { error } = await supabase
        .from('profiles')
        .update({ department: newDept })
        .eq('id', userId)

    if (error) alert('Lỗi: ' + error.message)
    else loadStudents()
}

window.changeUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'learner' ? 'instructor' : currentRole === 'instructor' ? 'admin' : 'learner'
    if (!confirm(`Bạn muốn đổi vai trò của người dùng này sang ${newRole.toUpperCase()}?`)) return

    const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    if (error) alert('Lỗi: ' + error.message)
    else loadStudents()
}

// --- COURSE OVERVIEW WIDGET ---
async function loadCourseOverview() {
    const container = document.getElementById('course-overview-list')
    if (!container) return

    const { data: courses, error } = await supabase
        .from('courses')
        .select(`
            id, 
            title, 
            lessons(id),
            enrollments(id)
        `)

    if (error) {
        console.error('Lỗi tải tổng quan khóa học:', error)
        return
    }

    if (!courses || courses.length === 0) {
        container.innerHTML = '<p class="text-xs text-on-surface-variant italic">Chưa có khóa học nào.</p>'
        return
    }

    container.innerHTML = courses.map(c => `
        <div class="p-4 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <h4 class="font-bold text-sm mb-3">${c.title}</h4>
            <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-xs text-on-surface-variant">menu_book</span>
                    <span class="text-[11px] font-bold text-on-surface-variant">${c.lessons?.length || 0} bài học</span>
                </div>
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-xs text-on-surface-variant">group</span>
                    <span class="text-[11px] font-bold text-on-surface-variant">${c.enrollments?.length || 0} nhân viên</span>
                </div>
            </div>
            <div class="mt-4 flex items-center justify-between text-[10px]">
                <span class="uppercase tracking-widest font-black text-primary">Tỷ lệ hoàn thành</span>
                <span class="font-bold text-primary">--%</span>
            </div>
            <div class="mt-1 w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div class="h-full bg-primary" style="width: 0%"></div>
            </div>
        </div>
    `).join('')
}

// --- EXPORT EXCEL (CSV) ---
window.exportToCSV = async () => {
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('full_name, email, role, department, created_at')

    if (error) {
        alert('Lỗi lấy dữ liệu: ' + error.message)
        return
    }

    const header = ['Ho ten', 'Email', 'Vai tro', 'Phong ban', 'Ngay tham gia']
    const rows = profiles.map(p => [
        `"${p.full_name || 'Hoc vien'}"`,
        `"${p.email}"`,
        `"${p.role}"`,
        `"${p.department || ''}"`,
        `"${new Date(p.created_at).toLocaleDateString('vi-VN')}"`
    ])

    const csvContent = "\uFEFF" + [header.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.setAttribute("download", `Bao_cao_nhan_su_${new Date().getTime()}.csv`)
    document.body.appendChild(link)
    link.click()
}

// --- ASSIGNMENT GRADING ---
async function loadAssignments() {
    const list = document.getElementById('assignment-list')
    if (!list) return

    const { data: assignments, error } = await supabase
        .from('assignments')
        .select(`
            *,
            profiles(full_name),
            lessons(title, assignment_config)
        `)
        .eq('status', 'pending')

    if (error) {
        console.error('Error fetching assignments:', error)
        return
    }

    if (!assignments || assignments.length === 0) {
        list.innerHTML = `<div class="col-span-full p-12 text-center text-on-surface-variant/40 italic">Không có bài tập đang chờ chấm.</div>`
        return
    }

    list.innerHTML = assignments.map(asn => {
        const config = asn.lessons?.assignment_config || {}
        const limit = config.word_limit || 0
        const submission = asn.submission_content || ''
        const wordCount = submission.trim() === '' ? 0 : submission.trim().split(/\s+/).length
        const isExceeded = limit > 0 && wordCount > limit

        return `
            <div class="p-6 bg-surface-container-low rounded-xl border ${isExceeded ? 'border-error ring-1 ring-error' : 'border-outline-variant/10'} group transition-all">
                <div class="flex justify-between items-start mb-4">
                    <div class="p-2 bg-surface-container-lowest rounded-lg shadow-sm">
                        <span class="material-symbols-outlined text-primary">description</span>
                    </div>
                    ${isExceeded ? `
                        <div class="flex items-center gap-1 text-[9px] font-bold text-error uppercase bg-error-container/20 px-2 py-1 rounded-full animate-pulse">
                            <span class="material-symbols-outlined text-[12px]">warning</span> Cảnh báo số từ
                        </div>
                    ` : `
                        <span class="text-[10px] font-black uppercase text-tertiary tracking-widest bg-tertiary-fixed-dim/20 px-2 py-1 rounded">Chờ chấm</span>
                    `}
                </div>
                <h4 class="font-bold text-sm mb-1 line-clamp-1">${asn.lessons?.title || 'Bài tập tự luận'}</h4>
                <p class="text-on-surface-variant text-xs mb-2">Nhân viên: <span class="text-on-surface font-semibold">${asn.profiles?.full_name || 'Học viên'}</span></p>
                <div class="text-[10px] mb-4 flex items-center gap-2">
                    <span class="font-bold text-on-surface-variant">Độ dài bài viết:</span>
                    <span class="font-black ${isExceeded ? 'text-error' : 'text-primary'}">${wordCount} / ${limit || 'Không giới hạn'} từ</span>
                </div>
                <div class="flex gap-2">
                    <button onclick="viewSubmission('${asn.id}')" class="flex-1 bg-surface-container-lowest text-on-surface border border-outline-variant/20 py-2 rounded-lg text-[11px] font-bold text-center hover:bg-surface-container-high transition-all">Chi tiết</button>
                    <button onclick="gradeAssignment('${asn.id}')" class="flex-1 bg-primary text-on-primary py-2 rounded-lg text-[11px] font-bold hover:opacity-90 transition-all ${isExceeded ? 'opacity-50 grayscale' : ''}">Xác nhận chấm</button>
                </div>
            </div>
        `
    }).join('')
}

window.gradeAssignment = async (id) => {
    const { error } = await supabase.from('assignments').update({ status: 'graded' }).eq('id', id)
    if (error) alert(error.message)
    else loadAssignments()
}

window.viewSubmission = async (id) => {
    const { data: asn } = await supabase.from('assignments').select('submission_content').eq('id', id).single()
    if (asn) alert("NỘI DUNG BÀI LÀM:\n\n" + asn.submission_content)
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    initTheme()
    renderThemeSwitcher('theme-switcher-container')

    const admin = await checkAdmin()
    if (admin) {
        loadStudents()
        loadAssignments()
        loadCourseOverview()
        
        const exportBtn = document.getElementById('export-excel-btn')
        if (exportBtn) exportBtn.onclick = exportToCSV

        // Sign Out
        const signOutBtn = document.getElementById('sign-out-btn')
        if (signOutBtn) {
            signOutBtn.onclick = async () => {
                await supabase.auth.signOut()
                window.location.href = '/'
            }
        }
    }
})
