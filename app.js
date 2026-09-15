/**
 * GỬI EM BÉ TÚ OANH · MAU KHỎE NHÉ YÊU DẤU 🌸
 * Interactive Experience Engine: Canvas Ambient Particles, Web Audio Synth, Health Tracker, Love Hug Station
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. AMBIENT CANVAS: FLOATING HEARTS & SPARKLES
  // ==========================================
  const canvas = document.getElementById('ambientCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const heartShapes = ['❤️', '💖', '🌸', '✨', '🧸', '💕', '🌷'];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(isBurst = false, burstX = width / 2, burstY = height / 2) {
      this.reset(isBurst, burstX, burstY);
    }

    reset(isBurst = false, burstX = width / 2, burstY = height / 2) {
      this.isBurst = isBurst;
      if (isBurst) {
        this.x = burstX;
        this.y = burstY;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 7 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 2;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
      } else {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = -(Math.random() * 0.8 + 0.5);
        this.alpha = Math.random() * 0.5 + 0.2;
        this.decay = 0;
      }
      this.emoji = heartShapes[Math.floor(Math.random() * heartShapes.length)];
      this.size = Math.random() * 16 + 14;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.04;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.rotationSpeed;

      if (this.isBurst) {
        this.vy += 0.12; // gravity for burst
        this.alpha -= this.decay;
        return this.alpha > 0;
      } else {
        // Floating ambient
        if (this.y < -50 || this.x < -50 || this.x > width + 50) {
          this.reset();
        }
        return true;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.font = `${this.size}px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.emoji, 0, 0);
      ctx.restore();
    }
  }

  // Initial ambient particles
  const totalAmbient = Math.min(35, Math.floor(window.innerWidth / 30));
  for (let i = 0; i < totalAmbient; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // distribute initial heights
    particles.push(p);
  }

  function spawnBurst(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(true, x, y));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const alive = p.update();
      if (alive) {
        p.draw();
      } else {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================
  // 2. WEB AUDIO API: COZY SOUND CHIMES & LULLABY
  // ==========================================
  let audioCtx = null;
  let isLullabyPlaying = false;
  let lullabyInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sweet chime note synth
  function playSweetChime(freq = 587.33, duration = 0.8, type = 'sine') {
    initAudio();
    if (!audioCtx) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio note error:', e);
    }
  }

  // Arpeggio chord for lovely actions
  function playHeartChime() {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => playSweetChime(freq, 1.2, 'sine'), idx * 80);
    });
  }

  // Cozy background lullaby chords generator
  const chords = [
    [261.63, 329.63, 392.00], // C
    [220.00, 261.63, 329.63], // Am
    [174.61, 220.00, 261.63], // F
    [196.00, 246.94, 293.66], // G
  ];
  let chordIndex = 0;

  function playLullabyChord() {
    if (!isLullabyPlaying || !audioCtx) return;
    const currentNotes = chords[chordIndex % chords.length];
    chordIndex++;

    currentNotes.forEach((freq, i) => {
      setTimeout(() => {
        if (!isLullabyPlaying) return;
        playSweetChime(freq * 1.5, 2.5, 'sine');
      }, i * 300);
    });
  }

  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const musicIcon = document.getElementById('musicIcon');

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      initAudio();
      isLullabyPlaying = !isLullabyPlaying;

      if (isLullabyPlaying) {
        musicIcon.textContent = '🔊';
        musicToggleBtn.querySelector('.btn-text').textContent = 'Đang Phát Nhạc Ru';
        musicToggleBtn.style.borderColor = 'var(--primary-rose)';
        musicToggleBtn.style.background = 'rgba(255, 77, 109, 0.15)';
        playLullabyChord();
        lullabyInterval = setInterval(playLullabyChord, 2800);
        showToast('Giai điệu vỗ về êm dịu đang ru em bé ngủ ngoan 🌸');
      } else {
        musicIcon.textContent = '🎵';
        musicToggleBtn.querySelector('.btn-text').textContent = 'Giai Điệu Ấm';
        musicToggleBtn.style.borderColor = '';
        musicToggleBtn.style.background = '';
        clearInterval(lullabyInterval);
      }
    });
  }

  // ==========================================
  // 3. RECOVERY HEALTH TRACKER (CHỈ SỐ HỒI PHỤC)
  // ==========================================
  let healthPercent = 65;
  const progressBarFill = document.getElementById('progressBarFill');
  const wellnessPercent = document.getElementById('wellnessPercent');
  const wellnessStatusText = document.getElementById('wellnessStatusText');

  const actionTeaBtn = document.getElementById('actionTeaBtn');
  const actionHeatBtn = document.getElementById('actionHeatBtn');
  const actionHugBtn = document.getElementById('actionHugBtn');

  function addHealth(amount, msg) {
    playHeartChime();
    healthPercent = Math.min(100, healthPercent + amount);

    progressBarFill.style.width = healthPercent + '%';
    wellnessPercent.textContent = healthPercent + '%';

    if (healthPercent >= 100) {
      wellnessStatusText.textContent = '🎉 100% Hoàn Hảo! Tú Oanh đã hết hẳn đau bụng, khỏe re và cười tươi rồi!';
      spawnBurst(window.innerWidth / 2, window.innerHeight / 3, 60);
      showModal(
        'Tú Oanh Khỏe Lại 100% Rồi! 🎉🌸',
        'Chúc mừng em bé iu của anh! Cơn đau bụng đã hoàn toàn tan biến nhờ vào sự chăm sóc và ngàn cái ôm của anh. Bây giờ em có thể tha hồ tươi vui rồi nhen!',
        '💖'
      );
    } else if (healthPercent >= 85) {
      wellnessStatusText.textContent = 'Đang rất dễ chịu rồi, bụng ấm dần lên và không còn nhói nữa!';
    } else {
      wellnessStatusText.textContent = 'Bụng đang đỡ dần, từng giọt yêu thương đang xoa dịu em bé!';
    }

    if (msg) showToast(msg);
  }

  if (actionTeaBtn) {
    actionTeaBtn.addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top, 15);
      addHealth(10, '🍵 Đã uống 1 ngụm trà ấm! Bụng Oanh ấm ran lên (+10%)');
    });
  }

  if (actionHeatBtn) {
    actionHeatBtn.addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top, 15);
      addHealth(10, '🧸 Túi chườm gấu bông đang sưởi ấm bụng Oanh (+10%)');
    });
  }

  if (actionHugBtn) {
    actionHugBtn.addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top, 25);
      addHealth(15, '🫂 Nhận trọn vẹn cái ôm ấm áp của anh (+15%)');
    });
  }

  // ==========================================
  // 4. BIG HUG BUTTON & LOVE WHISPERS
  // ==========================================
  const bigHugBtn = document.getElementById('bigHugBtn');
  const hugCountNumber = document.getElementById('hugCountNumber');
  const whisperText = document.getElementById('whisperText');
  let hugCount = 1024;

  const loveWhispers = [
    '"Anh thương bé Oanh nhiều lắm. Cơn đau bụng mau tan đi để em bé của anh lại mỉm cười rạng rỡ nha!"',
    '"Mỗi khi em mệt, hãy nhớ rằng anh luôn ở cạnh em, luôn là chỗ dựa vững chắc nhất của Tú Oanh."',
    '"Uống thêm ngụm trà ấm, nằm ngoan đắp chăn nhé em bé iu. Anh đang xoa lưng từ xa cho em đây."',
    '"Bé Oanh của anh giỏi lắm, chịu khó xíu xiu thôi là chiếc bụng nhỏ sẽ hết quấy rầy em liền."',
    '"Nếu có thể đổi cơn đau của em sang anh, anh sẵn sàng nhận hết để Oanh luôn được an yên."',
    '"Mau khỏe lại nhé công chúa của anh! Cả thế giới này có anh lo cho em rồi, đừng sợ mệt nha."',
    '"Gửi 10.000 nụ hôn lên trán và má của em bé Tú Oanh. Yêu thương và cưng chiều em nhất trần đời!"',
    '"Hết đau bụng anh dắt em đi ăn thật nhiều món ngon, đi hóng gió ngắm hoàng hôn với em nha!"'
  ];
  let whisperIndex = 0;

  if (bigHugBtn) {
    bigHugBtn.addEventListener('click', (e) => {
      hugCount++;
      hugCountNumber.textContent = hugCount.toLocaleString();

      // Sound & Burst
      playHeartChime();
      const rect = bigHugBtn.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);

      // Rotate whispers
      whisperIndex = (whisperIndex + 1) % loveWhispers.length;
      whisperText.style.opacity = '0';
      setTimeout(() => {
        whisperText.textContent = loveWhispers[whisperIndex];
        whisperText.style.opacity = '1';
      }, 200);

      // Add slight health if not full
      if (healthPercent < 100) {
        addHealth(5);
      }
    });
  }

  // ==========================================
  // 5. LOVE PRESCRIPTION ACTIONS
  // ==========================================
  const rxBrewBtn = document.getElementById('rxBrewBtn');
  const rxHeatBtn = document.getElementById('rxHeatBtn');
  const rxHugBtn = document.getElementById('rxHugBtn');
  const rxSleepBtn = document.getElementById('rxSleepBtn');

  if (rxBrewBtn) {
    rxBrewBtn.addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top, 15);
      addHealth(10);
      showModal('Đã Rót Trà Gừng Mật Ong 🍵', 'Tách trà ấm 39°C ngọt ngào đã sẵn sàng. Em bé Tú Oanh nhấp từng ngụm nhỏ, hơi ấm sẽ xua tan cơn co thắt ngay tức khắc!', '🫖');
    });
  }

  if (rxHeatBtn) {
    rxHeatBtn.addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top, 15);
      addHealth(10);
      showModal('Túi Chườm Ấm Gấu Bông Đã Bật 🔥', 'Túi chườm mềm mịn hình gấu bông đang áp nhẹ lên bụng em. Nằm nghiêng co gối một chút cho cơ thể thả lỏng tối đa nha em iu!', '🧸');
    });
  }

  if (rxHugBtn) {
    rxHugBtn.addEventListener('click', (e) => {
      const rect = e.target.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top, 25);
      addHealth(15);
      showModal('Triệu Cái Ôm Gửi Đến Oanh 🫂💖', 'Anh đang ôm trọn em vào lòng, một tay đỡ lưng một tay xoa bụng cho em bé. Cứ yên tâm nhắm mắt tựa vào lòng anh nhé!', '🥰');
    });
  }

  if (rxSleepBtn) {
    rxSleepBtn.addEventListener('click', () => {
      initAudio();
      if (!isLullabyPlaying && musicToggleBtn) {
        musicToggleBtn.click();
      }
      showModal('Giấc Ngủ Ngon Cho Em Bé 🌙', 'Đã bật giai điệu ru êm ái. Giờ thì Oanh cất điện thoại sang một bên, đắp chăn kín cổ và ngủ một giấc thật sâu nhé. Anh luôn ở đây bảo vệ em!', '💤');
    });
  }

  // ==========================================
  // 6. TEA CORNER ACTIONS
  // ==========================================
  const pourMoreTeaBtn = document.getElementById('pourMoreTeaBtn');
  const teaTempText = document.getElementById('teaTempText');

  if (pourMoreTeaBtn) {
    let brewTimes = 0;
    pourMoreTeaBtn.addEventListener('click', (e) => {
      brewTimes++;
      playHeartChime();
      const rect = e.target.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top, 20);

      teaTempText.textContent = `Nhiệt độ hiện tại: 42°C (Vừa rót mẻ trà gừng mật ong thơm ngát lần ${brewTimes})`;
      showToast('🫖 Tách trà ấm đã được châm đầy thơm lừng cho Oanh!');
    });
  }

  // ==========================================
  // 7. VIP VOUCHERS CLAIM
  // ==========================================
  const voucherButtons = document.querySelectorAll('.btn-claim-voucher');
  voucherButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const title = btn.getAttribute('data-title') || 'Voucher VIP';
      playHeartChime();
      const rect = btn.getBoundingClientRect();
      spawnBurst(rect.left + rect.width / 2, rect.top, 30);

      btn.textContent = 'Đã Kích Hoạt ✅';
      btn.style.background = '#52b788';
      btn.disabled = true;

      showModal(
        `Kích Hoạt Thành Công: "${title}" 🎟️✨`,
        `Đặc quyền này đã được gửi trực tiếp tới điện thoại của anh! Anh nhận lệnh và sẽ phục vụ em bé Tú Oanh với 1000% sự ân cần và chu đáo nhất!`,
        '👑'
      );
    });
  });

  // ==========================================
  // 8. PRINT / PDF EXPORT HANDLER
  // ==========================================
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      playSweetChime(880, 0.5);
      window.print();
    });
  }

  // ==========================================
  // 9. MODAL CONTROLLER & TOAST SYSTEM
  // ==========================================
  const alertModal = document.getElementById('alertModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalMsg = document.getElementById('modalMsg');
  const modalIcon = document.getElementById('modalIcon');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function showModal(title, msg, icon = '💖') {
    if (!alertModal) return;
    modalTitle.textContent = title;
    modalMsg.textContent = msg;
    modalIcon.textContent = icon;
    alertModal.classList.add('active');
  }

  function closeModal() {
    if (alertModal) alertModal.classList.remove('active');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (alertModal) {
    alertModal.addEventListener('click', (e) => {
      if (e.target === alertModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Quick toast message popup
  function showToast(text) {
    const existing = document.querySelector('.custom-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = text;
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    toast.style.background = 'rgba(45, 24, 34, 0.88)';
    toast.style.backdropFilter = 'blur(8px)';
    toast.style.color = '#ffffff';
    toast.style.padding = '12px 24px';
    toast.style.borderRadius = '9999px';
    toast.style.fontSize = '0.92rem';
    toast.style.fontWeight = '700';
    toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.18)';
    toast.style.zIndex = '1000';
    toast.style.opacity = '0';
    toast.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
    toast.style.pointerEvents = 'none';

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  }

  // ==========================================
  // 10. QR CODE & PUBLIC URL COPY LOGIC
  // ==========================================
  const qrNavBtn = document.getElementById('qrNavBtn');
  const heroQrBtn = document.getElementById('heroQrBtn');
  const publicUrlPill = document.getElementById('publicUrlPill');
  const qrModal = document.getElementById('qrModal');
  const qrModalCloseBtn = document.getElementById('qrModalCloseBtn');
  const copyQrUrlBtn = document.getElementById('copyQrUrlBtn');
  const qrUrlInput = document.getElementById('qrUrlInput');
  const copyBtnLabel = document.getElementById('copyBtnLabel');

  function openQrModal() {
    if (!qrModal) return;
    playSweetChime(784, 0.4);
    qrModal.classList.add('active');
  }

  function closeQrModal() {
    if (qrModal) qrModal.classList.remove('active');
  }

  if (qrNavBtn) qrNavBtn.addEventListener('click', openQrModal);
  if (heroQrBtn) heroQrBtn.addEventListener('click', openQrModal);
  if (qrModalCloseBtn) qrModalCloseBtn.addEventListener('click', closeQrModal);
  if (qrModal) {
    qrModal.addEventListener('click', (e) => {
      if (e.target === qrModal) closeQrModal();
    });
  }

  function copyPublicUrl() {
    const url = 'https://solutions-nor-above-cam.trycloudflare.com';
    navigator.clipboard.writeText(url).then(() => {
      playHeartChime();
      showToast('📋 Đã sao chép link công khai cho bé Tú Oanh!');
      if (copyBtnLabel) {
        copyBtnLabel.textContent = 'Đã Chép! ✅';
        setTimeout(() => { copyBtnLabel.textContent = 'Sao Chép'; }, 2000);
      }
    }).catch(() => {
      if (qrUrlInput) {
        qrUrlInput.select();
        document.execCommand('copy');
        showToast('📋 Đã sao chép link!');
      }
    });
  }

  if (publicUrlPill) publicUrlPill.addEventListener('click', copyPublicUrl);
  if (copyQrUrlBtn) copyQrUrlBtn.addEventListener('click', copyPublicUrl);
});

