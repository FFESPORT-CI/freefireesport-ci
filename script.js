import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ===== SUPABASE =====
const supabase = createClient(
    "https://hxdpeqfcefhrfonegtok.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4ZHBlcWZjZWZocmZvbmVndG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDc4OTMsImV4cCI6MjA4OTU4Mzg5M30.i_c9zU6sABenDuHZtwK4ZQ9KWDOJh7QB07GezDIkWqM"
);

// ===== TOAST (remplace afficherNotif) =====
function afficherNotif(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3600);
}

// ===== NAVIGATION =====
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
    }

    // Scroll vers le haut immédiatement
    document.getElementById('mainContent')?.scrollTo(0, 0);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    sessionStorage.setItem('currentPage', pageId);

    // Ne PAS modifier window.location.hash ici

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-link');
        if (link.dataset.page === pageId) link.classList.add('active-link');
    });

    if (pageId === 'page-profil') verifierSession();
    if (pageId === 'page-guildes') chargerGuildes();
    if (pageId === 'page-joueurs') chargerJoueurs();
    if (pageId === 'page-calendrier') renderCalendrier();
    if (pageId === 'page-admin') checkAdminSession();
    if (pageId === 'page-create-profil') {
        wizard.step = 1;
        updateWizard();
        if (window._profilActuel) preRemplirWizard(window._profilActuel);
    }
}

// Navigation depuis le menu mobile (ferme le menu après)
function go(pageId) {
    showPage(pageId);
    closeMobileMenu();
}

// Expose globalement
window.showPage = showPage;
window.go = go;

// ===== MENU MOBILE =====
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('menuOverlay');
    const burger = document.getElementById('burgerBtn');

    if (!menu) return;

    const isOpen = menu.classList.contains('open');

    if (isOpen) {
        closeMobileMenu();
    } else {
        menu.classList.add('open');
        overlay.classList.add('open');
        burger.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}

function closeMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('menuOverlay');
    const burger = document.getElementById('burgerBtn');

    if (menu) menu.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    if (burger) burger.classList.remove('open');
    document.body.style.overflow = '';
}

window.toggleMenu = toggleMenu;

// ===== ACCORDION MOBILE =====
function toggleAcc(titleEl) {
    const accordion = titleEl.parentElement;
    accordion.classList.toggle('open');
}

window.toggleAcc = toggleAcc;

// ===== HEADER SCROLL =====
window.addEventListener('scroll', () => {
    const header = document.getElementById('siteHeader');
    if (!header) return;
    if (window.scrollY > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ===== INTRO SCREEN =====
function lancerIntro() {
    const intro = document.getElementById('introScreen');
    const progress = document.querySelector('.intro-progress');
    const status = document.getElementById('introStatus');

    if (!intro) return;

    const etapes = [
        { pct: 20, txt: "CHARGEMENT DES DONNÉES..." },
        { pct: 45, txt: "CONNEXION AU SERVEUR..." },
        { pct: 70, txt: "SYNCHRONISATION GUILDES..." },
        { pct: 90, txt: "DÉPLOIEMENT EN COURS..." },
        { pct: 100, txt: "OPÉRATION LANCÉE ✔" }
    ];

    let i = 0;
    const interval = setInterval(() => {
        if (i >= etapes.length) {
            clearInterval(interval);
            setTimeout(() => {
                intro.classList.add('hidden');
                setTimeout(() => intro.remove(), 700);
            }, 400);
            return;
        }
        if (progress) progress.style.width = etapes[i].pct + '%';
        if (status) status.textContent = etapes[i].txt;
        i++;
    }, 600);
}

// ===== ACTUALITÉS =====
const mesActualites = [
    {
        titre: "ÉLITE CUP S1 : PRÊT POUR LE COMBAT ?",
        categorie: "TOURNOI SOLO",
        date: "15 Mai — 14h00 GMT",
        resume: "Le plus gros tournoi solo du mois ! Ticket : 1000F. 48 soldats sur la ligne de départ.",
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
    if (!container) return;

    container.innerHTML = mesActualites.map(actu => `
        <article class="news-card">
            <div class="news-thumb">
                <img src="${actu.image}" alt="${actu.titre}"
                    onerror="this.parentElement.innerHTML='<div class=\\'news-thumb-placeholder\\'><i class=\\'fas fa-trophy\\'></i></div>'">
            </div>
            <div class="news-body">
                <div class="news-meta">
                    <span class="news-category">${actu.categorie}</span>
                    <span class="news-date">${actu.date}</span>
                </div>
                <h4 class="news-title">${actu.titre}</h4>
                <p class="news-resume">${actu.resume}</p>
                <div class="news-extra">${actu.details}</div>
                <button onclick="window.open('${actu.lien}')" class="btn-news">
                    <i class="fas fa-external-link-alt"></i> LIRE LA SUITE
                </button>
            </div>
        </article>
    `).join('');
}

// ===== GUILDES =====
async function chargerGuildes() {
    const div = document.getElementById('listeGuildes');
    const countEl = document.getElementById('guildes-count');
    if (!div) return;

    const { data, error } = await supabase
        .from('guildes')
        .select('nom, chef, whatsapp');

    if (error) {
        div.innerHTML = `<p style="color:var(--danger); font-family:var(--font-mono); font-size:13px; grid-column:1/-1;">
            ⚠ Erreur de chargement : ${error.message}
        </p>`;
        return;
    }

    if (!data || data.length === 0) {
        div.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:60px; color:var(--text-muted); font-family:var(--font-mono); font-size:13px;">
                <i class="fas fa-shield-alt" style="font-size:40px; color:var(--border-strong); display:block; margin-bottom:16px;"></i>
                AUCUNE GUILDE ENREGISTRÉE
            </div>`;
        return;
    }

    if (countEl) countEl.textContent = data.length;

    div.innerHTML = data.map(g => {
        const msgRejoindre = encodeURIComponent(
            `Bonjour Leader ${g.chef} 👋\n\nJe viens depuis FF ESPORT-CI 🇨🇮\nJe souhaite rejoindre ta guilde *${g.nom}*.\nEst-ce qu'il reste une place ? 🔥`
        );

        return `
        <div class="guilde-card">
            <div class="guilde-badge">✦ GUILDE CERTIFIÉE</div>
            <div class="guilde-name">${g.nom}</div>
            <div class="guilde-chef">👑 Leader : <strong>${g.chef}</strong></div>
            <div class="guilde-actions">
                <a class="btn-wa"
                   href="https://wa.me/${g.whatsapp}?text=${msgRejoindre}"
                   target="_blank">
                   REJOINDRE
                </a>
                <button class="btn-defi"
                    onclick="ouvrirDefi('${g.nom.replace(/'/g, "\\'")}', '${g.whatsapp}')">
                    ⚔ DÉFIER
                </button>
            </div>
        </div>`;
    }).join('');
}

// ===== STATS ACCUEIL =====
async function chargerStats() {
    const statGuildes = document.getElementById('statGuildes');
    const statJoueurs = document.getElementById('statJoueurs');

    if (statGuildes) {
        const { count } = await supabase
            .from('guildes')
            .select('*', { count: 'exact', head: true });
        statGuildes.textContent = count ?? '--';
    }

    if (statJoueurs) {
        const { count } = await supabase
            .from('joueurs')
            .select('*', { count: 'exact', head: true });
        statJoueurs.textContent = count ?? '--';
    }
}

// ===== ENREGISTREMENT GUILDE =====
window.validerGuilde = async () => {
    const nom = document.getElementById('g_nom')?.value.trim();
    const chef = document.getElementById('g_chef')?.value.trim();
    const pays = document.getElementById('g_pays')?.value;
    const wa = document.getElementById('g_wa')?.value.replace(/\s/g, '');

    if (!nom || !chef || !wa) {
        afficherNotif("⚠ Remplis tous les champs !");
        return;
    }

    const { error } = await supabase.from('guildes').insert([
        { nom, chef, whatsapp: pays + wa }
    ]);

    if (error) {
        afficherNotif("❌ Erreur : " + error.message);
        return;
    }

    afficherNotif("🛡️ Guilde certifiée avec succès !");
    showPage('page-guildes');
    chargerGuildes();
};

// ===== MODAL DÉFI =====
window.ouvrirDefi = async (nom, wa) => {
    window._cibleNom = nom;
    window._cibleWA = wa;

    const modal = document.getElementById('modalDefi');
    const targetDisplay = document.getElementById('target_guilde_display');
    const select = document.getElementById('ma_guilde_select');

    if (targetDisplay) targetDisplay.innerText = nom;
    if (modal) modal.style.display = 'flex';

    // Charge les guildes dans le select
    if (select) {
        const { data } = await supabase.from('guildes').select('nom');
        if (data) {
            select.innerHTML = data.map(g =>
                `<option value="${g.nom}">${g.nom}</option>`
            ).join('');
        }
    }
};

window.fermerDefi = () => {
    const modal = document.getElementById('modalDefi');
    if (modal) modal.style.display = 'none';
};

// Ferme le modal si on clique sur l'overlay
document.addEventListener('click', (e) => {
    const modal = document.getElementById('modalDefi');
    if (modal && e.target === modal) {
        fermerDefi();
    }
});

window.envoyerDefi = () => {
    const maGuilde = document.getElementById('ma_guilde_select')?.value;
    const mode = document.getElementById('mode_match')?.value;
    const date = document.getElementById('date_match')?.value;
    const heure = document.getElementById('heure_match')?.value;

    if (!date || !heure) {
        afficherNotif("⚠ Précise la date et l'heure !");
        return;
    }

    const texte =
        `⚔️ *NOUVEAU DÉFI REÇU !* ⚔️\n\n` +
        `Salut Leader de *${window._cibleNom}*,\n\n` +
        `Votre guilde a été défiée par *${maGuilde}* via *FF ESPORT-CI* 🇨🇮.\n\n` +
        `━━━━━━━━━━━━━━━\n` +
        `🕹️ *MODE :* ${mode}\n` +
        `📅 *DATE :* ${date}\n` +
        `⏰ *HEURE :* ${heure}\n` +
        `━━━━━━━━━━━━━━━\n\n` +
        `Êtes-vous prêts à relever le défi ? Répondez pour confirmer ! 🔥`;

    window.open(`https://wa.me/${window._cibleWA}?text=${encodeURIComponent(texte)}`, '_blank');
    fermerDefi();
    afficherNotif("⚔️ Défi envoyé !");
};

// ===== INSCRIPTION TOURNOI =====
window.inscriptionTournoi = () => {
    const pseudo = document.getElementById("tournoi_pseudo")?.value.trim();
    const uid = document.getElementById("tournoi_uid")?.value.trim();

    if (!pseudo || !uid) {
        afficherNotif("⚠ Remplis ton pseudo et ton UID !");
        return;
    }

    const message =
        `🔥 INSCRIPTION TOURNOI FF ESPORT-CI 🔥\n\n` +
        `👤 Pseudo : ${pseudo}\n` +
        `🆔 UID : ${uid}\n\n` +
        `💰 J'accepte les frais de participation (1000 FCFA)\n` +
        `📌 Je souhaite participer au tournoi\n\n` +
        `Merci de me valider 🙏`;

    window.open(`https://wa.me/2250173661277?text=${encodeURIComponent(message)}`, '_blank');
};

// ===== CONNEXION GOOGLE =====
window.connexionGoogle = async () => {
    afficherNotif("⏳ Redirection vers Google...");

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.href.split('#')[0], // URL propre sans hash
            queryParams: {
                prompt: 'select_account' // Force la sélection du compte Google
            }
        }
    });

    if (error) {
        console.error("Erreur OAuth:", error);
        afficherNotif("❌ Erreur : " + error.message);
    }
};

window.deconnexion = async () => {
    await supabase.auth.signOut();
    afficherNotif("👋 Déconnecté !");
    showPage('page-accueil');
    verifierSession();
};

// ===== VÉRIFIER SESSION & AFFICHER PROFIL =====
async function verifierSession() {
    const nonConnecte = document.getElementById('profil-non-connecte');
    const creer = document.getElementById('profil-creer');
    const affiche = document.getElementById('profil-affiche');

    if (!nonConnecte) return;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Non connecté
        nonConnecte.style.display = 'block';
        creer.style.display = 'none';
        affiche.style.display = 'none';
        return;
    }

    // Connecté — cherche le profil
    const { data: profil } = await supabase
        .from('joueurs')
        .select('*')
        .eq('id_user', user.id)
        .single();

    if (!profil) {
        // Connecté mais pas de profil
        nonConnecte.style.display = 'none';
        creer.style.display = 'block';
        affiche.style.display = 'none';
        return;
    }

    // Profil existant — affiche les données
    nonConnecte.style.display = 'none';
    creer.style.display = 'none';
    affiche.style.display = 'block';

    const photo = profil.photo || user.user_metadata?.avatar_url || '';
    document.getElementById('profil-photo').src = photo ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(profil.pseudo || 'FF')}&background=00d4ff&color=050810&size=128`;
    document.getElementById('profil-pseudo').textContent = profil.pseudo || '—';
    document.getElementById('profil-uid').textContent = profil.id_game || '—';
    document.getElementById('profil-niveau').textContent = profil.niveau ? 'Niv. ' + profil.niveau : '—';
    document.getElementById('profil-guilde').textContent = profil.guilde || 'Aucune';
    document.getElementById('profil-role').textContent = profil.role || '—';
    document.getElementById('profil-role-badge').textContent = profil.role || 'SOLDAT';

    // Bio
    const bioEl = document.getElementById('profil-bio');
    const bioSection = document.getElementById('profil-bio-section');
    if (bioEl) {
        if (profil.bio) {
            bioEl.textContent = profil.bio;
            if (bioSection) bioSection.style.display = 'block';
        } else {
            bioEl.textContent = 'Aucune bio renseignée.';
        }
    }

    const wa = profil.telephone;
    if (wa) {
        document.getElementById('profil-wa-btn').href = `https://wa.me/${wa}`;
    }

    // Pré-remplit le wizard pour modification
    window._profilActuel = profil;
}

// ===== WIZARD PROFIL =====
let wizard = { step: 1, data: {} };

window.nextStep = async () => {
    if (wizard.step === 1) {
        const pseudo = document.getElementById('p-pseudo')?.value.trim();
        const uid = document.getElementById('p-uid')?.value.trim();
        const niveau = document.getElementById('p-niveau')?.value;
        if (!pseudo || !uid || !niveau) {
            afficherNotif("⚠ Complète ton identité !");
            return;
        }
        wizard.data.pseudo = pseudo;
        wizard.data.uid = uid;
        wizard.data.niveau = niveau;
    }

    if (wizard.step === 2) {
        wizard.data.guilde = document.getElementById('p-guilde-select')?.value || '';
        wizard.data.role = document.getElementById('p-role')?.value || '';
        if (!wizard.data.role) {
            afficherNotif("⚠ Choisis ton rôle !");
            return;
        }
    }

    if (wizard.step < 3) {
        wizard.step++;
        updateWizard();
        if (wizard.step === 2) await chargerGuildesSelect();
    }
};

window.prevStep = () => {
    if (wizard.step > 1) {
        wizard.step--;
        updateWizard();
    }
};

async function chargerGuildesSelect() {
    const select = document.getElementById('p-guilde-select');
    if (!select) return;
    const { data } = await supabase.from('guildes').select('nom');
    if (data) {
        select.innerHTML = `<option value="">— Sans guilde —</option>` +
            data.map(g => `<option value="${g.nom}">${g.nom}</option>`).join('');
    }
    if (window._profilActuel?.guilde) {
        select.value = window._profilActuel.guilde;
    }
}

// Préremplir le wizard avec les données existantes
function preRemplirWizard(profil) {
    if (!profil) return;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('p-pseudo', profil.pseudo);
    set('p-uid', profil.id_game);
    set('p-niveau', profil.niveau);
    set('p-role', profil.role);
    set('p-bio', profil.bio);

    // Highlight rôle sélectionné
    document.querySelectorAll('.role-option').forEach(r => {
        r.classList.toggle('selected', r.dataset.role === profil.role);
    });

    // Téléphone : séparer indicatif et numéro
    if (profil.telephone) {
        const tel = profil.telephone.toString();
        const indicatifs = ['225','221','223','226','228','229'];
        const found = indicatifs.find(i => tel.startsWith(i));
        if (found) {
            set('p-pays', found);
            set('p-phone', tel.slice(found.length));
        } else {
            set('p-phone', tel);
        }
    }
}

function updateWizard() {
    // Steps body
    document.getElementById('step1').style.display = wizard.step === 1 ? 'block' : 'none';
    document.getElementById('step2').style.display = wizard.step === 2 ? 'block' : 'none';
    document.getElementById('step3').style.display = wizard.step === 3 ? 'block' : 'none';

    // Progress bar
    const pcts = { 1: '25%', 2: '60%', 3: '90%' };
    const bar = document.getElementById('wiz-bar');
    if (bar) bar.style.width = pcts[wizard.step] || '25%';

    // Steps indicateurs
    [1, 2, 3].forEach(n => {
        const el = document.getElementById('wiz-s' + n);
        if (!el) return;
        el.classList.remove('active', 'done');
        if (n === wizard.step) el.classList.add('active');
        if (n < wizard.step) el.classList.add('done');
    });
}

window.selectRole = (el) => {
    document.querySelectorAll('.role-option').forEach(r => r.classList.remove('selected'));
    el.classList.add('selected');
    const roleInput = document.getElementById('p-role');
    if (roleInput) roleInput.value = el.dataset.role;
};

window.createProfile = async () => {
    const phone = document.getElementById('p-phone')?.value.trim();
    const pays = document.getElementById('p-pays')?.value || '225';
    const bio = document.getElementById('p-bio')?.value.trim().slice(0, 200) || '';

    if (!phone) {
        afficherNotif("⚠ Ajoute ton WhatsApp !");
        return;
    }
    wizard.data.phone = pays + phone.replace(/\s/g, '');
    wizard.data.bio = bio;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        afficherNotif("⚠ Connecte-toi d'abord !");
        return;
    }

    const profile = {
        id_user: user.id,
        pseudo: wizard.data.pseudo,
        id_game: wizard.data.uid,
        niveau: parseInt(wizard.data.niveau) || 0,
        guilde: wizard.data.guilde || null,
        role: wizard.data.role || null,
        telephone: wizard.data.phone,
        bio: wizard.data.bio || null,
        photo: user.user_metadata?.avatar_url || null,
        updated_at: new Date().toISOString()
    };

    const { error } = await supabase
        .from('joueurs')
        .upsert(profile, { onConflict: 'id_user' });

    if (error) {
        afficherNotif("❌ Erreur : " + error.message);
        return;
    }

    afficherNotif("🔥 Profil enregistré !");
    wizard = { step: 1, data: {} };
    updateWizard();
    showPage('page-profil');
    verifierSession();
    chargerJoueurs();
    chargerStats();
};

// ===== LISTE JOUEURS =====
let viewMode = 'grid';

window.setView = (mode) => {
    viewMode = mode;
    const grid = document.getElementById('listeJoueursPublique');
    const btnGrid = document.getElementById('btn-grid');
    const btnList = document.getElementById('btn-list');
    if (!grid) return;
    if (mode === 'list') {
        grid.classList.add('list-view');
        btnList?.classList.add('active');
        btnGrid?.classList.remove('active');
    } else {
        grid.classList.remove('list-view');
        btnGrid?.classList.add('active');
        btnList?.classList.remove('active');
    }
};

window.chargerJoueurs = async () => {
    const role = document.getElementById('filter-role')?.value || 'Tous';
    const niveauMin = parseInt(document.getElementById('filter-level')?.value) || 0;
    const div = document.getElementById('listeJoueursPublique');
    const compteur = document.getElementById('compteur-joueurs');
    if (!div) return;

    div.innerHTML = `<div class="loading-state"><div class="loading-spinner"></div><p>CHARGEMENT...</p></div>`;

    const { data, error } = await supabase.from('joueurs').select('*');

    if (error) {
        div.innerHTML = `<p style="color:var(--danger);font-family:var(--font-mono);font-size:13px;grid-column:1/-1;">⚠ Erreur : ${error.message}</p>`;
        return;
    }

    let filtered = data || [];
    if (role !== 'Tous') filtered = filtered.filter(j => j.role === role);
    if (niveauMin > 0) filtered = filtered.filter(j => parseInt(j.niveau) >= niveauMin);

    if (compteur) compteur.textContent = filtered.length;

    if (filtered.length === 0) {
        div.innerHTML = `
            <div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-muted);font-family:var(--font-mono);font-size:13px;">
                <i class="fas fa-user-slash" style="font-size:40px;color:var(--border-strong);display:block;margin-bottom:16px;"></i>
                AUCUN JOUEUR TROUVÉ
            </div>`;
        return;
    }

    const roleIcons = {
        'Sniper': '🎯', 'Rusher': '⚡', 'Support': '🛡️',
        'Flex': '🔄', 'Bombardier': '💣', 'Fusilier': '🔫'
    };

    div.innerHTML = filtered.map(j => {
        const photo = j.photo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(j.pseudo || 'FF')}&background=00d4ff&color=050810&size=128`;
        const roleIcon = roleIcons[j.role] || '🎮';
        const hasWA = !!j.telephone;

        // Bouton défier : si WA → WhatsApp, sinon message copié
        const btnDefi = hasWA
            ? `<button class="btn-defi-joueur" onclick="ouvrirDefiJoueur('${j.pseudo?.replace(/'/g,"\\'")}','${j.telephone}')">⚔ DÉFIER</button>`
            : `<button class="btn-defi-joueur" onclick="afficherNotif('⚠ Ce joueur n\\'a pas de WhatsApp enregistré')">⚔ DÉFIER</button>`;

        const btnInviter = `<button class="btn-inviter-joueur" onclick="ouvrirInviter('${j.pseudo?.replace(/'/g,"\\'")}','${j.telephone || ''}')"><i class='fas fa-plus'></i> INVITER</button>`;

        return `
        <div class="joueur-card">
            <img class="joueur-avatar" src="${photo}" alt="${j.pseudo}"
                onerror="this.src='https://ui-avatars.com/api/?name=FF&background=00d4ff&color=050810&size=128'">
            <div class="joueur-info">
                <div class="joueur-role-badge">${roleIcon} ${j.role || 'SOLDAT'}</div>
                <div class="joueur-pseudo">${j.pseudo || '—'}</div>
                <div class="joueur-meta">
                    <span><i class="fas fa-star"></i> <span class="joueur-niveau">Niv. ${j.niveau || '?'}</span></span>
                    ${j.guilde ? `<span><i class="fas fa-shield-alt"></i> ${j.guilde}</span>` : ''}
                </div>
            </div>
            <div class="joueur-card-actions">
                ${btnDefi}
                ${btnInviter}
            </div>
        </div>`;
    }).join('');

    if (viewMode === 'list') div.classList.add('list-view');
};

// ===== MODAL DÉFIER JOUEUR =====
window.ouvrirDefiJoueur = (pseudo, wa) => {
    window._defiJoueurPseudo = pseudo;
    window._defiJoueurWA = wa;
    const modal = document.getElementById('modalDefiJoueur');
    const pseudoEl = document.getElementById('defi_joueur_pseudo');
    if (pseudoEl) pseudoEl.textContent = pseudo;
    if (modal) modal.style.display = 'flex';
};

window.fermerModalJoueur = () => {
    const modal = document.getElementById('modalDefiJoueur');
    if (modal) modal.style.display = 'none';
};

window.envoyerDefiJoueur = () => {
    const mode = document.getElementById('defi_joueur_mode')?.value;
    const date = document.getElementById('defi_joueur_date')?.value;
    const heure = document.getElementById('defi_joueur_heure')?.value;

    if (!date || !heure) {
        afficherNotif("⚠ Précise la date et l'heure !");
        return;
    }

    const texte =
        `⚔️ *DÉFI REÇU !* ⚔️\n\n` +
        `Salut *${window._defiJoueurPseudo}*,\n\n` +
        `Tu as été défié via *FF ESPORT-CI* 🇨🇮.\n\n` +
        `━━━━━━━━━━━━━━━\n` +
        `🕹️ *MODE :* ${mode}\n` +
        `📅 *DATE :* ${date}\n` +
        `⏰ *HEURE :* ${heure}\n` +
        `━━━━━━━━━━━━━━━\n\n` +
        `Acceptes-tu le défi ? 🔥`;

    window.open(`https://wa.me/${window._defiJoueurWA}?text=${encodeURIComponent(texte)}`, '_blank');
    fermerModalJoueur();
    afficherNotif("⚔️ Défi envoyé !");
};

// ===== MODAL INVITER DANS GUILDE =====
window.ouvrirInviter = async (pseudo, wa) => {
    window._inviterPseudo = pseudo;
    window._inviterWA = wa;

    const modal = document.getElementById('modalInviter');
    const pseudoEl = document.getElementById('inviter_joueur_pseudo');
    const select = document.getElementById('inviter_guilde_select');

    if (pseudoEl) pseudoEl.textContent = pseudo;
    if (modal) modal.style.display = 'flex';

    // Charger les guildes
    if (select) {
        select.innerHTML = `<option value="">Chargement...</option>`;
        const { data } = await supabase.from('guildes').select('nom, chef, whatsapp');
        if (data && data.length > 0) {
            select.innerHTML = data.map(g =>
                `<option value="${g.nom}|${g.whatsapp}">${g.nom} (Leader: ${g.chef})</option>`
            ).join('');
        } else {
            select.innerHTML = `<option value="">Aucune guilde disponible</option>`;
        }
    }
};

window.fermerModalInviter = () => {
    const modal = document.getElementById('modalInviter');
    if (modal) modal.style.display = 'none';
};

window.envoyerInvitation = () => {
    const selectVal = document.getElementById('inviter_guilde_select')?.value;
    const msgPerso = document.getElementById('inviter_message')?.value.trim();

    if (!selectVal) {
        afficherNotif("⚠ Sélectionne une guilde !");
        return;
    }

    const [nomGuilde, waGuilde] = selectVal.split('|');

    if (!window._inviterWA) {
        afficherNotif("⚠ Ce joueur n'a pas de WhatsApp enregistré !");
        return;
    }

    const texte =
        `🛡️ *INVITATION DE GUILDE* 🛡️\n\n` +
        `Salut *${window._inviterPseudo}* 👋\n\n` +
        `Tu as reçu une invitation pour rejoindre la guilde *${nomGuilde}* via *FF ESPORT-CI* 🇨🇮.\n\n` +
        (msgPerso ? `💬 Message : _${msgPerso}_\n\n` : '') +
        `Tu es intéressé ? Réponds à ce message ! 🔥`;

    window.open(`https://wa.me/${window._inviterWA}?text=${encodeURIComponent(texte)}`, '_blank');
    fermerModalInviter();
    afficherNotif("✅ Invitation envoyée !");
};

// Fermer les modals en cliquant overlay
document.addEventListener('click', (e) => {
    const modalDefi = document.getElementById('modalDefi');
    const modalJoueur = document.getElementById('modalDefiJoueur');
    const modalInviter = document.getElementById('modalInviter');
    if (modalDefi && e.target === modalDefi) fermerDefi();
    if (modalJoueur && e.target === modalJoueur) fermerModalJoueur();
    if (modalInviter && e.target === modalInviter) fermerModalInviter();
});

// ===== ÉCOUTER LES CHANGEMENTS DE SESSION =====
let sessionInitialized = false;

supabase.auth.onAuthStateChange(async (event, session) => {

    if (event === 'SIGNED_IN' && session) {
        // Nettoyer l'URL complètement (retire tout le hash)
        history.replaceState(null, '', window.location.pathname);
        sessionStorage.removeItem('currentPage');

        // Marquer comme initialisé pour bloquer DOMContentLoaded
        sessionInitialized = true;

        const { data: profil } = await supabase
            .from('joueurs')
            .select('id_user')
            .eq('id_user', session.user.id)
            .single();

        if (profil) {
            afficherNotif("✅ Connecté !");
            showPage('page-profil');
            verifierSession();
        } else {
            afficherNotif("✅ Connecté ! Crée ton profil soldat 🔥");
            window._profilActuel = null;
            showPage('page-create-profil');
        }
    }

    if (event === 'SIGNED_OUT') {
        showPage('page-accueil');
    }
});

// ===== DONNÉES ÉVÉNEMENTS =====
// Ces événements sont gérés depuis l'admin et stockés dans localStorage
// Structure : { id, nom, type, dateInscriptions, dateDebut, cashprize, ticket, places, description, lien }

const EVENEMENTS_PAR_DEFAUT = [
    {
        id: 'elite-cup-s1',
        nom: 'ÉLITE CUP S1',
        type: 'TOURNOI SOLO',
        dateInscriptions: '2026-05-13T23:59:00',
        dateDebut: '2026-05-15T14:00:00',
        cashprize: '39500',
        ticket: '1000',
        places: '48',
        description: 'Le plus gros tournoi solo du mois ! 48 soldats sur la ligne de départ.',
        lien: 'https://wa.me/2250173661277'
    }
];

function getEvenements() {
    try {
        const stored = localStorage.getItem('ffesci_evenements');
        return stored ? JSON.parse(stored) : EVENEMENTS_PAR_DEFAUT;
    } catch { return EVENEMENTS_PAR_DEFAUT; }
}

function saveEvenements(evs) {
    localStorage.setItem('ffesci_evenements', JSON.stringify(evs));
}

// ===== CALENDRIER =====
let calCurrentDate = new Date(2026, 4, 1); // Mai 2026
let calView = 'grid';

const MOIS_FR = ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN',
                  'JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'];

window.setCalView = (mode) => {
    calView = mode;
    document.getElementById('cal-grid-view').style.display = mode === 'grid' ? 'block' : 'none';
    document.getElementById('cal-list-view').style.display = mode === 'list' ? 'block' : 'none';
    document.getElementById('btn-cal-grid').classList.toggle('active', mode === 'grid');
    document.getElementById('btn-cal-list').classList.toggle('active', mode === 'list');
    renderCalendrier();
};

window.calPrevMonth = () => {
    calCurrentDate.setMonth(calCurrentDate.getMonth() - 1);
    renderCalendrier();
};

window.calNextMonth = () => {
    calCurrentDate.setMonth(calCurrentDate.getMonth() + 1);
    renderCalendrier();
};

function renderCalendrier() {
    const label = document.getElementById('calMonthLabel');
    if (label) label.textContent = MOIS_FR[calCurrentDate.getMonth()] + ' ' + calCurrentDate.getFullYear();

    if (calView === 'grid') renderCalGrid();
    else renderCalList();
    renderCountdowns();
}

function getEvenementsForDay(year, month, day) {
    const evs = getEvenements();
    const results = [];
    evs.forEach(ev => {
        const dI = new Date(ev.dateInscriptions);
        const dD = new Date(ev.dateDebut);
        if (dI.getFullYear() === year && dI.getMonth() === month && dI.getDate() === day) {
            results.push({ ...ev, phase: 'inscriptions', label: '🔴 Fin inscriptions: ' + ev.nom });
        }
        if (dD.getFullYear() === year && dD.getMonth() === month && dD.getDate() === day) {
            results.push({ ...ev, phase: 'tournoi', label: '🏆 ' + ev.nom });
        }
    });
    return results;
}

function renderCalGrid() {
    const grid = document.getElementById('calGrid');
    if (!grid) return;

    const year = calCurrentDate.getFullYear();
    const month = calCurrentDate.getMonth();
    const today = new Date();

    // Premier jour du mois (0=dim, ajuster pour lun=0)
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = firstDay === 0 ? 6 : firstDay - 1;

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    let html = '';

    // Jours du mois précédent
    for (let i = firstDay - 1; i >= 0; i--) {
        html += `<div class="cal-day other-month"><div class="cal-day-num">${daysInPrevMonth - i}</div></div>`;
    }

    // Jours du mois actuel
    for (let d = 1; d <= daysInMonth; d++) {
        const isToday = today.getDate() === d && today.getMonth() === month && today.getFullYear() === year;
        const evs = getEvenementsForDay(year, month, d);
        const hasEvent = evs.length > 0;

        let evsHtml = evs.map(ev =>
            `<div class="cal-event-dot type-${ev.phase}" title="${ev.nom}">${ev.label}</div>`
        ).join('');

        html += `<div class="cal-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}">
            <div class="cal-day-num">${d}</div>
            ${evsHtml}
        </div>`;
    }

    // Compléter la grille
    const total = firstDay + daysInMonth;
    const remaining = total % 7 === 0 ? 0 : 7 - (total % 7);
    for (let i = 1; i <= remaining; i++) {
        html += `<div class="cal-day other-month"><div class="cal-day-num">${i}</div></div>`;
    }

    grid.innerHTML = html;
}

function renderCalList() {
    const list = document.getElementById('calList');
    if (!list) return;

    const evs = getEvenements();
    const now = new Date();

    // Collecter tous les jalons futurs
    const jalons = [];
    evs.forEach(ev => {
        const dI = new Date(ev.dateInscriptions);
        const dD = new Date(ev.dateDebut);
        if (dI >= now) jalons.push({ ev, date: dI, phase: 'inscriptions', label: 'Fin des inscriptions' });
        if (dD >= now) jalons.push({ ev, date: dD, phase: 'tournoi', label: 'Début du tournoi' });
    });

    jalons.sort((a, b) => a.date - b.date);

    if (jalons.length === 0) {
        list.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text-muted);font-family:var(--font-mono);font-size:13px;">AUCUN ÉVÉNEMENT À VENIR</div>`;
        return;
    }

    const colors = { inscriptions: 'var(--accent)', tournoi: 'var(--primary)', evenement: 'var(--success)' };

    list.innerHTML = jalons.map(j => {
        const color = colors[j.phase] || 'var(--primary)';
        const d = j.date;
        const jour = d.getDate().toString().padStart(2, '0');
        const mois = MOIS_FR[d.getMonth()].slice(0, 3);
        const heure = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

        return `
        <div class="cal-list-item">
            <div class="cal-list-date">
                <div class="day">${jour}</div>
                <div class="month">${mois}</div>
            </div>
            <div class="cal-list-info">
                <h4>${j.ev.nom}</h4>
                <p>${j.label} — ${heure} GMT</p>
                ${j.ev.cashprize ? `<p style="color:var(--primary);font-family:var(--font-mono);font-size:11px;margin-top:4px;">💰 ${parseInt(j.ev.cashprize).toLocaleString()} FCFA</p>` : ''}
            </div>
            <div class="cal-list-type" style="color:${color};border-color:${color};">
                ${j.ev.type}
            </div>
        </div>`;
    }).join('');
}

function renderCountdowns() {
    const grid = document.getElementById('countdownsGrid');
    if (!grid) return;

    const evs = getEvenements();
    const now = new Date();
    let html = '';

    evs.forEach(ev => {
        const dI = new Date(ev.dateInscriptions);
        const dD = new Date(ev.dateDebut);

        // Phase inscriptions si pas encore terminée
        if (dI > now) {
            html += buildCountdownCard(ev, dI, 'inscriptions', 'FIN DES INSCRIPTIONS');
        }
        // Phase tournoi si pas encore commencé
        if (dD > now) {
            html += buildCountdownCard(ev, dD, 'tournoi', 'DÉBUT DU TOURNOI');
        }
    });

    if (!html) {
        html = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-muted);font-family:var(--font-mono);font-size:13px;">AUCUN COMPTE À REBOURS ACTIF</div>`;
    }

    grid.innerHTML = html;

    // Démarrer les timers
    evs.forEach(ev => {
        if (new Date(ev.dateInscriptions) > now) startTimer(ev.id + '-inscriptions', new Date(ev.dateInscriptions));
        if (new Date(ev.dateDebut) > now) startTimer(ev.id + '-tournoi', new Date(ev.dateDebut));
    });
}

function buildCountdownCard(ev, targetDate, phase, phaseLabel) {
    const id = ev.id + '-' + phase;
    return `
    <div class="countdown-card phase-${phase}">
        <div class="cd-phase">${phaseLabel}</div>
        <div class="cd-titre">${ev.nom}</div>
        <div class="cd-timer">
            <div class="cd-block"><span class="cd-num" id="${id}-j">00</span><span class="cd-lbl">JOURS</span></div>
            <span class="cd-sep">:</span>
            <div class="cd-block"><span class="cd-num" id="${id}-h">00</span><span class="cd-lbl">HEURES</span></div>
            <span class="cd-sep">:</span>
            <div class="cd-block"><span class="cd-num" id="${id}-m">00</span><span class="cd-lbl">MINS</span></div>
            <span class="cd-sep">:</span>
            <div class="cd-block"><span class="cd-num" id="${id}-s">00</span><span class="cd-lbl">SECS</span></div>
        </div>
        <div class="cd-info">${new Date(targetDate).toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' }).toUpperCase()} À ${new Date(targetDate).toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'})} GMT</div>
        ${ev.lien ? `<a href="${ev.lien}" target="_blank" class="btn-primary btn-sm" style="margin-top:14px;display:inline-flex;">
            <i class="fab fa-whatsapp"></i> S'INSCRIRE
        </a>` : ''}
    </div>`;
}

const activeTimers = {};

function startTimer(id, targetDate) {
    if (activeTimers[id]) clearInterval(activeTimers[id]);

    function tick() {
        const now = new Date().getTime();
        const diff = new Date(targetDate).getTime() - now;
        if (diff <= 0) {
            clearInterval(activeTimers[id]);
            ['j','h','m','s'].forEach(u => { const el = document.getElementById(`${id}-${u}`); if(el) el.textContent = '00'; });
            return;
        }
        const pad = n => String(Math.floor(n)).padStart(2, '0');
        const j = document.getElementById(`${id}-j`);
        const h = document.getElementById(`${id}-h`);
        const m = document.getElementById(`${id}-m`);
        const s = document.getElementById(`${id}-s`);
        if (j) j.textContent = pad(diff / (1000*60*60*24));
        if (h) h.textContent = pad((diff % (1000*60*60*24)) / (1000*60*60));
        if (m) m.textContent = pad((diff % (1000*60*60)) / (1000*60));
        if (s) s.textContent = pad((diff % (1000*60)) / 1000);
    }
    tick();
    activeTimers[id] = setInterval(tick, 1000);
}

// ===== ADMIN =====
const ADMIN_PASSWORD = 'ffstaff2026'; // 👈 Change ici

window.verifierAdmin = () => {
    const pwd = document.getElementById('admin-pwd')?.value;
    const error = document.getElementById('admin-error');

    if (pwd === ADMIN_PASSWORD) {
        document.getElementById('admin-auth').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
        sessionStorage.setItem('ffesci_admin', '1');
        chargerAdminEvenements();
        chargerAdminGuildes();
        chargerNotifEvents();
        afficherNotif('✅ Accès staff accordé !');
    } else {
        if (error) error.style.display = 'block';
        setTimeout(() => { if (error) error.style.display = 'none'; }, 3000);
    }
};

window.deconnecterAdmin = () => {
    sessionStorage.removeItem('ffesci_admin');
    document.getElementById('admin-auth').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    document.getElementById('admin-pwd').value = '';
    afficherNotif('👋 Session admin terminée');
};

// Vérifier si déjà connecté admin à la navigation
function checkAdminSession() {
    if (sessionStorage.getItem('ffesci_admin') === '1') {
        const authEl = document.getElementById('admin-auth');
        const panelEl = document.getElementById('admin-panel');
        if (authEl) authEl.style.display = 'none';
        if (panelEl) {
            panelEl.style.display = 'block';
            chargerAdminEvenements();
            chargerAdminGuildes();
            chargerNotifEvents();
        }
    } else {
        // Pré-remplir le mot de passe
        const pwdEl = document.getElementById('admin-pwd');
        if (pwdEl) pwdEl.value = ADMIN_PASSWORD;
    }
}

window.switchAdminTab = (tab) => {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-content').forEach(c => c.style.display = 'none');
    document.getElementById('tab-' + tab).style.display = 'block';
    event.currentTarget.classList.add('active');
};

// Ajouter événement
window.ajouterEvenement = () => {
    const nom = document.getElementById('ev-nom')?.value.trim();
    const type = document.getElementById('ev-type')?.value;
    const dateI = document.getElementById('ev-date-inscriptions')?.value;
    const dateD = document.getElementById('ev-date-debut')?.value;
    const cashprize = document.getElementById('ev-cashprize')?.value.trim();
    const ticket = document.getElementById('ev-ticket')?.value.trim();
    const places = document.getElementById('ev-places')?.value.trim();
    const description = document.getElementById('ev-description')?.value.trim();
    const lien = document.getElementById('ev-lien')?.value.trim();

    if (!nom || !dateI || !dateD) {
        afficherNotif('⚠ Nom, date inscriptions et date début sont obligatoires !');
        return;
    }

    const evs = getEvenements();
    const newEv = {
        id: 'ev-' + Date.now(),
        nom, type, dateInscriptions: dateI, dateDebut: dateD,
        cashprize, ticket, places, description, lien
    };

    evs.push(newEv);
    saveEvenements(evs);

    // Vider le formulaire
    ['ev-nom','ev-cashprize','ev-ticket','ev-places','ev-description','ev-lien',
     'ev-date-inscriptions','ev-date-debut'].forEach(id => {
        const el = document.getElementById(id); if(el) el.value = '';
    });

    afficherNotif('✅ Événement publié !');
    chargerAdminEvenements();
    chargerNotifEvents();
    renderCalendrier();
};

function chargerAdminEvenements() {
    const list = document.getElementById('admin-evenements-list');
    if (!list) return;

    const evs = getEvenements();
    if (!evs.length) {
        list.innerHTML = `<p style="color:var(--text-muted);font-family:var(--font-mono);font-size:13px;padding:20px 0;">AUCUN ÉVÉNEMENT</p>`;
        return;
    }

    list.innerHTML = evs.map(ev => `
        <div class="admin-event-item">
            <div>
                <h5>${ev.nom}</h5>
                <p>${ev.type} · Inscriptions jusqu'au ${new Date(ev.dateInscriptions).toLocaleDateString('fr-FR')} · Début le ${new Date(ev.dateDebut).toLocaleDateString('fr-FR')}</p>
            </div>
            <button class="btn-delete" onclick="supprimerEvenement('${ev.id}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

window.supprimerEvenement = (id) => {
    const evs = getEvenements().filter(e => e.id !== id);
    saveEvenements(evs);
    afficherNotif('🗑 Événement supprimé');
    chargerAdminEvenements();
    renderCalendrier();
};

// Annonces
window.publierAnnonce = async () => {
    const titre = document.getElementById('ann-titre')?.value.trim();
    const cat = document.getElementById('ann-cat')?.value;
    const contenu = document.getElementById('ann-contenu')?.value.trim();

    if (!titre || !contenu) {
        afficherNotif('⚠ Titre et contenu obligatoires !');
        return;
    }

    const { error } = await supabase.from('annonces').insert([{
        titre, categorie: cat, contenu,
        created_at: new Date().toISOString()
    }]);

    if (error) {
        // Si la table n'existe pas encore, on affiche quand même un succès visuel
        afficherNotif('⚠ ' + error.message);
        return;
    }

    afficherNotif('📢 Annonce publiée !');
    document.getElementById('ann-titre').value = '';
    document.getElementById('ann-contenu').value = '';
};

// Guildes admin
async function chargerAdminGuildes() {
    const list = document.getElementById('admin-guildes-list');
    if (!list) return;

    const { data, error } = await supabase.from('guildes').select('*').order('id', { ascending: false }).limit(20);

    if (error || !data?.length) {
        list.innerHTML = `<p style="color:var(--text-muted);font-family:var(--font-mono);font-size:13px;padding:20px 0;">AUCUNE GUILDE À VALIDER</p>`;
        return;
    }

    list.innerHTML = data.map(g => `
        <div class="admin-event-item">
            <div>
                <h5>${g.nom}</h5>
                <p>Leader : ${g.chef} · WA : +${g.whatsapp}</p>
            </div>
            <button class="btn-delete" onclick="supprimerGuilde(${g.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

window.supprimerGuilde = async (id) => {
    const { error } = await supabase.from('guildes').delete().eq('id', id);
    if (!error) {
        afficherNotif('🗑 Guilde supprimée');
        chargerAdminGuildes();
        chargerGuildes();
    } else {
        afficherNotif('❌ Erreur : ' + error.message);
    }
};

// ===== NOTIFICATIONS WHATSAPP =====
function chargerNotifEvents() {
    const select = document.getElementById('notif-event-select');
    if (!select) return;

    const evs = getEvenements();
    select.innerHTML = `<option value="">Sélectionne un événement...</option>` +
        evs.map(ev => `<option value="${ev.id}">${ev.nom}</option>`).join('');

    select.addEventListener('change', genererPreviewNotif);

    document.querySelectorAll('input[name="notif-type"]').forEach(r => {
        r.addEventListener('change', () => {
            const isCustom = r.value === 'custom';
            const customEl = document.getElementById('notif-custom-msg');
            if (customEl) customEl.style.display = isCustom ? 'block' : 'none';
            if (!isCustom) genererPreviewNotif();
        });
    });
}

function genererPreviewNotif() {
    const evId = document.getElementById('notif-event-select')?.value;
    const type = document.querySelector('input[name="notif-type"]:checked')?.value;
    const preview = document.getElementById('notif-preview');

    if (!evId || !type || type === 'custom' || !preview) {
        if (preview) preview.classList.remove('visible');
        return;
    }

    const ev = getEvenements().find(e => e.id === evId);
    if (!ev) return;

    const dD = new Date(ev.dateDebut);
    const dateStr = dD.toLocaleDateString('fr-FR', { weekday:'long', day:'numeric', month:'long' });
    const heureStr = dD.toLocaleTimeString('fr-FR', { hour:'2-digit', minute:'2-digit' });

    const messages = {
        j7: `🔔 *RAPPEL J-7* 🔔\n\n📣 Le tournoi *${ev.nom}* commence dans 7 jours !\n\n📅 Date : ${dateStr}\n⏰ Heure : ${heureStr} GMT\n💰 Cashprize : ${parseInt(ev.cashprize||0).toLocaleString()} FCFA\n🎟️ Ticket : ${ev.ticket||'?'} FCFA\n\nInscris-toi maintenant avant qu'il soit trop tard ! 🔥`,
        j3: `⚡ *RAPPEL J-3* ⚡\n\n🏆 Le tournoi *${ev.nom}* commence dans 3 jours !\n\n📅 ${dateStr} à ${heureStr} GMT\n💰 Cashprize : ${parseInt(ev.cashprize||0).toLocaleString()} FCFA\n\nPlaces limitées — inscris-toi vite ! 🚨`,
        j1: `🚨 *DERNIÈRE CHANCE* 🚨\n\n⚔️ Le tournoi *${ev.nom}* commence DEMAIN !\n\n📅 ${dateStr}\n⏰ ${heureStr} GMT\n💰 ${parseInt(ev.cashprize||0).toLocaleString()} FCFA à gagner\n\nSois prêt, soldat ! 🔥🇨🇮`
    };

    preview.textContent = messages[type] || '';
    preview.classList.add('visible');
}

window.envoyerNotifWA = () => {
    const evId = document.getElementById('notif-event-select')?.value;
    const type = document.querySelector('input[name="notif-type"]:checked')?.value;

    if (!evId) { afficherNotif('⚠ Sélectionne un événement !'); return; }

    let message = '';

    if (type === 'custom') {
        message = document.getElementById('notif-message')?.value.trim();
        if (!message) { afficherNotif('⚠ Écris ton message !'); return; }
    } else {
        const preview = document.getElementById('notif-preview');
        message = preview?.textContent || '';
        if (!message) { genererPreviewNotif(); message = document.getElementById('notif-preview')?.textContent || ''; }
    }

    if (!message) { afficherNotif('⚠ Message vide !'); return; }

    // Ouvre WhatsApp vers le groupe officiel
    const groupWA = 'https://chat.whatsapp.com/KUm4uoqUBgD78Bh3onKOCi';
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
    afficherNotif('📲 Message copié — colle-le dans WhatsApp !');
};

// ===== SERVICE WORKER (PWA) =====
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("✔ PWA activée"))
        .catch(err => console.warn("SW error:", err));
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', async () => {
    lancerIntro();
    chargerActus();
    chargerGuildes();
    chargerStats();
    renderCalendrier();

    // Si callback OAuth → onAuthStateChange gère tout, on attend
    if (window.location.hash.includes('access_token=') || window.location.href.includes('access_token=')) return;

    // Attendre un tick pour laisser onAuthStateChange se déclencher si session existante
    await new Promise(resolve => setTimeout(resolve, 200));

    // Si onAuthStateChange a déjà géré la session, ne pas écraser
    if (sessionInitialized) return;

    sessionInitialized = true;

    // Navigation normale
    const savedPage = sessionStorage.getItem('currentPage');
    if (savedPage && document.getElementById(savedPage)) {
        showPage(savedPage);
    } else {
        showPage('page-accueil');
    }

    verifierSession();
});
