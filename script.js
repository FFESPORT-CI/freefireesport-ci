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
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.location.hash = pageId;

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active-link');
        if (link.dataset.page === pageId) link.classList.add('active-link');
    });

    // Déclencher les chargements spécifiques par page
    if (pageId === 'page-profil') verifierSession();
    if (pageId === 'page-guildes') chargerGuildes();
    if (pageId === 'page-joueurs') chargerJoueurs();
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
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.href }
    });
    if (error) afficherNotif("❌ Erreur connexion : " + error.message);
};

window.deconnexion = async () => {
    await supabase.auth.signOut();
    afficherNotif("👋 Déconnecté !");
    showPage('page-profil');
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

// ===== SERVICE WORKER (PWA) =====
if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js")
        .then(() => console.log("✔ PWA activée"))
        .catch(err => console.warn("SW error:", err));
}

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Intro
    lancerIntro();

    // Charger les données
    chargerActus();
    chargerGuildes();
    chargerStats();
    chargerJoueurs();
    verifierSession();

    // Gérer le hash URL (navigation directe)
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        showPage(hash);
    } else {
        showPage('page-accueil');
    }
});
