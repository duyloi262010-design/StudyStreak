
export const VALID_SUBJECTS = [
  'Toán học', 'Ngữ văn', 'Tiếng Anh', 'Vật lí', 'Hóa học', 'Sinh học',
  'Lịch sử', 'Địa lí', 'Giáo dục kinh tế và pháp luật', 'Tin học', 'Công nghệ'
];

export const EXCLUDED_SUBJECTS = [
  'Âm nhạc', 'Hoạt động trải nghiệm', 'Mĩ thuật', 'Giáo dục địa phương', 'Giáo dục quốc phòng'
];

export const DAYS_OF_WEEK = [
  'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'
];

export const TEXTBOOK_OPTIONS = [
  'Kết nối tri thức', 'Chân trời sáng tạo', 'Cánh diều'
];

export const GRADES = Array.from({ length: 12 }, (_, i) => `Lớp ${i + 1}`);

export const TRANSLATIONS = {
  vi: {
    welcome: "Chào",
    dailyGoal: "Mục tiêu hôm nay",
    startStudy: "BẮT ĐẦU HỌC",
    streak: "Ngày",
    currentStreak: "CHUỖI STREAK HIỆN TẠI",
    chatWithPet: "Chat với",
    level: "Cấp",
    subjectsToFinish: "Môn học cần hoàn thành trong",
    restDay: "Hôm nay là ngày nghỉ xả hơi!",
    profile: "Hồ sơ học tập",
    saveProfile: "Lưu hồ sơ",
    close: "Đóng",
    language: "Ngôn ngữ",
    usernameLabel: "Tên của cậu là gì?",
    petNameLabel: "Tên Linh vật của cậu?",
    avatarLabel: "Kho Avatar",
    logout: "Đăng xuất",
    changeAccount: "Đổi tài khoản",
    manageProfile: "Quản lý hồ sơ",
    loadingQuiz: "Đang khởi tạo đề...",
    aiThinking: "Kiến trúc sư AI đang chuẩn bị các thử thách cho bạn.",
    whoIsStudying: "Ai đang học thế?",
    chooseProfile: "Chọn hồ sơ để bắt đầu tích lũy chuỗi Streak nhé!",
    addNew: "Thêm mới",
    account: "Tài khoản",
    dataManagement: "Quản lý dữ liệu hệ thống",
    importData: "Nhập mã",
    exportData: "Xuất mã",
    syncData: "Đồng bộ dữ liệu",
    passed: "ĐỈNH CỦA CHÓP!",
    failed: "CỐ GẮNG LÊN NÀO!",
    score: "Kết Quả",
    time: "Thời Gian",
    viewReview: "XEM LỜI GIẢI (CHỮA BÀI)",
    goHome: "Về Trang Chủ",
    question: "CÂU HỎI",
    submit: "NỘP BÀI",
    next: "TIẾP THEO",
    back: "QUAY LẠI",
    explanationTitle: "Lời giải từ Kiến trúc sư AI",
    errorNoSubjects: "Cậu cần nhập ít nhất một môn học để lập kế hoạch nhé!",
    errorEmptyUsername: "Vui lòng nhập tên của bạn nhé!",
    errorEmptyPetName: "Hãy đặt một cái tên thật kêu cho Linh vật của cậu!",
    onboardingTitle: "Lập kế hoạch học tập",
    onboardingDesc: "Hãy tự mình lên lịch trình cho các ngày trong tuần",
    quickAdd: "Thêm nhanh môn học",
    stepSchedule: "Thời khóa biểu",
    stepTextbook: "Bộ sách giáo khoa",
    placeholderSubjects: "Nhập môn học (cách nhau bởi dấu phẩy)...",
    editPlan: "Chỉnh sửa kế hoạch",
    savePlan: "Lưu kế hoạch 📝",
    manageSchedule: "Quản lý thời khóa biểu",
    textbookFor: "Sách cho môn"
  },
  en: {
    welcome: "Hi",
    dailyGoal: "Today's Goal",
    startStudy: "START STUDYING",
    streak: "Days",
    currentStreak: "CURRENT STREAK",
    chatWithPet: "Chat with",
    level: "LV.",
    subjectsToFinish: "Subjects to finish on",
    restDay: "Today is a rest day! ✨",
    profile: "Study Profile",
    saveProfile: "Save Profile",
    close: "Close",
    language: "Language",
    usernameLabel: "What is your name?",
    petNameLabel: "What is your pet's name?",
    avatarLabel: "Avatar Gallery",
    logout: "Logout",
    changeAccount: "Switch Account",
    manageProfile: "Manage Profile",
    loadingQuiz: "Generating Quiz...",
    aiThinking: "AI Architect is preparing challenges for you.",
    whoIsStudying: "Who's studying today?",
    chooseProfile: "Select a profile to start your streak!",
    addNew: "Add New",
    account: "Account",
    dataManagement: "System Data Management",
    importData: "Import Code",
    exportData: "Export Code",
    syncData: "Data Sync",
    passed: "TOP TIER!",
    failed: "KEEP GOING!",
    score: "Score",
    time: "Time",
    viewReview: "VIEW EXPLANATIONS",
    goHome: "Back to Home",
    question: "QUESTION",
    submit: "SUBMIT",
    next: "NEXT",
    back: "BACK",
    explanationTitle: "Explanation from AI Architect",
    errorNoSubjects: "You need to add at least one subject to plan your schedule!",
    errorEmptyUsername: "Please enter your name!",
    errorEmptyPetName: "Give your pet a cool name!",
    onboardingTitle: "Study Planning",
    onboardingDesc: "Set up your own weekly study schedule",
    quickAdd: "Quick Add Subjects",
    stepSchedule: "Schedule",
    stepTextbook: "Textbook Set",
    placeholderSubjects: "Enter subjects (comma separated)...",
    editPlan: "Edit Schedule",
    savePlan: "Save Plan 📝",
    manageSchedule: "Manage Schedule",
    textbookFor: "Textbook for"
  }
};
