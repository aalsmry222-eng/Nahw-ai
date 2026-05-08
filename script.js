
// ========== إعدادات عامة ==========
const CONFIG = {
    MAX_LIVES: 3,
    SCORE_PER_Q: 5,
    XP_PER_LEVEL: 100,
    STREAK_BONUS: 10,
    LEADERBOARD_MAX: 10,
    SOUND_URLS: {
        correct: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
        wrong: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
        click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
        startup: 'https://assets.mixkit.co/active_storage/sfx/2951/2951-preview.mp3'
    }
};

// ========== الأدوات المساعدة ==========
const shuffle = arr => { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; };
const escapeHTML = str => { const d = document.createElement('div'); d.appendChild(document.createTextNode(str)); return d.innerHTML; };
const toast = (msg, type = 'info') => {
    const t = document.createElement('div'); t.className = `toast toast-${type}`; t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 3000);
};
const confetti = () => {
    const colors = ['#D4AF37', '#F5D76E', '#FF80AB', '#2ECC71', '#FF9800'];
    const c = document.createElement('div'); c.className = 'confetti-container'; document.body.appendChild(c);
    for (let i = 0; i < 60; i++) {
        const p = document.createElement('div'); p.className = 'confetti-piece';
        p.style.left = Math.random() * 100 + '%'; p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        p.style.animationDuration = (Math.random() * 2 + 2) + 's'; c.appendChild(p);
    }
    setTimeout(() => c.remove(), 4000);
};

// ========== نظام الصوت ==========
let soundEnabled = localStorage.getItem('nahw_sound') !== 'off';
const audioCache = {};
const getAudio = url => {
    if (!audioCache[url]) { const a = new Audio(url); a.volume = 0.4; audioCache[url] = a; }
    return audioCache[url];
};
const playSound = (type) => {
    if (!soundEnabled) return;
    try { const a = getAudio(CONFIG.SOUND_URLS[type] || CONFIG.SOUND_URLS.click); a.currentTime = 0; a.play().catch(() => {}); } catch (e) {}
};
document.getElementById('soundToggle').addEventListener('click', () => {
    soundEnabled = !soundEnabled; localStorage.setItem('nahw_sound', soundEnabled ? 'on' : 'off');
    document.getElementById('soundToggle').textContent = soundEnabled ? '🔊' : '🔇';
});
document.getElementById('soundToggle').textContent = soundEnabled ? '🔊' : '🔇';

// ========== بنك الأسئلة الكامل ==========
const GRADE4 = [
    { q: "كلمة (المعلمة) تعتبر اسماً لأن بها علامة:", o: ["التنوين", "التاء المربوطة", "السبق بـ 'يا'", "أنها فعل"], a: 1, cat: "علامات الاسم" },
    { q: "أي من الكلمات التالية 'فعل مضارع'؟", o: ["قرأ", "اقرأ", "يقرأ", "قراءة"], a: 2, cat: "أنواع الفعل" },
    { q: "النوع الصحيح لـ 'في - من - إلى' هو:", o: ["حروف عطف", "حروف جر", "أسماء إشارة", "ضمائر"], a: 1, cat: "الحروف" },
    { q: "(الشجرةُ مثمرةٌ).. إعراب كلمة (الشجرة) هو:", o: ["خبر مرفوع", "مبتدأ مرفوع", "فاعل مرفوع", "اسم مجرور"], a: 1, cat: "المبتدأ والخبر" },
    { q: "علامة رفع المثنى:", o: ["الضمة", "الألف", "الواو", "الفتحة"], a: 1, cat: "علامات الإعراب" },
    { q: "(المهندسون بارعون).. علامة رفع الخبر هنا هي الواو لأنه:", o: ["مثنى", "جمع مؤنث سالم", "جمع مذكر سالم", "جمع تكسير"], a: 2, cat: "الجمع" },
    { q: "اسم الإشارة المناسب لـ (طبيبتان ماهرتان) هو:", o: ["هذان", "هاتان", "هؤلاء", "هذه"], a: 1, cat: "أسماء الإشارة" },
    { q: "الضمير (هم) يستخدم لـ:", o: ["جمع المذكر الغائب", "جمع المؤنث الغائب", "المثنى الغائب", "المفرد الغائب"], a: 0, cat: "الضمائر" },
    { q: "(نحن نحب القراءة).. الضمير (نحن) نوعه:", o: ["ضمير مخاطب", "ضمير غائب", "ضمير متكلم", "اسم إشارة"], a: 2, cat: "الضمائر" },
    { q: "كلمة (أشجار) هي جمع:", o: ["مذكر سالم", "مؤنث سالم", "تكسير", "مفرد"], a: 2, cat: "الجمع" },
    { q: "(الطالبان مجتهدان).. كلمة (مجتهدان) مرفوعة وعلامة رفعها:", o: ["الضمة", "الواو", "الألف", "الفتحة"], a: 2, cat: "علامات الإعراب" },
    { q: "أي من هذه الكلمات 'فعل أمر'؟", o: ["يكتب", "كتب", "اكتب", "كاتب"], a: 2, cat: "أنواع الفعل" },
    { q: "(سلمتُ على الأصدقاء).. كلمة (الأصدقاء) اسم علامته:", o: ["التنوين", "السبق بحرف جر", "النداء", "التاء المربوطة"], a: 1, cat: "علامات الاسم" },
    { q: "اسم الإشارة المناسب لجمع غير العاقل (كتب - أقلام):", o: ["هؤلاء", "هذه", "هذان", "هاتان"], a: 1, cat: "أسماء الإشارة" },
    { q: "(أنتما طالبان مهذبان).. الضمير (أنتما) للمخاطب:", o: ["المفرد", "الجمع", "المثنى", "الغائب"], a: 2, cat: "الضمائر" },
    { q: "كلمة (ساحات) نوع الجمع فيها:", o: ["تكسير", "مذكر سالم", "مؤنث سالم", "مفرد"], a: 2, cat: "الجمع" },
    { q: "(الفلاحون نشيطون).. إعراب كلمة (نشيطون):", o: ["مبتدأ", "خبر مرفوع بالواو", "خبر مرفوع بالضمة", "فاعل"], a: 1, cat: "المبتدأ والخبر" },
    { q: "حرف العطف الذي يفيد الترتيب مع التراخي:", o: ["الواو", "الفاء", "ثم", "أو"], a: 2, cat: "الحروف" },
    { q: "(هي تلميذة متفوقة).. الضمير (هي) يستخدم لـ:", o: ["المفرد المذكر", "المفردة المؤنثة", "المثنى", "المخاطب"], a: 1, cat: "الضمائر" },
    { q: "علامة رفع المبتدأ في (الأمهات رحيمات):", o: ["الألف", "الواو", "الضمة", "الكسرة"], a: 2, cat: "علامات الإعراب" },
    { q: "أي جملة مما يلي جملة اسمية؟", o: ["نام الطفل", "يلعب الولد", "الحديقة جميلة", "اشرب اللبن"], a: 2, cat: "الجملة الاسمية" },
    { q: "الكلمة التي تدل على فعل ماضٍ هي:", o: ["يسمع", "اسمع", "سمع", "سامع"], a: 2, cat: "أنواع الفعل" },
    { q: "اسم الإشارة المناسب لـ (عمال مخلصون) هو:", o: ["هذه", "هذان", "هؤلاء", "هاتان"], a: 2, cat: "أسماء الإشارة" },
    { q: "إعراب (الخبر) دائماً يكون:", o: ["مرفوع", "منصوب", "مجرور", "مجزوم"], a: 0, cat: "المبتدأ والخبر" },
    { q: "كلمة (حدائق) جمع تكسير، علامة رفعها:", o: ["الواو", "الضمة", "الألف", "الفتحة"], a: 1, cat: "علامات الإعراب" },
    { q: "الاسم الذي يقع بعد حرف الجر يسمى:", o: ["مبتدأ", "خبراً", "اسماً مجروراً", "فاعلاً"], a: 2, cat: "المجرورات" },
    { q: "(الفتاتان مهذبتان).. كلمة (مهذبتان) تعرب:", o: ["مبتدأ", "خبر", "فاعل", "مفعول به"], a: 1, cat: "المبتدأ والخبر" },
    { q: "علامة الاسم في كلمة (يا محمد):", o: ["التاء المربوطة", "النداء", "التنوين", "الـ التعريف"], a: 1, cat: "علامات الاسم" },
    { q: "(يحرص) الفلاح على أرضه.. الفعل (يحرص) نوعه:", o: ["ماضٍ", "مضارع", "أمر", "اسم"], a: 1, cat: "أنواع الفعل" },
    { q: "(أنتِ تلميذة ذكية).. الضمير (أنتِ) للمخاطب:", o: ["المفرد المذكر", "المفردة المؤنثة", "المثنى", "الجمع"], a: 1, cat: "الضمائر" },
    { q: "أي من الكلمات التالية جمع مؤنث سالم؟", o: ["أصوات", "أوقات", "مؤمنات", "أبيات"], a: 2, cat: "الجمع" },
    { q: "(هذان كتابان مفيدان).. كلمة (هذان) اسم إشارة لـ:", o: ["المثنى المذكر", "المثنى المؤنث", "الجمع", "المفرد"], a: 0, cat: "أسماء الإشارة" },
    { q: "(الجنود أقوياء).. علامة رفع كلمة (أقوياء):", o: ["الألف", "الواو", "الضمة", "الفتحة"], a: 2, cat: "علامات الإعراب" },
    { q: "(نحن أصدقاء مخلصون).. الضمير (نحن) يستخدم لـ:", o: ["المفرد", "المثنى والجمع", "الغائب", "المخاطب"], a: 1, cat: "الضمائر" },
    { q: "حرف العطف (الفاء) يفيد الترتيب مع:", o: ["التراخي", "السرعة", "الاختيار", "النفي"], a: 1, cat: "الحروف" },
    { q: "(الممرضات ساهرات).. كلمة (ساهرات) خبر مرفوع بـ:", o: ["الضمة", "الألف", "الواو", "الكسرة"], a: 0, cat: "المبتدأ والخبر" },
    { q: "(هؤلاء أطفال يلعبون).. (هؤلاء) اسم إشارة لـ:", o: ["جمع غير العاقل", "جمع العاقل", "المثنى", "المفرد"], a: 1, cat: "أسماء الإشارة" },
    { q: "الاسم الذي ينتهي بـ (ون) أو (ين) زائدة هو جمع:", o: ["تكسير", "مؤنث سالم", "مذكر سالم", "مثنى"], a: 2, cat: "الجمع" },
    { q: "(ذاكر دروسك بجد).. الفعل (ذاكر) هو فعل:", o: ["ماضٍ", "مضارع", "أمر", "مبتدأ"], a: 2, cat: "أنواع الفعل" },
    { q: "علامة الاسم في كلمة (حديقة):", o: ["التاء المربوطة والتنوين", "الـ التعريف", "النداء", "الفعلية"], a: 0, cat: "علامات الاسم" },
    { q: "الضمير (هما) يستخدم لـ:", o: ["المفرد الغائب", "المثنى الغائب", "الجمع الغائب", "المتكلم"], a: 1, cat: "الضمائر" },
    { q: "أي جملة تبدأ بـ 'فعل'؟", o: ["العلم نور", "سافر أبي", "أنا طالب", "هذا أخي"], a: 1, cat: "الجملة الفعلية" },
    { q: "(هاتان شجرتان جميلتان).. (هاتان) تستخدم لـ:", o: ["المثنى المذكر", "المثنى المؤنث", "الجمع", "المفردة"], a: 1, cat: "أسماء الإشارة" },
    { q: "(الماء سر الحياة).. كلمة (سر) تعرب:", o: ["مبتدأ", "خبراً", "فاعلاً", "حرف جر"], a: 1, cat: "المبتدأ والخبر" },
    { q: "(أنتم معلمون مبدعون).. الضمير (أنتم) للمخاطب:", o: ["المفرد", "المثنى", "جمع المذكر", "جمع المؤنث"], a: 2, cat: "الضمائر" },
    { q: "كلمة (فصول) نوع الجمع فيها:", o: ["مذكر سالم", "مؤنث سالم", "تكسير", "مثنى"], a: 2, cat: "الجمع" },
    { q: "أي من هذه الحروف يعتبر 'حرف عطف'؟", o: ["من", "إلى", "أو", "عن"], a: 2, cat: "الحروف" },
    { q: "الضمير (هن) يستخدم لـ:", o: ["جمع المذكر", "جمع المؤنث", "المخاطب", "المتكلم"], a: 1, cat: "الضمائر" },
    { q: "علامة رفع المبتدأ في (الميادين واسعة):", o: ["الياء", "الواو", "الضمة", "الألف"], a: 2, cat: "علامات الإعراب" },
    { q: "(هو يحب الخير).. الضمير (هو) نوعه:", o: ["متكلم", "مخاطب", "غائب", "إشارة"], a: 2, cat: "الضمائر" },
    { q: "كلمة (السماء) في (السماء صافية) تعرب:", o: ["خبراً", "مبتدأ", "فاعلاً", "اسماً مجروراً"], a: 1, cat: "المبتدأ والخبر" },
    { q: "(نحن تلاميذ أذكياء).. (نحن) تستخدم لـ:", o: ["المفرد", "المثنى فقط", "الجمع فقط", "المثنى والجمع"], a: 3, cat: "الضمائر" },
    { q: "أي من الكلمات تنتهي بـ 'تاء مربوطة' من علامات الأسماء؟", o: ["بنت", "مدرسة", "وقت", "كتبت"], a: 1, cat: "علامات الاسم" },
    { q: "(هذه مساجد واسعة).. نستخدم (هذه) لأنها:", o: ["مفردة مؤنثة", "جمع مذكر عاقل", "جمع غير عاقل", "مثنى مؤنث"], a: 2, cat: "أسماء الإشارة" },
    { q: "الفعل الذي يدل على حدث انتهى قبل زمن التكلم:", o: ["المضارع", "الماضي", "الأمر", "اسم الفعل"], a: 1, cat: "أنواع الفعل" },
    { q: "(أنتما متفوقان).. الضمير (أنتما) يستخدم لـ:", o: ["المفرد", "الجمع", "المثنى بنوعيه", "الغائب"], a: 2, cat: "الضمائر" },
    { q: "علامة رفع المبتدأ في (العصافير مغردة):", o: ["الألف", "الواو", "الضمة", "الفتحة"], a: 2, cat: "علامات الإعراب" },
    { q: "الحرف (و) في جملة (جاء أحمد ومحمد) يفيد:", o: ["السرعة", "التراخي", "المشاركة", "الاختيار"], a: 2, cat: "الحروف" },
    { q: "(أنت ممرضة رحيمة).. الضمير (أنت) نوعه:", o: ["متكلم", "مخاطب", "غائب", "إشارة"], a: 1, cat: "الضمائر" },
    { q: "كلمة (لاعبون) جمع مذكر سالم، علامة رفعها:", o: ["الضمة", "الألف", "الواو", "النون"], a: 2, cat: "علامات الإعراب" },
    { q: "(الفتاتان صادقتان).. (صادقتان) خبر مرفوع بـ:", o: ["الضمة", "الواو", "الألف", "النون"], a: 2, cat: "المبتدأ والخبر" },
    { q: "(سافر السائح إلى الأقصر).. (الأقصر) اسم علامته:", o: ["النداء", "التنوين", "السبق بحرف جر", "التاء المربوطة"], a: 2, cat: "علامات الاسم" },
    { q: "أي من الكلمات جمع تكسير؟", o: ["مؤمنون", "فلاحات", "أقلام", "مهندسان"], a: 2, cat: "الجمع" },
    { q: "(أنا أحب مدرستي).. الضمير (أنا) يستخدم لـ:", o: ["المفرد بنوعيه", "المثنى", "الجمع", "الغائب"], a: 0, cat: "الضمائر" },
    { q: "(هؤلاء أبطال مصر).. (هؤلاء) تستخدم لجمع:", o: ["غير العاقل", "العاقل", "المثنى", "المؤنث"], a: 1, cat: "أسماء الإشارة" },
    { q: "الفعل (ساعد غيرك).. نوع الفعل هنا:", o: ["ماضٍ", "مضارع", "أمر", "خبر"], a: 2, cat: "أنواع الفعل" },
    { q: "(الطبيبات مخلصات).. (الطبيبات) مبتدأ مرفوع بـ:", o: ["الواو", "الألف", "الضمة", "الكسرة"], a: 2, cat: "علامات الإعراب" },
    { q: "علامة الاسم في كلمة (رجلاً) هي:", o: ["الـ التعريف", "النداء", "التنوين", "التاء المربوطة"], a: 2, cat: "علامات الاسم" },
    { q: "(هو مهندس بارع).. الضمير (هو) للمفرد المذكر:", o: ["المخاطب", "الغائب", "المتكلم", "الإشارة"], a: 1, cat: "الضمائر" },
    { q: "حرف الجر في جملة (كتبت بالقلم) هو:", o: ["كتبت", "الباء", "القلم", "لا يوجد"], a: 1, cat: "الحروف" },
    { q: "(هذان خصمان).. كلمة (خصمان) تدل على:", o: ["مفرد", "مثنى", "جمع تكسير", "جمع مذكر"], a: 1, cat: "المثنى" },
    { q: "(الحدائق جميلة).. كلمة (جميلة) تعرب:", o: ["مبتدأ", "خبراً", "فاعلاً", "اسماً مجروراً"], a: 1, cat: "المبتدأ والخبر" },
    { q: "أي من الضمائر يستخدم لجمع المؤنث الغائب؟", o: ["هم", "هن", "هنا", "هؤلاء"], a: 1, cat: "الضمائر" },
    { q: "(اقرأ باسم ربك).. الفعل (اقرأ) علامته:", o: ["الضمة", "الفتحة", "السكون", "الكسرة"], a: 2, cat: "أنواع الفعل" },
    { q: "نوع الجمع في كلمة (ميادين):", o: ["مذكر سالم", "مؤنث سالم", "تكسير", "مثنى"], a: 2, cat: "الجمع" },
    { q: "الكلمة التي تدل على (مثنى مؤنث) هي:", o: ["طالبان", "طالبتان", "طلاب", "طالبات"], a: 1, cat: "المثنى" },
    { q: "(نحن أوفياء).. كلمة (أوفياء) جمع:", o: ["مذكر سالم", "مؤنث سالم", "تكسير", "مثنى"], a: 2, cat: "الجمع" },
    { q: "اسم الإشارة (هذه) يستخدم مع:", o: ["المذكر", "المؤنثة وغير العاقل", "المثنى", "العاقل"], a: 1, cat: "أسماء الإشارة" },
    { q: "(أنتم جنود شجعان).. (أنتم) نوعه:", o: ["متكلم", "مخاطب", "غائب", "إشارة"], a: 1, cat: "الضمائر" },
    { q: "أي من الكلمات فعل مضارع؟", o: ["سجد", "اسجد", "يسجد", "سجود"], a: 2, cat: "أنواع الفعل" },
    { q: "(الماء بارد).. كلمة (بارد) تعرب:", o: ["مبتدأ", "خبراً", "فاعلاً", "اسماً مجروراً"], a: 1, cat: "المبتدأ والخبر" },
    { q: "علامة رفع المبتدأ في (المهندسان ماهران):", o: ["الضمة", "الواو", "الألف", "الفتحة"], a: 2, cat: "علامات الإعراب" },
    { q: "(ذهب السائح إلى الأهرامات).. (الأهرامات) جمع:", o: ["مذكر سالم", "مؤنث سالم", "تكسير", "مفرد"], a: 1, cat: "الجمع" },
    { q: "(هن أمهات رحيمات).. (هن) يستخدم لـ:", o: ["جمع المذكر", "جمع المؤنث", "المثنى", "المخاطب"], a: 1, cat: "الضمائر" },
    { q: "حرف الجر (الكاف) في (الجندي كالأسد) يفيد:", o: ["الظرفية", "التشبيه", "الملكية", "الانتهاء"], a: 1, cat: "الحروف" },
    { q: "(العمال متقنون).. (متقنون) خبر مرفوع بـ:", o: ["الضمة", "الألف", "الواو", "النون"], a: 2, cat: "المبتدأ والخبر" },
    { q: "(هاتان وردتان).. (هاتان) اسم إشارة لـ:", o: ["المذكر", "المؤنث", "المفردة", "الجمع"], a: 1, cat: "أسماء الإشارة" },
    { q: "(تفتحت الأزهار).. (الأزهار) فاعل مرفوع بـ:", o: ["الألف", "الواو", "الضمة", "الفتحة"], a: 2, cat: "علامات الإعراب" },
    { q: "الضمير (أنتَ) يستخدم للمخاطب:", o: ["المفرد المذكر", "المفردة المؤنثة", "المثنى", "الجمع"], a: 0, cat: "الضمائر" },
    { q: "أي من الكلمات حرف عطف؟", o: ["عن", "أو", "ليت", "من"], a: 1, cat: "الحروف" },
    { q: "(العلم يرفع بيوتاً).. نوع الجملة:", o: ["فعلية", "اسمية", "شبه جملة", "لا شيء"], a: 1, cat: "الجملة الاسمية" },
    { q: "(هذان ولدان).. كلمة (ولدان) تدل على:", o: ["مفرد", "مثنى", "جمع", "اسم فعل"], a: 1, cat: "المثنى" },
    { q: "علامة الاسم في كلمة (باسم الله):", o: ["التاء المربوطة", "السبق بحرف جر", "التنوين", "النداء"], a: 1, cat: "علامات الاسم" },
    { q: "(هي تساعد أمها).. (هي) للمفردة المؤنثة:", o: ["الغائبة", "المخاطبة", "المتكلمة", "الموجودة"], a: 0, cat: "الضمائر" },
    { q: "الكلمة التي تدل على جمع مذكر سالم:", o: ["مساكين", "فنون", "صادقون", "شياطين"], a: 2, cat: "الجمع" },
    { q: "(دافع عن وطنك).. الفعل (دافع) فعل:", o: ["ماضٍ", "مضارع", "أمر", "اسم"], a: 2, cat: "أنواع الفعل" },
    { q: "(السماء تمطر).. (تمطر) نوعها:", o: ["اسم", "فعل", "حرف", "خبر مفرد"], a: 1, cat: "أنواع الفعل" },
    { q: "(أنا ونحن) تسمى ضمائر:", o: ["الغائب", "المخاطب", "المتكلم", "الإشارة"], a: 2, cat: "الضمائر" },
    { q: "(القصص ممتعة).. علامة رفع المبتدأ:", o: ["الواو", "الألف", "الضمة", "الفتحة"], a: 2, cat: "علامات الإعراب" },
    { q: "أداة تستخدم للإشارة للبعيد (للمذكر):", o: ["هذا", "ذلك", "تلك", "هؤلاء"], a: 1, cat: "أسماء الإشارة" },
    { type: 'tf', q: "كلمة (يقرأ) هي اسم لأنها تدل على معنى.", a: false, cat: "أنواع الفعل" },
    { type: 'tf', q: "التنوين من العلامات التي تميز الأسماء فقط.", a: true, cat: "علامات الاسم" },
    { type: 'tf', q: "الفعل الماضي هو ما دل على حدث وقع وانتهى.", a: true, cat: "أنواع الفعل" },
    { type: 'tf', q: "تعتبر (في) من حروف العطف.", a: false, cat: "الحروف" },
    { type: 'tf', q: "المبتدأ والخبر مرفوعان دائماً.", a: true, cat: "المبتدأ والخبر" },
    { type: 'tf', q: "علامة رفع المفرد هي الألف.", a: false, cat: "علامات الإعراب" },
    { type: 'tf', q: "جمع المذكر السالم ينتهي بألف وتاء.", a: false, cat: "الجمع" },
    { type: 'tf', q: "كلمة (أقلام) هي جمع تكسير.", a: true, cat: "الجمع" },
    { type: 'tf', q: "نستخدم اسم الإشارة (هؤلاء) لجمع غير العاقل.", a: false, cat: "أسماء الإشارة" },
    { type: 'tf', q: "الضمير (أنا) من ضمائر المتكلم.", a: true, cat: "الضمائر" },
    { type: 'tf', q: "الجملة الفعلية هي التي تبدأ باسم.", a: false, cat: "الجملة الفعلية" },
    { type: 'tf', q: "كلمة (تذاكر) في 'تذاكر البنت' فعل مضارع.", a: true, cat: "أنواع الفعل" },
    { type: 'tf', q: "المثنى يدل على اثنين أو اثنتين.", a: true, cat: "المثنى" },
    { type: 'tf', q: "علامة رفع جمع المؤنث السالم الواو.", a: false, cat: "علامات الإعراب" },
    { type: 'tf', q: "(هذان) اسم إشارة للمثنى المذكر.", a: true, cat: "أسماء الإشارة" },
    { type: 'tf', q: "حرف الجر (إلى) يفيد انتهاء الغاية.", a: true, cat: "الحروف" },
    { type: 'tf', q: "كلمة (فنون) جمع مذكر سالم.", a: false, cat: "الجمع" },
    { type: 'tf', q: "الخبر يتمم معنى الجملة مع المبتدأ.", a: true, cat: "المبتدأ والخبر" },
    { type: 'tf', q: "الفعل (اشرب) فعل أمر.", a: true, cat: "أنواع الفعل" },
    { type: 'tf', q: "الضمير (هن) لجمع الذكور الغائبين.", a: false, cat: "الضمائر" },
    { type: 'tf', q: "علامة رفع المثنى الألف.", a: true, cat: "علامات الإعراب" },
    { type: 'tf', q: "كلمة (تحت) تعتبر حرف جر.", a: false, cat: "الحروف" },
    { type: 'tf', q: "التاء المربوطة من علامات الأسماء.", a: true, cat: "علامات الاسم" },
    { type: 'tf', q: "(أنتما) ضمير للمثنى بنوعيه.", a: true, cat: "الضمائر" },
    { type: 'tf', q: "جمع التكسير يرفع بالضمة.", a: true, cat: "علامات الإعراب" },
    { type: 'tf', q: "الاسم المجرور يسبق حرف الجر.", a: false, cat: "المجرورات" },
    { type: 'tf', q: "(تلك) اسم إشارة للبعيد.", a: true, cat: "أسماء الإشارة" },
    { type: 'tf', q: "الضمير (نحن) للمفرد المتكلم.", a: false, cat: "الضمائر" },
    { type: 'tf', q: "علامة رفع المبتدأ في 'العمال مخلصون' الضمة.", a: true, cat: "علامات الإعراب" },
    { type: 'tf', q: "(يا) أداة نداء والاسم بعدها منادى.", a: true, cat: "علامات الاسم" },
    { type: 'tf', q: "كلمة (مدرسة) اسم لأن فيها (ال).", a: false, cat: "علامات الاسم" },
    { type: 'tf', q: "الخبر في 'الشمس تشرق' جملة.", a: true, cat: "المبتدأ والخبر" },
    { type: 'tf', q: "(هاتان) للمثنى المؤنث.", a: true, cat: "أسماء الإشارة" },
    { type: 'tf', q: "الفعل المضارع يبدأ بأحد حروف (أنيت).", a: true, cat: "أنواع الفعل" },
    { type: 'tf', q: "جمع المذكر السالم يرفع بالواو.", a: true, cat: "علامات الإعراب" },
    { type: 'tf', q: "(هم) ضمير متكلم للجماعة.", a: false, cat: "الضمائر" },
    { type: 'tf', q: "كلمة (ميادين) جمع مذكر سالم.", a: false, cat: "الجمع" },
    { type: 'tf', q: "الاسم يدل على إنسان أو حيوان أو جماد.", a: true, cat: "علامات الاسم" },
    { type: 'tf', q: "(ثم) حرف عطف يفيد السرعة.", a: false, cat: "الحروف" },
    { type: 'tf', q: "علامة جر الاسم المفرد الكسرة.", a: true, cat: "علامات الإعراب" },
    { type: 'tf', q: "(أنتن) ضمير مخاطب لجمع الإناث.", a: true, cat: "الضمائر" },
    { type: 'tf', q: "كلمة (طبيبات) جمع مؤنث سالم.", a: true, cat: "الجمع" },
    { type: 'tf', q: "الفاعل من قام بالفعل أو اتصف به.", a: true, cat: "الفاعل" },
    { type: 'tf', q: "(هذا) اسم إشارة للمفرد المؤنث.", a: false, cat: "أسماء الإشارة" },
    { type: 'tf', q: "حروف الجر تدخل على الأسماء فقط.", a: true, cat: "الحروف" },
    { type: 'tf', q: "(هو) و (هي) من ضمائر الغائب.", a: true, cat: "الضمائر" },
    { type: 'tf', q: "كلمة (لعب) فعل أمر.", a: false, cat: "أنواع الفعل" },
    { type: 'tf', q: "'نحن مخلصون' جملة اسمية.", a: true, cat: "الجملة الاسمية" }
];

const GRADE5 = [
    { q: "التخطيط الجيد من عواملِ النجاح. كلمة (عوامل) تعرب:", o: ["مبتدأ", "اسم مجرور", "خبر"], a: 1, cat: "المجرورات" },
    { q: "استمعتُ إلى الخبرين المهمين. علامة جر (الخبرين):", o: ["الكسرة", "الياء", "الفتحة"], a: 1, cat: "علامات الإعراب" },
    { q: "الصديقان مخلصان. علامة رفع (الصديقان):", o: ["الضمة", "الألف", "الواو"], a: 1, cat: "علامات الإعراب" },
    { q: "قرأ التلميذ بطلاقة. كلمة (بطلاقة) تعرب:", o: ["مفعول به", "اسم مجرور", "ظرف"], a: 1, cat: "المجرورات" },
    { q: "تعادل اللاعبان في المباراة. كلمة (اللاعبان) فاعل مرفوع بـ:", o: ["الواو", "الألف", "الضمة"], a: 1, cat: "علامات الإعراب" },
    { q: "باع التجار بضائعهم. علامة رفع الفاعل:", o: ["الضمة", "الفتحة", "الألف"], a: 0, cat: "علامات الإعراب" },
    { q: "حط المصري القديم الأموات. كلمة (الأموات) جمع:", o: ["مذكر سالم", "مؤنث سالم", "تكسير"], a: 2, cat: "الجمع" },
    { q: "تُكرم الدولة المخترعين. كلمة (المخترعين) مفعول به منصوب بـ:", o: ["الفتحة", "الياء", "الكسرة"], a: 1, cat: "المفعول به" },
    { q: "قرأتُ قصةً من قصص مصر القديمة. كلمة (قصص) تعرب:", o: ["اسم مجرور", "مضاف إليه", "مفعول به"], a: 0, cat: "المجرورات" },
    { q: "المصريون القدماء برعوا في الزراعة. علامة رفع (المصريون):", o: ["الضمة", "الألف", "الواو"], a: 2, cat: "علامات الإعراب" },
    { q: "نعيش في عالمٍ واحد. كلمة (عالم) تعرب:", o: ["فاعلاً", "اسماً مجروراً", "مبتدأ"], a: 1, cat: "المجرورات" },
    { q: "أشجار الغابة عالية. كلمة (عالية) تعرب:", o: ["مبتدأ", "خبراً", "فاعلاً"], a: 1, cat: "المبتدأ والخبر" },
    { q: "الإنسان مسئول عن تصرفاته. كلمة (مسئول) تعرب:", o: ["مبتدأ", "خبراً", "فاعلاً"], a: 1, cat: "المبتدأ والخبر" },
    { q: "أقامت الدولة مؤتمرين للتجارة. كلمة (مؤتمرين) تعرب:", o: ["مفعول به", "مبتدأ", "فاعل"], a: 0, cat: "المفعول به" },
    { q: "أنت من المجتهدين يا صديقي. علامة جر (المجتهدين):", o: ["الكسرة", "الفتحة", "الياء"], a: 2, cat: "علامات الإعراب" },
    { q: "تعلمتُ شيئاً جديداً. كلمة (شيئاً) تعرب:", o: ["فاعل", "مفعول به", "اسم مجرور"], a: 1, cat: "المفعول به" },
    { q: "الأغصان تتمايل في الربيع. كلمة (الأغصان) تعرب:", o: ["مبتدأ", "خبر", "فاعل"], a: 0, cat: "المبتدأ والخبر" },
    { q: "أشعلت الهتافات حماس اللاعبين. علامة رفع الفاعل:", o: ["الضمة", "الواو", "الألف"], a: 0, cat: "علامات الإعراب" },
    { q: "أحضر الفلاح طعاماً. كلمة (طعاماً) تعرب:", o: ["مفعول به", "فاعل", "مبتدأ"], a: 0, cat: "المفعول به" },
    { q: "يستقبل المجتهدون الفُرصَ دائماً. علامة نصب (الفُرص):", o: ["الكسرة", "الفتحة", "الضمة"], a: 1, cat: "علامات الإعراب" },
    { q: "كرمت المعلمة التلميذاتِ المتفوقات. علامة نصب (التلميذات):", o: ["الفتحة", "الكسرة", "الياء"], a: 1, cat: "علامات الإعراب" },
    { q: "تجاذب الولدان الحبل. علامة نصب المفعول به:", o: ["الياء", "الفتحة", "الألف"], a: 1, cat: "علامات الإعراب" },
    { q: "عاد المسافرون من الخارج. كلمة (المسافرون) فاعل مرفوع بـ:", o: ["الواو", "الضمة", "الألف"], a: 0, cat: "علامات الإعراب" },
    { q: "تدعم الحكومة التجارة. كلمة (التجارة) تعرب:", o: ["مبتدأ", "مفعول به", "فاعل"], a: 1, cat: "المفعول به" },
    { q: "نحترم المهذباتِ. علامة نصب (المهذبات):", o: ["الفتحة", "الكسرة", "الياء"], a: 1, cat: "علامات الإعراب" },
    { q: "نجح معرضُ الأسر المنتجة. كلمة (معرض) تعرب:", o: ["فاعل", "مفعول به", "خبر"], a: 0, cat: "الفاعل" },
    { q: "كافأ المدير الموظفين. كلمة (الموظفين) مفعول به منصوب بـ:", o: ["الفتحة", "الكسرة", "الياء"], a: 2, cat: "المفعول به" },
    { q: "اعطف على المسكين. علامة جر (المسكين):", o: ["الياء", "الفتحة", "الكسرة"], a: 2, cat: "علامات الإعراب" },
    { q: "ابتكر العلماء اختراعاتٍ عديدة. كلمة (اختراعات) تعرب:", o: ["مفعول به", "فاعل", "مبتدأ"], a: 0, cat: "المفعول به" },
    { q: "تهدف القوانين إلى راحة الإنسان. كلمة (الإنسان) تعرب:", o: ["مبتدأ", "مضافاً إليه", "مفعول به"], a: 1, cat: "المضاف إليه" },
    { q: "شاهدتُ آثار الأجداد. كلمة (الأجداد) تعرب:", o: ["فاعل", "خبر", "مضافاً إليه"], a: 2, cat: "المضاف إليه" },
    { q: "حصد الفلاحون القمح. كلمة (الفلاحون) فاعل مرفوع بـ:", o: ["الضمة", "الواو", "الألف"], a: 1, cat: "علامات الإعراب" },
    { q: "كافأت الدولة العلماء. كلمة (العلماء) تعرب:", o: ["مفعول به", "فاعل", "مبتدأ"], a: 0, cat: "المفعول به" },
    { q: "الممرضات رحيمات. كلمة (الممرضات) تعرب:", o: ["مبتدأ", "خبر", "فاعل"], a: 0, cat: "المبتدأ والخبر" },
    { q: "سعت الدولة إلى تطوير الصناعة. كلمة (الصناعة) تعرب:", o: ["مفعول به", "فاعل", "مضافاً إليه"], a: 2, cat: "المضاف إليه" },
    { q: "استعد المتسابق للمباراة. علامة جر (المباراة):", o: ["الياء", "الفتحة", "الكسرة"], a: 2, cat: "علامات الإعراب" },
    { q: "تلك هي القصة التي قرأتها. (التي) اسم موصول لـ:", o: ["المفرد المذكر", "المفردة المؤنثة", "الجمع"], a: 1, cat: "الأسماء الموصولة" },
    { q: "هشم الولد زجاج السيارة. كلمة (زجاج) تعرب:", o: ["فاعل", "مفعول به", "مضاف إليه"], a: 1, cat: "المفعول به" },
    { q: "أحبُ ركوبَ الدراجةِ. كلمة (الدراجة) تعرب:", o: ["فاعلاً", "مفعولاً به", "مضافاً إليه"], a: 2, cat: "المضاف إليه" },
    { q: "صح أم خطأ: 'المساكين' مفعول به منصوب بالياء.", o: ["صح", "خطأ"], a: 1, cat: "علامات الإعراب" },
    { q: "صح أم خطأ: علامة رفع جمع المؤنث السالم الضمة.", o: ["صح", "خطأ"], a: 0, cat: "علامات الإعراب" },
    { q: "صح أم خطأ: 'الأغصان' مبتدأ مرفوع بالألف.", o: ["صح", "خطأ"], a: 1, cat: "علامات الإعراب" },
    { q: "صح أم خطأ: ينصب المفعول به بالكسرة إذا كان جمع مؤنث سالم.", o: ["صح", "خطأ"], a: 0, cat: "المفعول به" },
    { q: "صح أم خطأ: الفاعل مرفوع والمفعول به منصوب.", o: ["صح", "خطأ"], a: 0, cat: "الفاعل" },
    { q: "صح أم خطأ: 'ميادين' مفعول به منصوب بالياء.", o: ["صح", "خطأ"], a: 1, cat: "علامات الإعراب" },
    { q: "صح أم خطأ: يجر الاسم بالياء إذا كان مثنى أو جمع مذكر سالم.", o: ["صح", "خطأ"], a: 0, cat: "علامات الإعراب" },
    { q: "صح أم خطأ: المضاف إليه مرفوع دائماً.", o: ["صح", "خطأ"], a: 1, cat: "المضاف إليه" },
    { q: "صح أم خطأ: 'العلماء' فاعل مرفوع بالضمة.", o: ["صح", "خطأ"], a: 0, cat: "علامات الإعراب" },
    { q: "صح أم خطأ: علامة نصب 'التلميذين' الفتحة.", o: ["صح", "خطأ"], a: 1, cat: "علامات الإعراب" }
];

const QUESTIONS = { grade4: GRADE4, grade5: GRADE5 };

// ========== حالة اللعبة ==========
const state = {
    grade: 'grade4', mode: 'full', questions: [], qIndex: 0, score: 0, lives: CONFIG.MAX_LIVES,
    streak: 0, correct: 0, wrong: 0, skip: 0, answered: false, wrongAnswers: [], analytics: {},
    xp: parseInt(localStorage.getItem('nahw_xp') || '0'), level: Math.floor((parseInt(localStorage.getItem('nahw_xp') || '0')) / CONFIG.XP_PER_LEVEL) + 1,
    friend: { p1: { name: 'لاعب 1', score: 0, lives: CONFIG.MAX_LIVES }, p2: { name: 'لاعب 2', score: 0, lives: CONFIG.MAX_LIVES }, turn: 1 },
    powers: { fifty: true, time: true, hint: true }, timerInterval: null
};

// ========== دوال العرض ==========
function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}
function updateUI() {
    document.getElementById('heartsDisplay').textContent = '❤️'.repeat(state.lives) + '🖤'.repeat(CONFIG.MAX_LIVES - state.lives);
    document.getElementById('scoreDisplay').textContent = state.score;
    const streakEl = document.getElementById('streakDisplay');
    if (state.streak > 0) { streakEl.style.display = 'block'; streakEl.textContent = '🔥 ' + state.streak; }
    else streakEl.style.display = 'none';
    if (state.mode === 'friend') {
        const badge = document.getElementById('playerTurnBadge'); badge.style.display = 'block';
        badge.textContent = '👤 دور ' + (state.friend.turn === 1 ? state.friend.p1.name : state.friend.p2.name);
    } else { document.getElementById('playerTurnBadge').style.display = 'none'; }
    const xpInLevel = state.xp % CONFIG.XP_PER_LEVEL;
    document.getElementById('xpBarFill').style.width = (xpInLevel / CONFIG.XP_PER_LEVEL * 100) + '%';
}

// ========== تهيئة الأسئلة ==========
function prepareQuestions() {
    const raw = QUESTIONS[state.grade];
    state.base = raw.map(q => {
        if (!q.type || q.type === 'mcq') {
            const indexed = q.o.map((o, i) => ({ o, i }));
            shuffle(indexed);
            return { ...q, type: 'mcq', o: indexed.map(x => x.o), correctIdx: indexed.findIndex(x => x.i === q.a) };
        }
        return q;
    });
}
function resetQuestions() {
    let qs = shuffle([...state.base]);
    if (state.mode === 'quick') qs = qs.slice(0, 30);
    state.questions = qs;
}

// ========== منطق اللعبة ==========
function loadQuestion() {
    if (state.timerInterval) clearInterval(state.timerInterval);
    state.answered = false; document.getElementById('hintBox').classList.add('hidden'); document.getElementById('feedbackMsg').textContent = '';
    if (state.qIndex >= state.questions.length) return endGame();
    const q = state.questions[state.qIndex];
    document.getElementById('questionText').textContent = q.q;
    document.getElementById('currentQNumber').textContent = state.qIndex + 1;
    document.getElementById('totalQDisplay').textContent = state.questions.length;
    const optsDiv = document.getElementById('optionsContainer'), tfDiv = document.getElementById('tfContainer');
    if (q.type === 'tf') {
        optsDiv.classList.add('hidden'); tfDiv.classList.remove('hidden');
        document.getElementById('trueBtn').disabled = false; document.getElementById('falseBtn').disabled = false;
        document.getElementById('trueBtn').onclick = () => handleTF(true);
        document.getElementById('falseBtn').onclick = () => handleTF(false);
    } else {
        tfDiv.classList.add('hidden'); optsDiv.classList.remove('hidden');
        optsDiv.innerHTML = '';
        q.o.forEach((opt, idx) => {
            const btn = document.createElement('button'); btn.className = 'option-btn'; btn.textContent = opt;
            btn.onclick = () => checkMCQ(idx); optsDiv.appendChild(btn);
        });
    }
    updateUI();
}

function checkMCQ(sel) {
    if (state.answered) return; state.answered = true;
    const q = state.questions[state.qIndex]; const correct = sel === q.correctIdx;
    const btns = document.querySelectorAll('.option-btn'); btns.forEach(b => b.disabled = true);
    btns[q.correctIdx].classList.add('correct');
    if (correct) correctAns(); else { btns[sel].classList.add('wrong'); state.wrongAnswers.push(q); wrong(`❌ الصواب: ${q.o[q.correctIdx]}`); }
}
function handleTF(ans) {
    if (state.answered) return; state.answered = true;
    const q = state.questions[state.qIndex];
    document.getElementById('trueBtn').disabled = true; document.getElementById('falseBtn').disabled = true;
    if (ans === q.a) correctAns(); else { state.wrongAnswers.push(q); wrong('❌ خطأ'); }
}
function correctAns() {
    state.correct++; state.streak++; state.score += CONFIG.SCORE_PER_Q * (state.streak >= CONFIG.STREAK_BONUS ? 2 : 1);
    state.xp += 10; localStorage.setItem('nahw_xp', state.xp);
    const newLevel = Math.floor(state.xp / CONFIG.XP_PER_LEVEL) + 1;
    if (newLevel > state.level) { state.level = newLevel; confetti(); playSound('correct'); toast('🎉 المستوى ' + newLevel + '!'); }
    else playSound('correct');
    updateUI(); document.getElementById('feedbackMsg').textContent = '✅ إجابة صحيحة!';
    nextQuestion();
}
function wrong(msg) {
    state.wrong++; state.streak = 0; state.lives--; playSound('wrong');
    const q = state.questions[state.qIndex]; if (!state.analytics[q.cat]) state.analytics[q.cat] = 0; state.analytics[q.cat]++;
    updateUI(); document.getElementById('feedbackMsg').textContent = msg;
    if (state.lives <= 0) {
        if (state.mode === 'friend' && state.friend.turn === 1) {
            state.friend.p1.score = state.score; state.friend.turn = 2;
            state.qIndex = 0; state.score = 0; state.lives = CONFIG.MAX_LIVES; state.streak = 0; state.correct = 0; state.wrong = 0;
            resetQuestions(); toast('دور ' + state.friend.p2.name); loadQuestion();
        } else endGame();
    } else nextQuestion(2000);
}
function skipQuestion() {
    if (state.answered) return; state.answered = true; state.lives--; state.skip++;
    updateUI(); if (state.lives <= 0) endGame(); else { document.getElementById('feedbackMsg').textContent = '⏭️ تم التخطي'; nextQuestion(1500); }
}
function nextQuestion(delay = 1500) {
    setTimeout(() => { state.qIndex++; loadQuestion(); }, delay);
}
function endGame() {
    if (state.mode === 'friend') {
        if (state.friend.turn === 1) state.friend.p1.score = state.score;
        else state.friend.p2.score = state.score;
    }
    showScreen('endScreen');
    let result = '', stars = '';
    if (state.mode === 'friend') {
        const p1 = state.friend.p1, p2 = state.friend.p2, w = p1.score > p2.score ? p1.name : (p2.score > p1.score ? p2.name : 'تعادل');
        result = `<div>${p1.name}: ${p1.score} | ${p2.name}: ${p2.score}</div><div style="color:gold;">🏆 ${w}</div>`;
    } else {
        result = `نتيجتك: ${state.score}`;
        const max = state.questions.length * CONFIG.SCORE_PER_Q, pct = max > 0 ? (state.score / max * 100) : 0;
        stars = pct >= 90 ? '⭐⭐⭐⭐⭐' : pct >= 75 ? '⭐⭐⭐⭐' : pct >= 60 ? '⭐⭐⭐' : pct >= 40 ? '⭐⭐' : '⭐';
        if (stars.includes('⭐⭐⭐')) confetti();
    }
    document.getElementById('finalResultContainer').innerHTML = result;
    document.getElementById('starsRating').textContent = stars;
    let analyticsHTML = '';
    for (const [cat, errors] of Object.entries(state.analytics)) {
        if (errors > 0) analyticsHTML += `<div class="analytics-box">⚠️ ضعف في: <strong>${cat}</strong> (${errors} خطأ)</div>`;
    }
    document.getElementById('analyticsReport').innerHTML = analyticsHTML || '<div style="color:var(--green);text-align:center">🌟 لا يوجد نقاط ضعف!</div>';
    document.getElementById('gameStatsContainer').innerHTML = `✅ صحيحة: ${state.correct} | ❌ خاطئة: ${state.wrong}`;
}

// ========== الأحداث ==========
document.querySelectorAll('.grade-btn').forEach(b => b.onclick = e => {
    state.grade = e.target.dataset.grade; prepareQuestions();
    document.getElementById('gradeLabel').textContent = state.grade === 'grade4' ? 'الصف الرابع' : 'الصف الخامس';
    document.getElementById('totalQSubtitle').textContent = state.base.length + ' سؤال';
    showScreen('startScreen');
});
document.getElementById('changeGradeBtn').onclick = () => showScreen('gradeScreen');
document.getElementById('startGameBtn').onclick = () => {
    if (state.mode === 'friend') {
        state.friend.p1.name = document.getElementById('player1Name').value.trim() || 'لاعب 1';
        state.friend.p2.name = document.getElementById('player2Name').value.trim() || 'لاعب 2';
    }
    resetQuestions(); state.qIndex = 0; state.score = 0; state.lives = CONFIG.MAX_LIVES;
    state.streak = 0; state.correct = 0; state.wrong = 0; state.skip = 0; state.wrongAnswers = []; state.analytics = {};
    updateUI(); showScreen('gameScreen'); loadQuestion();
};
document.getElementById('shuffleBtn').onclick = () => { prepareQuestions(); toast('تم خلط الأسئلة'); };
document.querySelectorAll('.mode-btn').forEach(b => b.onclick = e => {
    document.querySelector('.mode-btn.active')?.classList.remove('active'); b.classList.add('active');
    state.mode = b.dataset.mode; document.getElementById('friendNamesPanel').classList.toggle('hidden', state.mode !== 'friend');
});
document.getElementById('skipBtn').onclick = skipQuestion;
document.getElementById('playAgainBtn').onclick = () => showScreen('startScreen');
document.getElementById('reviewMistakesBtn').onclick = () => {
    if (!state.wrongAnswers.length) { toast('لا أخطاء!'); return; }
    state.questions = shuffle([...state.wrongAnswers]);
    state.qIndex = 0; state.score = 0; state.lives = CONFIG.MAX_LIVES; state.streak = 0; state.correct = 0; state.wrong = 0; state.wrongAnswers = [];
    updateUI(); showScreen('gameScreen'); loadQuestion();
};
document.getElementById('saveScoreBtn').onclick = () => {
    const name = document.getElementById('playerNameForLeaderboard').value.trim();
    if (!name) { toast('أدخل اسمك', 'error'); return; }
    const lb = JSON.parse(localStorage.getItem('nahw_leaderboard') || '[]');
    lb.push({ name, score: state.score, level: state.level, date: new Date().toLocaleDateString('ar-EG') });
    lb.sort((a, b) => b.score - a.score);
    localStorage.setItem('nahw_leaderboard', JSON.stringify(lb.slice(0, CONFIG.LEADERBOARD_MAX)));
    toast('تم الحفظ!');
};
document.getElementById('shareBtn').onclick = () => {
    const canvas = document.createElement('canvas'); canvas.width = 400; canvas.height = 300;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = '#0B1120'; ctx.fillRect(0, 0, 400, 300);
    ctx.fillStyle = '#D4AF37'; ctx.font = 'bold 30px Amiri'; ctx.textAlign = 'center'; ctx.fillText('تحدي النحو', 200, 60);
    ctx.fillStyle = '#fff'; ctx.font = '24px Cairo'; ctx.fillText(`النتيجة: ${state.score}`, 200, 130);
    ctx.fillText(document.getElementById('starsRating').textContent, 200, 190);
    canvas.toBlob(blob => {
        const f = new File([blob], 'nahw-result.png');
        if (navigator.share) navigator.share({ files: [f] }).catch(() => {});
        else toast('الصورة جاهزة');
    });
};
document.getElementById('fiftyFifty').onclick = () => {
    if (!state.powers.fifty || state.answered) return;
    state.powers.fifty = false; document.getElementById('fiftyFifty').classList.add('disabled');
    const q = state.questions[state.qIndex]; if (q.type === 'tf') return;
    const wrongs = q.o.map((_, i) => i).filter(i => i !== q.correctIdx);
    const rem = shuffle(wrongs).slice(0, 2);
    document.querySelectorAll('.option-btn').forEach((b, i) => { if (rem.includes(i)) b.style.display = 'none'; });
};
document.getElementById('extraTime').onclick = () => { if (state.powers.time) { state.powers.time = false; document.getElementById('extraTime').classList.add('disabled'); toast('تجميد الوقت!'); } };
document.getElementById('hintPower').onclick = () => {
    if (!state.powers.hint || state.answered) return;
    state.powers.hint = false; document.getElementById('hintPower').classList.add('disabled');
    const hint = state.questions[state.qIndex].hint || 'ركز في السؤال';
    document.getElementById('hintBox').textContent = '💡 ' + hint; document.getElementById('hintBox').classList.remove('hidden');
};

// ========== بدء التطبيق ==========
prepareQuestions();
showScreen('gradeScreen');
setTimeout(() => document.getElementById('splashScreen')?.classList.add('fade-out'), 1500);
