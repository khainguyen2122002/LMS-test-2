export interface DashboardContent {
    hero: {
        badge: string;
        title: string;
        subtitle: string;
        primaryBtn: string;
        secondaryBtn: string;
    };
    stats: {
        engagement: {
            label: string;
            value: string;
            trend: string;
            progress: number;
        };
        activeUsers: {
            label: string;
            value: string;
            trend: string;
            trendValue: string;
        };
    };
    currentCourse: {
        sectionTitle: string;
        sectionSub: string;
        title: string;
        description: string;
        progress: number;
        duration: string;
        lessons: number;
        badge: string;
        actionBtn: string;
    };
    quickActions: {
        sectionTitle: string;
        mainAction: {
            title: string;
            description: string;
            btnText: string;
        };
        secondaryActions: {
            import: string;
            connect: string;
        };
    };
    sidebar: {
        logo: string;
        tagline: string;
        nav: {
            dashboard: string;
            users: string;
            courses: string;
            reports: string;
            settings: string;
            support: string;
        };
        user: {
            role: string;
            plan: string;
        }
    };
    topNav: {
        links: string[];
        searchPlaceholder: string;
    }
}

export const dashboardContent: DashboardContent = {
    hero: {
        badge: "INSTITUTIONAL CONTROL",
        title: "Khởi nguồn tăng trưởng, mỗi ngày.",
        subtitle: "Nền tảng quản trị năng lực và phát triển nhân sự toàn diện, nâng tầm giá trị nguồn lực tại doanh nghiệp.",
        primaryBtn: "Khám phá ngay",
        secondaryBtn: "Xem tài liệu"
    },
    stats: {
        engagement: {
            label: "ENGAGEMENT",
            value: "88%",
            trend: "+4% so với tháng trước",
            progress: 88
        },
        activeUsers: {
            label: "ACTIVE USERS",
            value: "1,240",
            trend: "this month",
            trendValue: "+12%"
        }
    },
    currentCourse: {
        sectionTitle: "Giáo trình đang học",
        sectionSub: "Tiếp tục hành trình phát triển của bạn",
        title: "Quản trị nhân sự trong kỷ nguyên số 4.0",
        description: "Khám phá các công cụ và quy trình mới nhất để tối ưu hóa hiệu suất làm việc và sự gắn kết của nhân viên trong môi trường làm việc hỗn hợp.",
        progress: 75,
        duration: "12 giờ",
        lessons: 24,
        badge: "BẮT BUỘC",
        actionBtn: "Tiếp tục"
    },
    quickActions: {
        sectionTitle: "CÔNG CỤ QUY TRÌNH",
        mainAction: {
            title: "Thiết lập lộ trình mới",
            description: "Tạo và quản lý các khóa học chuyên sâu dành riêng cho đội ngũ của bạn.",
            btnText: "Tạo khóa học"
        },
        secondaryActions: {
            import: "Nhập dữ liệu",
            connect: "Kết nối hệ thống"
        }
    },
    sidebar: {
        logo: "INSPIRING HR",
        tagline: "HỆ THỐNG LMS CAO CẤP",
        nav: {
            dashboard: "Bảng điều khiển",
            users: "Quản lý người dùng",
            courses: "Khóa học",
            reports: "Báo cáo",
            settings: "Cài đặt hệ thống",
            support: "Hỗ trợ"
        },
        user: {
            role: "Quản trị viên",
            plan: "Premium Account"
        }
    },
    topNav: {
        links: ["Trang chủ", "Khóa học", "Thư viện"],
        searchPlaceholder: "Tìm kiếm nội dung..."
    }
};
