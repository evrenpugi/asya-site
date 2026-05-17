// 📊 FIREBASE LOG
const DB_URL =
"https://dogum-d1b8a-default-rtdb.europe-west1.firebasedatabase.app/logs";

let logCounter = 1;

const sessionDateObj = new Date();

const sessionDate =
  sessionDateObj.getFullYear() + "-" +
  String(sessionDateObj.getMonth()+1).padStart(2,"0") + "-" +
  String(sessionDateObj.getDate()).padStart(2,"0");

const sessionId =
  "oturum_" +
  String(sessionDateObj.getHours()).padStart(2,"0") + "-" +
  String(sessionDateObj.getMinutes()).padStart(2,"0") + "-" +
  String(sessionDateObj.getSeconds()).padStart(2,"0");

function logAction(actionName, extraData = {}) {

  const now = new Date();

  const saat =
    String(now.getHours()).padStart(2,"0") + "-" +
    String(now.getMinutes()).padStart(2,"0") + "-" +
    String(now.getSeconds()).padStart(2,"0");

  const safeAction =
    actionName
    .replace(/\s+/g,"_")
    .replace(/[^\wğüşıöçĞÜŞİÖÇ_-]/g,"");

  const key =
    `${String(logCounter).padStart(2,"0")}_${safeAction}_${saat}`;

  logCounter++;

  fetch(`${DB_URL}/${sessionDate}/${sessionId}/${encodeURIComponent(key)}.json`,{
    method:"PUT",
    body:JSON.stringify({
      date:sessionDate,
      time:saat,
      fullTime:now.toLocaleString('tr-TR'),
      session:sessionId,
      action:actionName,
      detail:extraData,
      device:navigator.userAgent,
      screen:`${window.innerWidth}x${window.innerHeight}`,
      isInstagram:navigator.userAgent.includes("Instagram"),
      isWhatsApp:navigator.userAgent.includes("WhatsApp")
    })
  }).catch(()=>{});
}

async function logVisitWithLocation(){
  try{
    const response = await fetch("https://ipapi.co/json/");
    const data = await response.json();

    logAction("Sayfaya Girildi",{
      city:data.city,
      region:data.region,
      country:data.country_name,
      isp:data.org
    });

  }catch(error){
    logAction("Sayfaya Girildi",{
      note:"Lokasyon alınamadı"
    });
  }
}

document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState === "hidden"){
    logAction("Sayfadan Çıktı / Arka Plana Attı");
  }
});

// 🌌 YILDIZLAR
function createStars(){

  const stars =
  document.getElementById("stars");

  for(let i=0;i<140;i++){

    const wrap =
    document.createElement("div");

    wrap.classList.add("star-wrap");

    wrap.style.left =
    Math.random()*100 + "vw";

    wrap.style.top =
    Math.random()*100 + "vh";

    const star =
    document.createElement("div");

    star.classList.add("star");

    const size =
    Math.random()*3 + 1;

    star.style.width =
    size + "px";

    star.style.height =
    size + "px";

    star.style.animationDuration =
    (2 + Math.random()*4) + "s";

    wrap.appendChild(star);
    stars.appendChild(wrap);
  }
}

createStars();

// ✨ TOUCH STAR EFFECT
function moveStars(x,y){

  document
  .querySelectorAll(".star-wrap")
  .forEach(star=>{

    const rect =
    star.getBoundingClientRect();

    const starX =
    rect.left + rect.width / 2;

    const starY =
    rect.top + rect.height / 2;

    const dx = starX - x;
    const dy = starY - y;

    const distance =
    Math.sqrt(dx*dx + dy*dy);

    if(distance > 0 && distance < 130){

      const force =
      (130 - distance) / 9;

      const moveX =
      (dx / distance) * force;

      const moveY =
      (dy / distance) * force;

      star.style.transform =
      `translate(${moveX}px,${moveY}px)`;

    }else{

      star.style.transform =
      "translate(0,0)";
    }
  });
}

document.addEventListener("touchmove",e=>{
  const touch = e.touches[0];

  if(touch){
    moveStars(touch.clientX,touch.clientY);
  }
},{passive:true});

document.addEventListener("mousemove",e=>{
  moveStars(e.clientX,e.clientY);
});

function resetStars(){
  document
  .querySelectorAll(".star-wrap")
  .forEach(star=>{
    star.style.transform = "translate(0,0)";
  });
}

document.addEventListener("touchend",resetStars);
document.addEventListener("mouseleave",resetStars);

// 🎉 CONFETTI
function createConfetti(){

  const layer =
  document.getElementById("confettiLayer");

  if(!layer) return;

  layer.innerHTML = "";
  layer.style.opacity = "1";

  createConfettiBurst();

  setTimeout(()=>{

    for(let i=0;i<70;i++){

      let c =
      document.createElement("div");

      c.classList.add("confetti");

      const size =
      4 + Math.random()*7;

      c.style.width =
      size + "px";

      c.style.height =
      (size * (0.6 + Math.random())) + "px";

      c.style.left =
      Math.random()*100 + "vw";

      c.style.background =
      randomColor();

      c.style.animationDuration =
      (5 + Math.random()*5) + "s";

      c.style.animationDelay =
      Math.random()*2 + "s";

      c.style.setProperty(
        "--drift",
        (-60 + Math.random()*120) + "px"
      );

      c.style.borderRadius =
      Math.random() > 0.5 ? "50%" : "2px";

      layer.appendChild(c);
    }

  },250);
}

function createConfettiBurst(){

  const layer =
  document.getElementById("confettiLayer");

  if(!layer) return;

  for(let i=0;i<90;i++){

    const c =
    document.createElement("div");

    c.classList.add("confetti-burst");

    const size =
    4 + Math.random()*8;

    c.style.width =
    size + "px";

    c.style.height =
    (size * (0.6 + Math.random())) + "px";

    c.style.background =
    randomColor();

    const angle =
    Math.random() * Math.PI * 2;

    const distance =
    80 + Math.random()*220;

    const x =
    Math.cos(angle) * distance;

    const y =
    Math.sin(angle) * distance;

    c.style.setProperty("--x", x + "px");
    c.style.setProperty("--y", y + "px");

    c.style.borderRadius =
    Math.random() > 0.5 ? "50%" : "2px";

    layer.appendChild(c);

    setTimeout(()=>{
      c.remove();
    },3200);
  }
}

function fadeOutConfetti(callback){

  const layer =
  document.getElementById("confettiLayer");

  if(!layer){
    if(callback) callback();
    return;
  }

  layer.style.opacity = "0";

  setTimeout(()=>{

    layer.innerHTML = "";
    layer.style.opacity = "1";

    if(callback){
      callback();
    }

  },6000);
}

function randomColor(){

  const colors=[
    "#ff4d6d",
    "#ffd166",
    "#06d6a0",
    "#4cc9f0",
    "#f72585",
    "#ffffff",
    "#bde0fe"
  ];

  return colors[
    Math.floor(Math.random()*colors.length)
  ];
}

// 💌 MESSAGE
const message = `Asya...

Bazen bazı insanlar hayatımıza uzun süre kalmak için değil, çok kısa anlarda girip uzun izler bırakmak için gelir.

Sen de benim hayatımda tam olarak böyle bir yer bıraktın.

Gülüşünü hatırlamak, birlikte yaşanan küçük anları düşünmek bile insanın içindeki en ufak yeri değiştirebiliyor. Seninle geçen o kısa zaman, belki de uzun yıllara sığacak kadar değerliydi benim için.

Bugün doğum günün... ve ne olursa olsun bunu es geçmek istemedim.

Bir daha seni rahatsız etmeyeceğimi söylemiştim, biliyorum. Eğer bu mesajla sözümü bozup seni rahatsız ettiysem özür dilerim. Ama bugün senin için önemli bir gün ve içimden yazmak geldi.

Şunu bilmeni isterim; sana karşı hiçbir zaman kötü bir his taşımadım. Çünkü bazı şeyler bitse bile, insanda kalan güzel hisler kolay kolay bitmiyor.

Belki hayat bazen bizi farklı yerlere götürüyor. Belki bazı şeyler olması gerektiği gibi olmuyor. Ama bu yaşanan güzel şeylerin değerini azaltmıyor.

Sen benim hayatımda iz bırakan nadir insanlardan biri oldun.

Bu arada... "Ben daha çok seviyorum" oyununda sanırım ben kazandım 🙃

Yeni yaşının sana huzur, mutluluk, sağlık ve gerçekten hak ettiğin güzel şeyleri getirmesini diliyorum.

İçten içe hep gülümseyeceğin, kalbinin hafifleyeceği bir yaş olsun.
`;

let i = 0;

let textEl =
document.getElementById("text");

let typeTimer = null;

function resetTyping(){

  if(typeTimer){
    clearTimeout(typeTimer);
    typeTimer = null;
  }

  i = 0;
  textEl.innerHTML = "";
}

function type(){

  if(i < message.length){

    let char =
    message[i];

    if(char === "\n"){
      textEl.innerHTML += "<br>";
    }else{
      textEl.innerHTML += char;
    }

    i++;

textEl.scrollTop = textEl.scrollHeight;

typeTimer = setTimeout(type,75);
  }else{

    typeTimer = null;

    logAction("Mesaj Okundu / Daktilo Bitti");

    setTimeout(showEnding,2500);
  }
}

// 🎬 ENDING
function showEnding(){

  const end =
  document.getElementById("ending");

  const content =
  document.getElementById("content");

  const stars =
  document.getElementById("stars");

  content.classList.add("end-effect");

  setTimeout(()=>{

    end.classList.add("show");

  },2000);

  setTimeout(()=>{

    stars.style.opacity = "1";

    setTimeout(()=>{

      end.classList.remove("show");
      end.style.opacity = "0";

      fadeOutConfetti(()=>{

        content.style.display = "none";

        logAction("Yıldız Ekranı Açıldı");

        startStarCountdown();

      });

    },800);

  },11000);
}

// ⏳ YILDIZ SAYAÇ
let countdownInterval = null;

function formatTime(seconds){

  if(!isFinite(seconds) || seconds < 0){
    return "--:--";
  }

  const min =
  Math.floor(seconds / 60);

  const sec =
  Math.floor(seconds % 60);

  return String(min).padStart(2,"0") +
  ":" +
  String(sec).padStart(2,"0");
}

function startStarCountdown(){

  const countdown =
  document.getElementById("starCountdown");

  if(!countdown) return;

  countdown.style.opacity = "1";

  if(countdownInterval){
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(()=>{

    if(
      music &&
      isFinite(music.duration) &&
      music.duration > 0
    ){

      const remaining =
      music.duration - music.currentTime;

      countdown.innerText =
      "Kapanışa kalan süre: " +
      formatTime(remaining);

      if(remaining <= 1){

        clearInterval(countdownInterval);
        countdownInterval = null;

        closeSiteCinematic();
      }

    }else{

      countdown.innerText =
      "Kapanışa kalan süre: --:--";
    }

  },500);
}

// 🖥️ FULLSCREEN
function openFullscreen(){

  const isAndroid =
  /Android/i.test(navigator.userAgent);

  if(isAndroid){
    logAction("Android Fullscreen Atlandı");
    return;
  }

  let elem =
  document.documentElement;

  const request =
  elem.requestFullscreen ||
  elem.webkitRequestFullscreen ||
  elem.msRequestFullscreen;

  if(request){
    request.call(elem).catch(()=>{});
  }
}

// 🎧 MUSIC
let music =
document.getElementById("bgMusic");

let musicStarted = false;

function toggleMusic(){

  if(!musicStarted){

    music.volume = 0.4;

    music.play().catch(()=>{});

    musicStarted = true;

    document.getElementById("musicBtn")
    .innerText = "⏸ Müziği Durdur";

    logAction("Müzik Etkileşimi",{
      durum:"Başlatıldı"
    });

  }else{

    music.pause();

    musicStarted = false;

    document.getElementById("musicBtn")
    .innerText = "🎧 Müziği Başlat";

    logAction("Müzik Etkileşimi",{
      durum:"Durduruldu"
    });
  }
}

// 🎵 GÜVENLİ SİNEMATİK KAPANIŞ
let siteClosing = false;

function closeSiteCinematic(){

  if(siteClosing) return;

  siteClosing = true;

  const fade =
  document.getElementById("fadeBlack");

  fade.style.opacity = "1";

  document.getElementById("stars")
  .style.opacity = "0";

  document.getElementById("musicBtn")
  .style.opacity = "0";

  const countdown =
  document.getElementById("starCountdown");

  if(countdown){
    countdown.style.opacity = "0";
  }

  if(countdownInterval){
    clearInterval(countdownInterval);
    countdownInterval = null;
  }

  logAction("Müzik Bitti / Site Kapanıyor");

  setTimeout(()=>{

    if(document.fullscreenElement){

      document.exitFullscreen()
      .catch(()=>{});

    }else if(document.webkitFullscreenElement){

      document.webkitExitFullscreen();
    }

    window.close();

    setTimeout(()=>{

      window.location.href =
      "about:blank";

    },1000);

  },5000);
}

music.addEventListener("ended",()=>{

  closeSiteCinematic();

});

// 🚀 INTRO
window.onload = ()=>{

  logVisitWithLocation();

  setTimeout(()=>{

    document.getElementById("intro")
    .style.display = "none";

    document.getElementById("lock")
    .style.display = "flex";

  },5000);
};

// 🔐 LOGIN
function check(){

  let passValue =
  document.getElementById("pass").value;

  if(passValue === "3007"){

    logAction("Şifre Doğru / İçeri Girdi");

    openFullscreen();

    document.getElementById("lock")
    .style.display = "none";

    document.getElementById("content")
    .style.display = "flex";

    createConfetti();

    resetTyping();

    setTimeout(()=>{

      type();

    },3000);

  }else{

    logAction("Yanlış Şifre Denendi",{
      denenenSifre:passValue
    });

    alert("Yanlış şifre ❌");
  }
}
