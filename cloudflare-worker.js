// ═══════════════════════════════════════════════════════════
// BC Electric — Cloudflare Worker v2.0
// يراقب Firebase كل دقيقة ويرسل إشعارات Push بلغة المستخدم
// ═══════════════════════════════════════════════════════════

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/send-test') {
      await checkAndSendNotifications(env);
      return new Response('OK', { status: 200 });
    }
    if (url.pathname === '/health') {
      return new Response('BC Electric Worker Running ✅', { status: 200 });
    }
    return new Response('BC Electric Worker v2.0', { status: 200 });
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(checkAndSendNotifications(env));
  }
};

// ═══════════════════════════════════════════════════════════
// ترجمات الإشعارات — عربي / إنجليزي / فرنسي
// ═══════════════════════════════════════════════════════════
const TRANSLATIONS = {
  ar: {
    titles: {
      attendance_recorded:     '✅ تم تسجيل الحضور',
      attendance_edited:       '✏️ تعديل سجل الحضور',
      attendance_deleted:      '🗑️ حذف سجل الحضور',
      payment_recorded:        '💰 دفعة جديدة',
      bonus_granted:           '🎁 مكافأة جديدة',
      new_message:             '💬 رسالة جديدة',
      new_request:             '📋 طلب جديد',
      request_response:        '📩 رد على طلبك',
      special_work_added:      '⭐ عمل خاص مضاف',
      share_settled:           '🤝 توزيع الحصص',
      negative_points_warning: '⚠️ تحذير: نقاط سالبة',
      month_end_warning:       '⚠️ تحذير نهاية الشهر',
      default:                 '🔔 BC Electric',
    },
    bodies: {
      attendance_recorded: (n) => `تم تسجيل حضورك بتاريخ ${n.date || ''}`,
      attendance_edited:   (n) => `تم تعديل سجل حضورك بتاريخ ${n.date || ''}`,
      attendance_deleted:  (n) => `تم حذف سجل حضورك بتاريخ ${n.date || ''}`,
      payment_recorded:    (n) => `تم تسجيل دفعة ${n.amount || ''} دج`,
      bonus_granted:       (n) => `مكافأة ${n.amount || ''} دج — ${n.reason || ''}`,
      new_message:         (n) => n.preview || 'لديك رسالة جديدة',
      new_request:         (n) => `طلب جديد: ${n.requestType || ''}`,
      request_response:    (n) => n.approved ? '✅ تم قبول طلبك' : '❌ تم رفض طلبك',
      special_work_added:  (n) => `عمل خاص: ${n.description || ''}`,
      share_settled:       (n) => `تم توزيع حصص ${n.month || ''}`,
      negative_points_warning: (n) => `رصيد نقاطك ${n.points || ''} — يرجى مراجعة الإدارة`,
      default:             ()  => 'لديك إشعار جديد من BC Electric',
    }
  },
  en: {
    titles: {
      attendance_recorded:     '✅ Attendance Recorded',
      attendance_edited:       '✏️ Attendance Updated',
      attendance_deleted:      '🗑️ Attendance Deleted',
      payment_recorded:        '💰 New Payment',
      bonus_granted:           '🎁 New Bonus',
      new_message:             '💬 New Message',
      new_request:             '📋 New Request',
      request_response:        '📩 Request Response',
      special_work_added:      '⭐ Special Work Added',
      share_settled:           '🤝 Shares Distributed',
      negative_points_warning: '⚠️ Negative Points Warning',
      month_end_warning:       '⚠️ Month End Warning',
      default:                 '🔔 BC Electric',
    },
    bodies: {
      attendance_recorded: (n) => `Your attendance was recorded on ${n.date || ''}`,
      attendance_edited:   (n) => `Your attendance was updated on ${n.date || ''}`,
      attendance_deleted:  (n) => `Your attendance was deleted on ${n.date || ''}`,
      payment_recorded:    (n) => `A payment of ${n.amount || ''} DZD was recorded`,
      bonus_granted:       (n) => `Bonus: ${n.amount || ''} DZD — ${n.reason || ''}`,
      new_message:         (n) => n.preview || 'You have a new message',
      new_request:         (n) => `New request: ${n.requestType || ''}`,
      request_response:    (n) => n.approved ? '✅ Your request was approved' : '❌ Your request was rejected',
      special_work_added:  (n) => `Special work: ${n.description || ''}`,
      share_settled:       (n) => `Shares distributed for ${n.month || ''}`,
      negative_points_warning: (n) => `Your points balance is ${n.points || ''} — please contact management`,
      default:             ()  => 'You have a new notification from BC Electric',
    }
  },
  fr: {
    titles: {
      attendance_recorded:     '✅ Présence Enregistrée',
      attendance_edited:       '✏️ Présence Modifiée',
      attendance_deleted:      '🗑️ Présence Supprimée',
      payment_recorded:        '💰 Nouveau Paiement',
      bonus_granted:           '🎁 Nouvelle Prime',
      new_message:             '💬 Nouveau Message',
      new_request:             '📋 Nouvelle Demande',
      request_response:        '📩 Réponse à votre demande',
      special_work_added:      '⭐ Travail Spécial Ajouté',
      share_settled:           '🤝 Parts Distribuées',
      negative_points_warning: '⚠️ Avertissement Points Négatifs',
      month_end_warning:       '⚠️ Avertissement Fin de Mois',
      default:                 '🔔 BC Electric',
    },
    bodies: {
      attendance_recorded: (n) => `Votre présence a été enregistrée le ${n.date || ''}`,
      attendance_edited:   (n) => `Votre présence a été modifiée le ${n.date || ''}`,
      attendance_deleted:  (n) => `Votre présence a été supprimée le ${n.date || ''}`,
      payment_recorded:    (n) => `Un paiement de ${n.amount || ''} DZD a été enregistré`,
      bonus_granted:       (n) => `Prime: ${n.amount || ''} DZD — ${n.reason || ''}`,
      new_message:         (n) => n.preview || 'Vous avez un nouveau message',
      new_request:         (n) => `Nouvelle demande: ${n.requestType || ''}`,
      request_response:    (n) => n.approved ? '✅ Votre demande a été approuvée' : '❌ Votre demande a été rejetée',
      special_work_added:  (n) => `Travail spécial: ${n.description || ''}`,
      share_settled:       (n) => `Parts distribuées pour ${n.month || ''}`,
      negative_points_warning: (n) => `Votre solde de points est ${n.points || ''} — veuillez contacter la direction`,
      default:             ()  => 'Vous avez une nouvelle notification de BC Electric',
    }
  }
};

function getLocalizedNotif(notif, lang) {
  const L = TRANSLATIONS[lang] || TRANSLATIONS['ar'];
  const type = notif.type || 'default';
  const title = L.titles[type] || L.titles.default;
  const bodyFn = L.bodies[type] || L.bodies.default;
  const body = bodyFn(notif);
  return { title, body };
}

// ═══════════════════════════════════════════════════════════
// الدالة الرئيسية
// ═══════════════════════════════════════════════════════════
async function checkAndSendNotifications(env) {
  try {
    const FIREBASE = env.FIREBASE_URL;

    const [notifRes, subsRes, lastSentRes] = await Promise.all([
      fetch(`${FIREBASE}/notifications.json?orderBy="timestamp"&limitToLast=30`),
      fetch(`${FIREBASE}/pushSubscriptions.json`),
      fetch(`${FIREBASE}/workerState/lastSentTime.json`)
    ]);

    const notifications = notifRes.ok ? await notifRes.json() : null;
    const subscriptions = subsRes.ok  ? await subsRes.json()  : null;
    const lastSentTime  = lastSentRes.ok ? await lastSentRes.json() : 0;

    if (!notifications || !subscriptions) return;

    const newNotifs = Object.entries(notifications)
      .filter(([, n]) => n && n.timestamp && n.timestamp > (lastSentTime || 0))
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    if (newNotifs.length === 0) return;

    let newLastSent = lastSentTime;

    for (const [notifKey, notif] of newNotifs) {
      for (const [subKey, sub] of Object.entries(subscriptions)) {
        if (!sub || !sub.endpoint) continue;

        const shouldSend =
          (notif.forAdmin    && sub.isAdmin) ||
          (notif.forEmployee && sub.employeeId === notif.employeeId);

        if (!shouldSend) continue;

        // ─── استخدام لغة المستخدم المحفوظة ───
        const lang = sub.lang || 'ar';
        const { title, body } = getLocalizedNotif(notif, lang);

        try {
          await sendWebPush(env, sub, { title, body, tag: notifKey });
        } catch (e) {
          if (e.status === 410 || e.status === 404) {
            await fetch(`${FIREBASE}/pushSubscriptions/${subKey}.json`, { method: 'DELETE' });
          }
        }
      }
      if (notif.timestamp > newLastSent) newLastSent = notif.timestamp;
    }

    await fetch(`${FIREBASE}/workerState/lastSentTime.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLastSent)
    });

  } catch (err) {
    console.error('[Worker Error]', err);
  }
}

// ═══════════════════════════════════════════════════════════
// Web Push
// ═══════════════════════════════════════════════════════════
async function sendWebPush(env, subscription, payload) {
  const { endpoint, keys } = subscription;
  const jwt = await buildVapidJWT(env, endpoint);
  const encrypted = await encryptPayload(payload, keys.p256dh, keys.auth);

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `vapid t=${jwt},k=${env.VAPID_PUBLIC_KEY}`,
      'Content-Type': 'application/octet-stream',
      'Content-Encoding': 'aes128gcm',
      'TTL': '86400',
    },
    body: encrypted
  });

  if (!res.ok && res.status !== 201) {
    const err = new Error(`Push failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }
}

async function buildVapidJWT(env, endpoint) {
  const origin = new URL(endpoint).origin;
  const now = Math.floor(Date.now() / 1000);
  const header  = b64url(JSON.stringify({ typ: 'JWT', alg: 'ES256' }));
  const payload = b64url(JSON.stringify({
    aud: origin,
    exp: now + 12 * 3600,
    sub: `mailto:${env.CONTACT_EMAIL || 'admin@bcelectric.dz'}`
  }));
  const data = `${header}.${payload}`;
  const keyBytes = base64urlDecode(env.VAPID_PRIVATE_KEY);
  const cryptoKey = await crypto.subtle.importKey(
    'raw', keyBytes, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' }, cryptoKey, new TextEncoder().encode(data)
  );
  return `${data}.${arrayToBase64url(sig)}`;
}

async function encryptPayload(payload, p256dhB64, authB64) {
  const payloadBytes = new TextEncoder().encode(JSON.stringify(payload));
  const p256dh = base64urlDecode(p256dhB64);
  const auth   = base64urlDecode(authB64);

  const localKeys = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']
  );
  const localPub = await crypto.subtle.exportKey('raw', localKeys.publicKey);
  const remoteKey = await crypto.subtle.importKey(
    'raw', p256dh, { name: 'ECDH', namedCurve: 'P-256' }, false, []
  );
  const sharedBits = await crypto.subtle.deriveBits(
    { name: 'ECDH', public: remoteKey }, localKeys.privateKey, 256
  );
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk   = await hkdf(auth,  new Uint8Array(sharedBits), buildInfo('auth', null, null), 32);
  const cek   = await hkdf(salt,  prk, buildInfo('aesgcm', p256dh, new Uint8Array(localPub)), 16);
  const nonce = await hkdf(salt,  prk, buildInfo('nonce',  p256dh, new Uint8Array(localPub)), 12);

  const encKey = await crypto.subtle.importKey('raw', cek, 'AES-GCM', false, ['encrypt']);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, encKey, payloadBytes);

  const header = new Uint8Array(21 + localPub.byteLength);
  header.set(salt, 0);
  new DataView(header.buffer).setUint32(16, 4096, false);
  header[20] = localPub.byteLength;
  header.set(new Uint8Array(localPub), 21);

  const result = new Uint8Array(header.byteLength + ciphertext.byteLength);
  result.set(header, 0);
  result.set(new Uint8Array(ciphertext), header.byteLength);
  return result.buffer;
}

async function hkdf(salt, ikm, info, length) {
  const key = await crypto.subtle.importKey('raw', ikm, 'HKDF', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'HKDF', hash: 'SHA-256', salt, info }, key, length * 8
  );
  return new Uint8Array(bits);
}

function buildInfo(type, p256dh, localPub) {
  if (type === 'auth') return new TextEncoder().encode('Content-Encoding: auth\0');
  const label = new TextEncoder().encode(`Content-Encoding: ${type}\0P-256\0`);
  const result = new Uint8Array(label.byteLength + 2 + p256dh.length + 2 + localPub.length);
  let o = 0;
  result.set(label, o); o += label.byteLength;
  new DataView(result.buffer).setUint16(o, p256dh.length, false); o += 2;
  result.set(p256dh, o); o += p256dh.length;
  new DataView(result.buffer).setUint16(o, localPub.length, false); o += 2;
  result.set(localPub, o);
  return result;
}

function b64url(str) {
  return btoa(str).replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}
function arrayToBase64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf)))
    .replace(/\+/g,'-').replace(/\//g,'_').replace(/=/g,'');
}
function base64urlDecode(s) {
  const pad = s.length % 4 === 0 ? '' : '===='.slice(s.length % 4);
  return Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/') + pad), c => c.charCodeAt(0));
}
