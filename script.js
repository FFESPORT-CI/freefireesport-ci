import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabase = createClient("https://hxdpeqfcefhrfonegtok.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZHBlcWZjZWZocmZvbmVndG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDc4OTMsImV4cCI6MjA4OTU4Mzg5M30.i_c9zU6sABenDuHZtwK4ZQ9KWDOJh7QB07GezDIkWqM");

// --- NAVIGATION ---
window.showPage = (id) => {

    const loader = document.getElementById("loadingScreen");

    // afficher loading
    loader.classList.add("show");

    setTimeout(() => {

        // cacher toutes les pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // afficher page cible
        const target = document.getElementById(id);
        if (target) target.classList.add('active');

        window.scrollTo({ top: 0, behavior: "smooth" });

        // cacher loader
        loader.classList.remove("show");

    }, 700); // durée du loading (0.7s)
};

// --- ACTUALITÉS ---
const mesActualites = [
    {
        titre: "ÉLITE CUP S1 : PRÊT POUR LE COMBAT ?",
        categorie: "TOURNOI SOLO",
        date: "15 Mai - 14h00 GMT",
        resume: "Le plus gros tournoi solo du mois arrive ! Ticket : 1000F. 48 soldats sur la ligne de départ.",
        details: "💰 Cashprize : 39.500F | 📍 48 Places | 🏆 Finale en direct.",
        image: "elitecup.png",
        lien: "https://wa.me/2250173661277"
    },
    {
        titre: "COG : LE CHOC DES CLANS IVOIRIENS",
        categorie: "COMMUNAUTÉ",
        date: "Bientôt (Vacances)",
        resume: "Le Clash of Guilds revient. Qui sera la meilleure guilde de Côte d'Ivoire ?",
        details: "🔥 Inscriptions prochainement | 🛡️ Format 4vs4 Classique.",
        image: "cog.png",
        lien: "https://chat.whatsapp.com/KUm4uoqUBgD78Bh3onKOCi"
    }
];

function chargerActus() {
    const container = document.getElementById('news-container');
    if(!container) return;
    container.innerHTML = mesActualites.map(actu => `
        <article class="news-card">
            <div class="news-thumb"><img src="${actu.image}" alt="${actu.titre}"></div>
            <div class="news-body">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span class="news-category">${actu.categorie}</span>
                    <span class="news-date-small">${actu.date}</span>
                </div>
                <h4 class="font-orbitron" style="margin: 15px 0;">${actu.titre}</h4>
                <p style="color: #ccc; font-size: 0.9rem;">${actu.resume}</p>
                <div class="news-extra" style="background: rgba(255,102,0,0.1); padding: 10px; border-radius: 5px; margin: 15px 0; border: 1px solid rgba(255,102,0,0.2);">
                    <p style="font-size: 0.8rem; color: var(--primary); margin: 0;"><strong>${actu.details}</strong></p>
                </div>
                <button onclick="window.open('${actu.lien}')" class="btn-read-mini">LIRE LA SUITE</button>
            </div>
        </article>
    `).join('');
}

// --- GUILDES ---


async function chargerGuildes() {
    const div = document.getElementById('listeGuildes');
    if (!div) return;

    const { data, error } = await supabase
        .from('guildes')
        .select('nom, chef, whatsapp');

    if (error) {
        div.innerHTML = `<p style="color:red;">Erreur : ${error.message}</p>`;
        return;
    }

    if (!data || data.length === 0) {
        div.innerHTML = `<p style="text-align:center;">Aucune guilde enregistrée</p>`;
        return;
    }

    div.innerHTML = data.map(g => {

    const msgRejoindre = encodeURIComponent(
`Bonjour Leader ${g.chef} 👋

Je viens depuis FF ESPORT-CI 🇨🇮
Je souhaite rejoindre ta guilde *${g.nom}*.
Est-ce qu’il reste une place ? 🔥`
    );

    return `
    <div class="guilde-card">
        <div class="guilde-content">

            <div class="guilde-badge">GUILDE CERTIFIÉE</div>

            <div class="guilde-name">${g.nom}</div>

            <div class="guilde-chef">
                👑 Leader : <strong>${g.chef}</strong>
            </div>

            <div class="guilde-actions">
                <a class="btn-wa"
                   href="https://wa.me/${g.whatsapp}?text=${msgRejoindre}"
                   target="_blank">
                   REJOINDRE
                </a>

                <button class="btn-defi"
                    onclick="window.ouvrirDefi('${g.nom.replace(/'/g,"\\'")}', '${g.whatsapp}')">
                    DÉFIER
                </button>
            </div>

        </div>
    </div>
    `;
}).join('');
}

// --- SYSTÈME DE DÉFI (MODAL) ---
window.ouvrirDefi = async (nom, wa) => {
    // On enregistre les infos de la cible
    window.cibleNom = nom;
    window.cibleWA = wa;
    
    const modal = document.getElementById('modalDefi');
    const targetDisplay = document.getElementById('target_guilde_display');

    if (targetDisplay) {
        targetDisplay.innerText = nom;
    }

    if (modal) {
        // Cette ligne force l'affichage même si le CSS dit le contraire
        modal.style.setProperty('display', 'flex', 'important');
    }

    // Charger tes guildes dans le menu déroulant
    const select = document.getElementById('ma_guilde_select');
    if (select) {
        const { data } = await supabase.from('guildes').select('nom');
        if (data) {
            select.innerHTML = data.map(g => `<option value="${g.nom}">${g.nom}</option>`).join('');
        }
    }
};

window.envoyerDefi = () => {
    const maGuilde = document.getElementById('ma_guilde_select').value;
    const mode = document.getElementById('mode_match').value;
    const date = document.getElementById('date_match').value;
    const heure = document.getElementById('heure_match').value;

    if(!date || !heure) return alert("Veuillez préciser la date et l'heure !");

    const texte = `⚔️ *NOUVEAU DÉFI REÇU !* ⚔️\n\n` +
                  `Salut Leader de *${window.cibleNom}*,\n\n` +
                  `Votre guilde a été défiée par la guilde *${maGuilde}* via le site officiel *FF ESPORT-CI* 🇨🇮.\n\n` +
                  `━━━━━━━━━━━━━━━\n` +
                  `🕹️ *MODE :* ${mode}\n` +
                  `📅 *DATE :* ${date}\n` +
                  `⏰ *HEURE :* ${heure}\n` +
                  `━━━━━━━━━━━━━━━\n\n` +
                  `Êtes-vous prêts à relever le défi ? Répondez à ce message pour confirmer le match ! 🔥`;

    window.open(`https://wa.me/${window.cibleWA}?text=${encodeURIComponent(texte)}`, '_blank');
    document.getElementById('modalDefi').style.display = 'none';
};

// --- INSCRIPTION ---
// --- ENREGISTREMENT GUILDE ---
window.validerGuilde = async () => {
    const n = document.getElementById('g_nom').value;
    const c = document.getElementById('g_chef').value;
    const p = document.getElementById('g_pays').value;
    const wa = document.getElementById('g_wa').value.replace(/\s/g, '');

    if(!n || !c || !wa) {
        afficherNotif("⚠️ Remplis tous les champs, Soldat !");
        return;
    }

    const { error } = await supabase.from('guildes').insert([
        { nom: n, chef: c, whatsapp: p + wa }
    ]);
    
    if(!error) {
        // Notification en bas à droite
        afficherNotif("🛡️ Ta guilde a été certifiée !");

        // Message de succès directement sur la page (on remplace le formulaire)
        const formContainer = document.querySelector('#page-guildes .container');
        if (formContainer) {
            // On cherche le bloc du formulaire pour le remplacer temporairement
            const formBox = document.querySelector('.auth-cyber-card') || document.querySelector('.box');
            formBox.innerHTML = `
                <div style="text-align:center; padding:30px; border:1px solid var(--primary); background:rgba(0,0,0,0.8);">
                    <h2 class="font-orbitron" style="color:var(--primary);">GUILDE ENREGISTRÉE !</h2>
                    <p>Félicitations Leader 👑 <strong>${c}</strong>,</p>
                    <p>La guilde <strong>${n}</strong> est désormais déployée dans l'annuaire.</p>
                    <button onclick="location.reload()" class="btn-read-mini" style="margin-top:20px;">VOIR L'ANNUAIRE</button>
                </div>
            `;
        }
    } else {
        afficherNotif("⚠️ Erreur : " + error.message);
    }
};

// --- INITIALISATION AU DÉMARRAGE ---
// Correction de l'initialisation
document.addEventListener('DOMContentLoaded', () => {
    chargerActus();
    chargerGuildes();
    if (window.chargerjoueurs) window.chargerjoueurs(); // Respecte le nom exact de ta fonction
});

window.chargerjoueurs = async () => {

    const role = document.getElementById('filter-role')?.value || "Tous";
    const niveauMin = document.getElementById('filter-level')?.value || 0;

    const div = document.getElementById('listeJoueursPublique');
    if (!div) return;

    const { data, error } = await supabase.from('joueurs').select('*');

    if (error) return console.error(error.message);

    let filtered = data || [];

    // FILTRE ROLE
    if (role !== "Tous") {
        filtered = filtered.filter(j => j.role === role);
    }

    // FILTRE NIVEAU
    if (niveauMin) {
        filtered = filtered.filter(j => {
            const lvl = parseInt(j.niveau) || 0;
            return lvl >= parseInt(niveauMin);
        });
    }

    // AFFICHAGE
    div.innerHTML = filtered.map(j => `
        <div class="box">
            <b>${j.pseudo || "Joueur"}</b><br>
            🎮 ${j.role || "N/A"}<br>
            ⭐ Niveau: ${j.niveau || "?"}
        </div>
    `).join('');

    document.getElementById('compteur-joueurs').innerText = filtered.length;
};

let wizard = {
    step: 1,
    data: {
        pseudo: "",
        uid: "",
        niveau: "",
        guilde: "",
        role: "",
        phone: ""
    }
};

window.nextStep = () => {

    if (wizard.step === 1) {
        const pseudo = document.getElementById('p-pseudo').value.trim();
        const uid = document.getElementById('p-uid').value.trim();
        const niveau = document.getElementById('p-niveau').value;

        if (!pseudo || !uid || !niveau) {
            return afficherNotif("⚠️ Complète ton identité !");
        }

        wizard.data.pseudo = pseudo;
        wizard.data.uid = uid;
        wizard.data.niveau = niveau;
    }

    if (wizard.step === 2) {
        wizard.data.guilde = document.getElementById('p-guilde-select').value;
        wizard.data.role = document.getElementById('p-role').value;
    }

    if (wizard.step === 3) {
        const phone = document.getElementById('p-phone').value.trim();
        if (!phone) return afficherNotif("⚠️ Ajoute ton WhatsApp !");
        wizard.data.phone = phone;
    }

    if (wizard.step < 3) {
        wizard.step++;
        updateWizard();
    }
};

window.prevStep = () => {
    if (wizard.step > 1) {
        wizard.step--;
        updateWizard();
    }
};


window.createProfile = async () => {

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return afficherNotif("⚠️ Connecte-toi d'abord !");
    }

    const profile = {
        id_user: user.id,
        pseudo: wizard.data.pseudo,
        id_game: wizard.data.uid,
        niveau: wizard.data.niveau,
        guilde: wizard.data.guilde,
        role: wizard.data.role,
        telephone: wizard.data.phone,
        photo: user.user_metadata?.avatar_url,
        updated_at: new Date()
    };

   const { error } = await supabase
  .from('joueurs')
  .upsert(profile, { onConflict: 'id_user' });

    if (error) {
        return afficherNotif("❌ Erreur création profil");
    }

    afficherNotif("🔥 PROFIL CRÉÉ !");

    showPage('page-profil');
    location.reload();
};



function updateWizard() {

    document.getElementById('wiz-step').innerText = wizard.step;

    const bar = document.getElementById('wiz-bar');

    bar.style.width =
        wizard.step === 1 ? "25%" :
        wizard.step === 2 ? "50%" :
        wizard.step === 3 ? "75%" :
        "100%";

    document.getElementById('step1').style.display = wizard.step === 1 ? "block" : "none";
    document.getElementById('step2').style.display = wizard.step === 2 ? "block" : "none";
    document.getElementById('step3').style.display = wizard.step === 3 ? "block" : "none";
}



window.prevStep = () => {
    if (wizard.step > 1) {
        wizard.step--;
        updateWizard();
    }
};

function peutSinscrire() {
    return localStorage.getItem("profil") !== null;
}
window.inscriptionWhatsApp = () => {

    const pseudo = document.getElementById("tournoi_pseudo").value.trim();
    const uid = document.getElementById("tournoi_uid").value.trim();

    if (!pseudo || !uid) {
        alert("⚠️ Remplis ton pseudo et ton UID !");
        return;
    }

    const numeroAdmin = "2250173661277";

    const message = `🔥 INSCRIPTION TOURNOI FF ESPORT-CI 🔥

👤 Pseudo : ${pseudo}
🆔 UID : ${uid}

💰 J’accepte les frais de participation (1000 FCFA)
📌 Je souhaite participer au tournoi

Merci de me valider 🙏`;

    const url = `https://wa.me/${numeroAdmin}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
};

window.addEventListener("load", () => {
    setTimeout(() => {
        const intro = document.getElementById("intro-screen");
        if (intro) {
            intro.remove();
        }
    }, 4500); // durée intro
});

setTimeout(() => {
    const intro = document.getElementById("introScreen");
    if (intro) intro.remove();
}, 3500);

window.toggleMenu = () => {
    document.getElementById("mobileMenu").classList.toggle("active");
};
function toggleMenu(){
    document.getElementById("mobileMenu").classList.toggle("active");
}

// ouvrir/fermer sous menu
function toggleSubMenu(el){
    let section = el.parentElement;
    section.classList.toggle("active");
}

// navigation propre
function go(page){
    showPage(page);
    toggleMenu();
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
    .then(() => console.log("PWA activée"))
    .catch(err => console.log(err));
}