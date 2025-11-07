document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  const tryBtn = document.getElementById('tryBtn');
  const copySample = document.getElementById('copySample');
  const sampleOutput = document.getElementById('sampleOutput');
  const generateBtn = document.getElementById('generateBtn');
  const copyEmail = document.getElementById('copyEmail');
  const inputUrl = document.getElementById('inputUrl');
  const toneSelect = document.getElementById('toneSelect');
  const goalSelect = document.getElementById('goalSelect');
  const generatedEmail = document.getElementById('generatedEmail');
  const billingToggle = document.getElementById('billingToggle');

  if (tryBtn) {
    tryBtn.addEventListener('click', () => {
      const mock = `Hi Alex,\n\nI came across your profile and loved your work at Acme Co. Our AI outreach tool has helped teams like yours boost demo-to-trial conversions by 20%.\n\nWould you be open to a short call next week?\n\nBest,\nJordan — ColdSnap.ai`;
      sampleOutput.textContent = mock;
      showToast('Sample email generated');
    });
  }

  if (copySample) {
    copySample.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(sampleOutput.textContent);
        showToast('Copied to clipboard ✅');
      } catch {
        showToast('Copy failed — please copy manually ❗');
      }
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const url = inputUrl.value.trim() || 'https://example.com';
      const tone = toneSelect.value;
      const goal = goalSelect.value;
      const name = extractName(url);
      const email = buildEmail(name, tone, goal);
      generatedEmail.value = email;
      showToast('Email generated ✉️');
    });
  }

  if (copyEmail) {
    copyEmail.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(generatedEmail.value);
        showToast('Email copied 📋');
      } catch {
        showToast('Failed to copy ❌');
      }
    });
  }

  if (billingToggle) {
    billingToggle.addEventListener('change', () => {
      const isMonthly = !billingToggle.checked;
      document.querySelectorAll('.price-card .amount').forEach(el => {
        const m = el.dataset.monthly;
        const y = el.dataset.yearly;
        el.textContent = isMonthly ? m : y;
      });
      document.querySelectorAll('.price-card .period').forEach(p => {
        p.textContent = isMonthly ? '/mo' : '/yr';
      });
      showToast(isMonthly ? 'Switched to Monthly' : 'Switched to Yearly');
    });
  }

  // utility functions
  function extractName(url) {
    try {
      const u = new URL(url);
      const part = u.pathname.split('/').filter(Boolean).pop();
      if (!part) return 'there';
      return capitalize(part.replace(/[-_]/g, ' ').replace(/\d+/g, '').trim());
    } catch {
      return 'there';
    }
  }

  function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function buildEmail(name, tone, goal) {
    const openings = {
      friendly: `Hey ${name} 👋`,
      direct: `Hi ${name},`,
      professional: `Hello ${name},`,
    };
    const body = {
      sales: `I noticed your focus on growth and thought you might be interested in a tool that boosts reply rates by 20–30% through AI personalization.`,
      recruit: `I came across your profile and wanted to share an opportunity that seems like a great fit for your background.`,
      partnership: `I believe our products could complement each other nicely — it might be worth a quick conversation.`,
    };
    const closing = tone === 'friendly' ? `Cheers,\nJordan\nColdSnap AI` : `Best regards,\nJordan\nColdSnap AI`;
    return `${openings[tone] || openings.professional}\n\n${body[goal]}\n\n${closing}`;
  }
});
