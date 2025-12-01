---
title: "Gyors Kezdés / Quick Start"
description: "10-15 perces gyors bevezetés a WinMix TipsterHub használatához"
category: "01-getting-started"
language: "hu"
version: "1.1.0"
last_updated: "2025-11-27"
author: "WinMix TipsterHub Team"
status: "active"
related_docs:
  - "/docs/02-user-guides/USER_GUIDE.md"
  - "/docs/03-admin-guides/ADMIN_OVERVIEW_HU.md"
  - "/docs/04-architecture/ARCHITECTURE_OVERVIEW.md"
tags: ["quick-start", "tutorial", "beginner", "onboarding"]
---

# WinMix TipsterHub – Gyors Kezdés

> **English Summary:** 10-15 minute quick start guide covering registration, first login, basic navigation, making predictions, and accessing analytics. Designed for first-time users.

**Becsült időigény:** 10-15 perc  
**Célközönség:** Új felhasználók  
**Előfeltétel:** Modern böngésző (Chrome, Firefox, Safari, Edge)

---

## 📋 Tartalomjegyzék

1. [Regisztráció és Első Bejelentkezés](#1-regisztráció-és-első-bejelentkezés)
2. [Irányítópult Áttekintése](#2-irányítópult-áttekintése)
3. [Első Predikció Létrehozása](#3-első-predikció-létrehozása)
4. [Elemzések Megtekintése](#4-elemzések-megtekintése)
5. [Gyors Beállítások](#5-gyors-beállítások)
6. [Mobil Használat](#6-mobil-használat)
7. [Hibaelhárítás](#7-hibaelhárítás)
8. [Következő Lépések](#8-következő-lépések)

---

## 1. Regisztráció és Első Bejelentkezés

### Regisztráció Lépései

1. **Látogasson el a platformra**
   ```
   https://yourdomain.com/signup
   ```

2. **Töltse ki a regisztrációs űrlapot**
   - Email cím (érvényes email formátum szükséges)
   - Jelszó (minimum 6 karakter, ajánlott: 8+ karakter számokkal és szimbólumokkal)
   - Jelszó megerősítése

3. **Email megerősítés** (opcionális konfigurációtól függően)
   - Ellenőrizze postafiókját
   - Kattintson a megerősítő linkre

4. **Első bejelentkezés**
   ```
   https://yourdomain.com/login
   ```
   - Adja meg email címét és jelszavát
   - Kattintson a "Bejelentkezés" gombra

### Szerepkörök

**Alapértelmezett szerepkör:** User (Felhasználó)

| Szerepkör | Jogosultságok |
|-----------|---------------|
| **User** | Predikciók megtekintése, analytics olvasás |
| **Analyst** | + Predikciók létrehozása, háttérfeladatok kezelése |
| **Admin** | + Teljes hozzáférés, felhasználó kezelés |

> **Megjegyzés:** Szerepkör váltáshoz vegye fel a kapcsolatot egy adminnal.

---

## 2. Irányítópult Áttekintése

### Fő Navigáció

```
🏠 / (Főoldal)
📊 /dashboard (Irányítópult) - Bejelentkezés után
🔮 /predictions (Predikciók)
📈 /analytics (Elemzések)
⚙️ /models (Modellek) - Phase 6+
📱 /monitoring (Monitorozás) - Phase 8+
```

### Dashboard Widgets

1. **Teljesítmény Összesítő**
   - Aktív modellek száma
   - Pontossági mutatók
   - Legutóbbi predikciók

2. **Meccs Naptár**
   - Közelgő meccsek
   - Predikciók megtekintése

3. **Trend Grafikonok**
   - Pontossági trendek
   - Konfidencia eloszlás

---

## 3. Első Predikció Létrehozása

> **Megjegyzés:** Predikció létrehozásához **Analyst** vagy **Admin** szerepkör szükséges.

### Lépések

1. **Navigáljon a Predikciók oldalra**
   ```
   /predictions/new
   ```

2. **Válasszon meccseket**
   - Minimum 1, maximum 8 meccs kiválasztása
   - Válasszon bajnokságot és szezon.t

3. **Adja meg predikcióit**
   - Kimenetel: Hazai győzelem / Döntetlen / Vendég győzelem
   - Konfidencia: 1-100 skálán (opcionális)
   - Várható gólok (opcionális)
   - BTTS (Both Teams To Score) - Mindkét csapat szerez-e gól

4. **Elemzés és mentés**
   - Kattintson az "Elemzés" gombra
   - Tekintse meg az AI által generált elemzést
   - Kattintson a "Mentés" gombra

### Predikció Példa

```json
{
  "match_id": "uuid-123",
  "predicted_outcome": "home_win",
  "confidence_score": 75,
  "predicted_home_score": 2,
  "predicted_away_score": 1,
  "btts_prediction": true
}
```

---

## 4. Elemzések Megtekintése

### Analytics Dashboard

1. **Navigáljon az Elemzések oldalra**
   ```
   /analytics
   ```

2. **Elérhető Vizualizációk**
   - **Teljesítmény Grafikonok**: Pontosság időbeli alakulása
   - **Konfidencia Kalibrációs**: Várható vs valós pontosság
   - **Bajnokságonkénti Bontás**: Liga-specifikus teljesítmény
   - **Model Összehasonlítás**: Több model teljesítménye egymáshoz képest

3. **Szűrési Lehetőségek**
   - Időszak: Utolsó 7 nap, 30 nap, 90 nap, egyedi
   - Bajnokság: Összes, Premier League, La Liga, stb.
   - Model: Válasszon specifikus modelt

---

## 5. Gyors Beállítások

### Profil Beállítások

1. **Navigáljon a Profil oldalra**
   ```
   /profile
   ```

2. **Módosítható Beállítások**
   - Teljes név
   - Email cím (email megerősítés szükséges)
   - Jelszó módosítás
   - Értesítési preferenciák (későbbi funkció)

### Nyelvi Beállítások

**Jelenlegi támogatás:**
- Magyar (elsődleges)
- Angol (részleges)

> **Tervezett:** Többnyelvű támogatás a jövőben.

---

## 6. Mobil Használat

### Reszponzív Dizájn

A platform teljesen reszponzív, működik:
- Mobiltelefon (320px+)
- Tablet (768px+)
- Desktop (1024px+)

### Mobil Tippek

1. **Navigáció**: Hamburger menü bal felső sarokban
2. **Grafikonok**: Interaktívak, pinch-to-zoom támogatott
3. **Űrlapok**: Mobil-optimalizált beviteli mezők

### PWA Támogatás (Tervezett)

- Offline működés
- Push értesítések
- Home screen telepítés

---

## 7. Hibaelhárítás

### Gyakori Problémák

#### "Nem tudok bejelentkezni"
- **Megoldás:** Ellenőrizze email címet és jelszót. Használja a "Elfelejtett jelszó" funkciót.

#### "Lassú a rendszer"
- **Megoldás:** Ellenőrizze internetkapcsolatot. Próbálja meg a böngésző gyorsítótár ürítését (Ctrl+Shift+Del).

#### "Hiányzó adatok"
- **Megoldás:** Az adatok frissítése időbe telhet. Ellenőrizze a `/monitoring` oldalon a rendszer állapotát.

#### "Predikció létrehozása nem működik"
- **Megoldás:** Győződjön meg róla, hogy Analyst vagy Admin szerepkörrel rendelkezik.

### Hibajelentés

1. **Navigáljon a Monitoring oldalra**: `/monitoring`
2. **Ellenőrizze a rendszer állapotot**: Zöld = OK, Sárga = Figyelmeztetés, Piros = Hiba
3. **Kapcsolat**: Vegye fel a kapcsolatot az adminnal részletes hibajelentéshez

---

## 8. Következő Lépések

### Haladó Funkciók

- **Phase 6: Model Management** - Modellek kezelése és összehasonlítása
- **Phase 7: Cross-League Intelligence** - Bajnokságok közötti elemzés
- **Phase 8: Monitoring** - Rendszer teljesítmény monitorozás
- **Phase 9: Collaborative Intelligence** - Közösségi intelligencia és piaci integráció

### További Dokumentáció

- **[Teljes Felhasználói Útmutató](../02-user-guides/USER_GUIDE.md)** - Részletes használati útmutató
- **[Szerepkörök és Jogosultságok](../02-user-guides/ROLE_PERMISSIONS.md)** - Jogosultsági mátrix
- **[Admin Útmutató](../03-admin-guides/ADMIN_OVERVIEW_HU.md)** - Adminisztratív feladatok

### Képzési Anyagok (Tervezett)

- Videó tutorialok (5-10 perc/feature)
- Interaktív bemutatók
- Webinárok és Q&A szesszók

---

## Hasznos Linkek

- **Dokumentáció Főoldal**: [README.md](../00-meta/README.md)
- **API Referencia**: [API_REFERENCE.md](../05-api-reference/API_REFERENCE.md)
- **Hibaelhárítási Útmutató**: [OPERATIONS_RUNBOOK.md](../11-deployment/OPERATIONS_RUNBOOK.md)

---

**Verzió:** 1.1.0  
**Utolsó frissítés:** 2025-11-27  
**Karbantartó:** WinMix TipsterHub Documentation Team

---

**English Summary:**  
This Quick Start guide walks new users through registration, dashboard navigation, making their first prediction, viewing analytics, and mobile usage in 10-15 minutes. It includes troubleshooting tips and next steps for exploring advanced features.
