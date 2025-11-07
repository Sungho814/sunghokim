/* Interactive demo behaviour (all client-side; mock generation) */
document.addEventListener('DOMContentLoaded', () => {
  const tryBtn = document.getElementById('tryBtn');
  const sampleOutput = document.getElementById('sampleOutput');
  const copySample = document.getElementById('copySample');

  const generateBtn = document.getElementById('generateBtn');
  const inputUrl = document.getElementById('inputUrl');
  const toneSelect = document.getElementById('toneSelect');
  const goalSelect = document.getElementById('goalSelect');
  const generatedEmail = document.getElementById('generatedEmail');
  const copyEmail = document.getElementById('copyEmail');

  const toast = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg){
    if (toastTimer) clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('show');
    toastTimer = setTimeout(()=> toast.classList.remove('show'), 2000);
  }

  // Mock generator for hero sample
  tryBtn.addEventListener('click', () => {
    const mock = `Hi Alex,\n\nI came across your profile and loved how you led growth at Acme Co. I work with teams like yours to help increase demo-to-trial conversions by 20% using targeted outreach. Would you be open to a 15-min call next week to explore?\n\nBest,\nJordan — ColdSnap.ai`;
    sampleOutput.textContent = mock;
  });

  copySample.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(sampleOutput.textContent);
      showToast('Sample copied to clipboard');
    } catch {
      showToast('Copy failed — please select and copy manually');
    }
  });

  // Pricing toggle (monthly/yearly)
  const billingToggle = document.getElementById('billingToggle');
  billingToggle.addEventListener('change', () => {
    const monthly = !billingToggle.checked;
    document.querySelectorAll('.price-card .amount').forEach(el => {
      const m = el.getAttribute('data-monthly');
      const y = el.getAttribute('data-yearly');
      el.textContent = monthly ? m : y;
    });
    document.querySelectorAll('.price-card .period').forEach(p => {
      p.textContent = monthly ? '/mo' : '/yr';
    });
  });

  // Mock email generator
  generateBtn.addEventListener('click', () => {
    const url = inputUrl.value.trim() || 'https://example.com';
    const tone = toneSelect.value;
    const goal = goalSelect.value;

    // Mock profile extraction (client-side heuristic)
    const name = extractNameFromUrl(url);
    const opener = generateOpener(name, tone, goal);
    const body = generateBody(name, tone, goal);
    const closing = generateClosing(tone);

    const email = `${opener}\n\n${body}\n\n${closing}`;
    generatedEmail.value = email;
    generatedEmail.focus();
    showToast('Mock email generated');
  });

  copyEmail.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(generatedEmail.value);
      showToast('Email copied to clipboard');
    } catch {
      showToast('Copy failed — please select and copy manually');
    }
  });

  // Small utilities for mock generation
  function extractNameFromUrl(url){
    try {
      const u = new URL(url);
      const path = u.pathname.split('/').filter(Boolean);
      if (path.length && path[0].length < 25) return capitalize(cleanString(path[path.length-1]));
    } catch {}
    return 'there';
  }
  function cleanString(s){ return s.replace(/[-_]/g,' ').replace(/\d+/g,'').trim(); }
  function capitalize(s){ return s.charAt(0).toUpperCase() + s.slice(1); }

  function generateOpener(name, tone, goal){
    if (name === 'there') return `Hi ${capitalize(name)},`;
    if (tone === 'friendly') return `Hey ${name} 👋`;
    if (tone === 'direct') return `Hi ${name},`;
    return `Hi ${name},`;
  }

  function generateBody(name, tone, goal){
    // short mock templates
    const goals = {
      sales: `I noticed you focus on growth and thought you might be interested in a tool that boosts reply rates using hyper-personalized outreach. Our customers typically see a 15–30% lift in replies within the first month.`,
      recruit: `I was impressed by your background and wanted to share a role that I think aligns with your experience. If you're open, I can send a short overview and explore fit.`,
      partnership: `I saw overlap between your product and our service — there may be an opportunity to collaborate to bring more value to your customers. Would you be open to a quick conversation?`
    };
    const tones = {
      professional: `${goals[goal]} Would you be open to a 15-minute call next week to explore?`,
      friendly: `${goals[goal]} No pressure — if this sounds useful, I’d love to chat for 10–15 minutes.`,
      direct: `${goals[goal]} Are you available for a call next week?`,
      curiosity: `Quick question — would you be interested in exploring a new approach to outreach that personalizes at scale?`
    };
    return tones[tone] || tones.professional;
  }

  function generateClosing(tone){
    if (tone === 'friendly') return `Cheers,\nJordan\nColdSnap AI`;
    return `Best regards,\nJordan\nColdSnap AI`;
  }

  // open link helper
  window.openLink = function(url){ window.open(url, '_blank'); };

});