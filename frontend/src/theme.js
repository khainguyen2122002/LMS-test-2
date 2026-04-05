export function initTheme() {
    const theme = localStorage.getItem('theme') || 'system';
    applyTheme(theme);
    
    // Listen for system theme changes if in 'system' mode
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (localStorage.getItem('theme') === 'system') {
            applyTheme('system');
        }
    });
}

export function applyTheme(theme) {
    const html = document.documentElement;
    localStorage.setItem('theme', theme);
    
    if (theme === 'dark') {
        html.classList.add('dark');
        html.classList.remove('light');
    } else if (theme === 'light') {
        html.classList.add('light');
        html.classList.remove('dark');
    } else {
        // System mode
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            html.classList.add('dark');
            html.classList.remove('light');
        } else {
            html.classList.add('light');
            html.classList.remove('dark');
        }
    }
}

export function getTheme() {
    return localStorage.getItem('theme') || 'system';
}

export function renderThemeSwitcher(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentTheme = getTheme();
    
    container.innerHTML = `
        <div class="relative group">
            <button class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-container-high transition-all text-xs font-bold uppercase border border-outline-variant/20" id="theme-btn text-on-surface">
                <span class="material-symbols-outlined text-lg">${getThemeIcon(currentTheme)}</span>
                <span class="hidden md:inline">${getThemeLabel(currentTheme)}</span>
            </button>
            <div class="absolute right-0 top-full mt-2 w-40 bg-surface-container-lowest border border-outline-variant/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div class="p-1">
                    <button class="theme-select w-full flex items-center gap-3 px-3 py-2 text-xs font-medium hover:bg-surface-container-high rounded-lg text-on-surface" data-theme="light">
                        <span class="material-symbols-outlined text-sm">light_mode</span> Sáng
                    </button>
                    <button class="theme-select w-full flex items-center gap-3 px-3 py-2 text-xs font-medium hover:bg-surface-container-high rounded-lg text-on-surface" data-theme="dark">
                        <span class="material-symbols-outlined text-sm">dark_mode</span> Tối
                    </button>
                    <button class="theme-select w-full flex items-center gap-3 px-3 py-2 text-xs font-medium hover:bg-surface-container-high rounded-lg text-on-surface" data-theme="system">
                        <span class="material-symbols-outlined text-sm">desktop_windows</span> Hệ thống
                    </button>
                </div>
            </div>
        </div>
    `;

    container.querySelectorAll('.theme-select').forEach(btn => {
        btn.onclick = () => {
            const theme = btn.getAttribute('data-theme');
            applyTheme(theme);
            renderThemeSwitcher(containerId); // Re-render to update UI
        };
    });
}

function getThemeIcon(theme) {
    if (theme === 'light') return 'light_mode';
    if (theme === 'dark') return 'dark_mode';
    return 'desktop_windows';
}

function getThemeLabel(theme) {
    if (theme === 'light') return 'Sáng';
    if (theme === 'dark') return 'Tối';
    return 'Hệ thống';
}
