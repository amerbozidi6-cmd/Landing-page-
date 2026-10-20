# AI Landing Page Builder

> **مهم:** GitHub Pages لا يشغّل الخادم، فلن تعمل عليه ميزات الذكاء الاصطناعي والطلبات.
> ارفع المشروع إلى GitHub ثم انشره على **Vercel** (مجاني).

## الخطوات
1. أنشئ مشروعًا على https://supabase.com ثم نفّذ محتوى `supabase.sql` في SQL Editor.
2. من Project Settings → API انسخ `Project URL` و`service_role key`.
3. أنشئ مفتاحًا من https://console.anthropic.com.
4. ارفع كل الملفات إلى مستودع GitHub (مع المجلد `api`).
5. في https://vercel.com اختر Import Git Repository، ثم أضف متغيرات البيئة:
   - `ANTHROPIC_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `ADMIN_KEY` (كلمة سر تختارها أنت)
   - `CLAUDE_MODEL` (اختياري)
6. افتح الموقع؛ سيطلب «مفتاح المدير» عند أول استخدام، أدخل قيمة `ADMIN_KEY`.

## الأمان
- المفاتيح في الخادم فقط، لا في كود الواجهة.
- الزائر يستطيع فقط عرض الصفحات المنشورة وإرسال طلب؛ قراءة الطلبات وإنشاء الصفحات تتطلب `ADMIN_KEY`.
- رابط الصفحة المنشورة: `https://موقعك.vercel.app/#p=ID` (زر «نسخ الرابط» في المحرر).
