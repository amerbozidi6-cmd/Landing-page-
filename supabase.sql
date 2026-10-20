create table if not exists docs (
  col  text not null,
  id   text not null,
  data jsonb not null,
  primary key (col, id)
);
-- لا سياسات عامة: الوصول يتم فقط عبر مفتاح الخدمة من الخادم
alter table docs enable row level security;
