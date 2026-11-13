// إعدادات التطبيق
self.SP_CONFIG={
  push: "https://sp-push.chadi-fot.workers.dev",   // رابط الـ Worker (بدون / في النهاية)
  media: "https://sp-media.sonsave-chadi.workers.dev",   // رابط Worker الوسائط (الحساب الثاني) — بدون / في النهاية
  cloudinary: { cloud: "cbp0wt4g", preset: "sp_avatars" },   // رفع صور الحسابات (Unsigned preset) — لا تضع API Secret هنا أبداً
  vapid: "BORERBhsRVaw5hgQTA--bAHRyxdsWVH_cX2hcb8qYjaMsFVD7xg7X25BufRLTkOLnIUJ_JkJsB_7llTLt0zitu4"
};
