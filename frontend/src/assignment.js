import { supabase } from './supabase.js'

export async function initAssignment(lesson, userId) {
    const container = document.getElementById('panel-assignment');
    if (!container) return;

    if (!lesson.assignment_type || lesson.assignment_type === 'none') {
        container.innerHTML = `
            <div class="p-12 text-center opacity-50">
                <span class="material-symbols-outlined text-64px block mb-4">event_busy</span>
                <p class="text-lg font-medium text-on-surface-variant">Không có bài tập cho bài học này.</p>
            </div>
        `;
        return;
    }

    // Kiểm tra xem đã nộp bài chưa
    const { data: existingSubmission } = await supabase
        .from('assignments')
        .select('*')
        .eq('user_id', userId)
        .eq('lesson_id', lesson.id)
        .single();

    renderAssignmentUI(container, lesson, existingSubmission, userId);
}

function renderAssignmentUI(container, lesson, submission, userId) {
    const type = lesson.assignment_type;
    const config = lesson.assignment_config || {};
    const isSubmitted = !!submission;

    let contentHtml = '';

    if (type === 'multiple_choice') {
        contentHtml = renderMultipleChoice(config, submission);
    } else if (type === 'essay') {
        contentHtml = renderEssay(config, submission);
    }

    container.innerHTML = `
        <div class="max-w-4xl mx-auto py-8">
            <!-- Header bài tập -->
            <div class="relative mb-12">
                <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-on-tertiary-container mb-2 block">MODULE CỦA BÀI HỌC</span>
                <h2 class="text-4xl font-black text-on-surface tracking-tighter leading-none mb-4">${lesson.title} - Bài tập</h2>
                <p class="text-on-surface-variant max-w-2xl leading-relaxed">${config.description || 'Hãy hoàn thành bài tập dưới đây một cách cẩn thận.'}</p>
                
                ${isSubmitted ? `
                <div class="mt-4 flex items-center gap-2 text-primary font-bold bg-primary-container/20 px-4 py-2 rounded-lg w-fit">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                    <span>Bạn đã nộp bài này vào ${new Date(submission.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                ` : ''}
            </div>

            ${contentHtml}
        </div>
    `;

    // Gán sự kiện sau khi render
    if (!isSubmitted) {
        if (type === 'multiple_choice') {
            setupMultipleChoiceEvents(lesson.id, userId);
        } else if (type === 'essay') {
            setupEssayEvents(lesson.id, userId, config.word_limit || 500);
        }
    }
}

function renderMultipleChoice(config, submission) {
    const question = config.question || 'Câu hỏi chưa được thiết lập.';
    const options = config.options || ['Lựa chọn A', 'Lựa chọn B', 'Lựa chọn C', 'Lựa chọn D'];
    const labels = ['A', 'B', 'C', 'D'];
    const currentAnswer = submission ? submission.submission_content : null;

    return `
        <section class="mb-12">
            <div class="flex items-center gap-4 mb-8">
                <div class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">?</div>
                <h3 class="text-2xl font-bold tracking-tight text-on-surface">${question}</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="mc-options">
                ${options.map((opt, i) => {
                    const isSelected = currentAnswer === labels[i];
                    return `
                    <div data-value="${labels[i]}" class="mc-option group relative bg-surface-container-lowest p-8 rounded-2xl border-2 ${isSelected ? 'border-primary' : 'border-outline-variant/10'} ${submission ? 'cursor-default' : 'cursor-pointer hover:shadow-lg hover:bg-surface-container-low transition-all'}">
                        <div class="flex items-start gap-6">
                            <div class="w-12 h-12 rounded-xl ${isSelected ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface-variant'} flex items-center justify-center font-black text-xl group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                                ${labels[i]}
                            </div>
                            <div class="flex-1">
                                <p class="text-lg font-medium leading-snug">${opt}</p>
                            </div>
                            <span class="material-symbols-outlined text-primary selection-indicator ${isSelected ? '' : 'hidden'}" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                        </div>
                    </div>
                    `;
                }).join('')}
            </div>
            
            ${!submission ? `
            <div class="mt-12 flex justify-end">
                <button id="submit-mc-btn" class="editorial-gradient px-12 py-4 rounded-xl font-bold text-sm text-on-primary shadow-lg shadow-primary/20 hover:scale-105 duration-150 ease-in-out">
                    Nộp bài trắc nghiệm
                </button>
            </div>
            ` : ''}
        </section>
    `;
}

function renderEssay(config, submission) {
    const limit = config.word_limit || 500;
    const currentText = submission ? submission.submission_content : '';
    const wordCount = currentText ? currentText.trim().split(/\s+/).length : 0;
    const isExceeded = wordCount > limit;

    return `
        <section>
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">1</div>
                    <h3 class="text-2xl font-bold tracking-tight text-on-surface">Bài làm tự luận</h3>
                </div>
                <div class="flex items-center gap-2 text-on-tertiary-container bg-tertiary-fixed/30 px-4 py-1.5 rounded-full">
                    <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">lightbulb</span>
                    <span class="text-xs font-bold uppercase tracking-wider">Cần chiều sâu học thuật</span>
                </div>
            </div>
            
            <div class="bg-surface-container-lowest rounded-3xl p-2 shadow-sm border ${isExceeded ? 'border-error' : 'border-outline-variant/10'}" id="essay-wrapper">
                <textarea 
                    id="essay-textarea"
                    ${submission ? 'disabled' : ''}
                    class="w-full h-80 bg-surface-container-high/30 rounded-2xl p-8 text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary border-b-2 border-outline-variant/10 resize-none transition-all" 
                    placeholder="Hãy viết câu trả lời của bạn tại đây..."
                >${currentText}</textarea>
                
                <div class="flex items-center justify-between p-6">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-medium text-on-surface-variant">Số từ:</span>
                        <span id="word-counter" class="text-sm font-bold ${isExceeded ? 'text-error' : 'text-primary'}">${wordCount} / ${limit}</span>
                    </div>
                    
                    ${!submission ? `
                    <div class="flex items-center gap-4">
                        <button class="px-8 py-3 rounded-xl font-bold text-sm text-primary hover:bg-surface-container-low transition-colors">
                            Lưu nháp
                        </button>
                        <button id="submit-essay-btn" ${isExceeded ? 'disabled' : ''} class="editorial-gradient px-10 py-3 rounded-xl font-bold text-sm text-on-primary shadow-lg shadow-primary/20 hover:scale-105 duration-150 ease-in-out disabled:opacity-50 disabled:grayscale disabled:pointer-events-none">
                            Nộp bài tự luận
                        </button>
                    </div>
                    ` : ''}
                </div>
            </div>
        </section>
    `;
}

function setupMultipleChoiceEvents(lessonId, userId) {
    const options = document.querySelectorAll('.mc-option');
    let selectedValue = null;

    options.forEach(opt => {
        opt.onclick = () => {
            // Reset others
            options.forEach(o => {
                o.classList.remove('border-primary');
                o.classList.add('border-outline-variant/10');
                o.querySelector('.selection-indicator').classList.add('hidden');
                o.querySelector('.w-12').classList.remove('bg-primary', 'text-on-primary');
                o.querySelector('.w-12').classList.add('bg-surface-container-high', 'text-on-surface-variant');
            });

            // Set current
            opt.classList.add('border-primary');
            opt.classList.remove('border-outline-variant/10');
            opt.querySelector('.selection-indicator').classList.remove('hidden');
            opt.querySelector('.w-12').classList.add('bg-primary', 'text-on-primary');
            opt.querySelector('.w-12').classList.remove('bg-surface-container-high', 'text-on-surface-variant');
            
            selectedValue = opt.getAttribute('data-value');
        };
    });

    const submitBtn = document.getElementById('submit-mc-btn');
    if (submitBtn) {
        submitBtn.onclick = async () => {
            if (!selectedValue) {
                alert('Vui lòng chọn một đáp án!');
                return;
            }
            await submitAssignment(lessonId, userId, selectedValue);
        };
    }
}

function setupEssayEvents(lessonId, userId, limit) {
    const textarea = document.getElementById('essay-textarea');
    const counter = document.getElementById('word-counter');
    const submitBtn = document.getElementById('submit-essay-btn');
    const wrapper = document.getElementById('essay-wrapper');

    textarea.oninput = () => {
        const text = textarea.value.trim();
        const wordCount = text === '' ? 0 : text.split(/\s+/).length;
        
        counter.innerText = `${wordCount} / ${limit}`;
        
        if (wordCount > limit) {
            counter.classList.add('text-error');
            counter.classList.remove('text-primary');
            wrapper.classList.add('border-error');
            wrapper.classList.remove('border-outline-variant/10');
            submitBtn.disabled = true;
        } else {
            counter.classList.remove('text-error');
            counter.classList.add('text-primary');
            wrapper.classList.remove('border-error');
            wrapper.classList.add('border-outline-variant/10');
            submitBtn.disabled = false;
        }
    };

    if (submitBtn) {
        submitBtn.onclick = async () => {
            const text = textarea.value.trim();
            if (!text) {
                alert('Vui lòng nhập nội dung bài làm!');
                return;
            }
            await submitAssignment(lessonId, userId, text);
        };
    }
}

async function submitAssignment(lessonId, userId, content) {
    try {
        const { error } = await supabase
            .from('assignments')
            .upsert({
                user_id: userId,
                lesson_id: lessonId,
                submission_content: content,
                status: 'pending'
            });

        if (error) throw error;

        alert('Nộp bài thành công!');
        window.location.reload(); // Tải lại để xem trạng thái đã nộp
    } catch (err) {
        console.error('Lỗi nộp bài:', err);
        alert('Lỗi: ' + err.message);
    }
}
