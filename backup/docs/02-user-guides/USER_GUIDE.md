---
title: "WinMix TipsterHub - Teljes Felhasználói Útmutató"
description: "Comprehensive end-to-end user guide for WinMix TipsterHub platform"
category: "02-user-guides"
language: "hu"
version: "1.1.0"
last_updated: "2025-11-27"
author: "WinMix TipsterHub Team"
status: "active"
related_docs:
  - "/docs/01-getting-started/QUICK_START.md"
  - "/docs/02-user-guides/ROLE_PERMISSIONS.md"
  - "/docs/03-admin-guides/ADMIN_OVERVIEW_HU.md"
tags: ["user-guide", "manual", "tutorial", "comprehensive"]
---

# WinMix TipsterHub - Teljes Felhasználói Útmutató

**Comprehensive End-to-End User Guide** / Részletes Felhasználói Útmutató

---

## Tartalomjegyzék / Table of Contents

1. [Bevezetés és Első Lépések](#1-bevezetés-és-első-lépések)
2. [Navigáció és Fő Folyamatok](#2-navigáció-és-fő-folyamatok)
3. [Adatok és Modellek](#3-adatok-és-modellek)
4. [CSV Importálás (Hamarosan)](#4-csv-importálás-hamarosan)
5. [Háttérfolyamatok és Feladatok](#5-háttérfolyamatok-és-feladatok)
6. [Monitorozás és Hibaelhárítás](#6-monitorozás-és-hibaelhárítás)
7. [Biztonság és Adatvédelem](#7-biztonság-és-adatvédelem)
8. [Gyakran Ismételt Kérdések](#8-gyakran-ismételt-kérdések)

---

## 1. Bevezetés és Első Lépések

### Rendszer Áttekintése / System Overview

**English Summary:** WinMix TipsterHub is an AI-powered football analytics platform that provides predictions, match analysis, and collaborative intelligence features across multiple phases of development.

A WinMix TipsterHub egy MI-alapú labdarúgás elemzési platform, amely:
- Predikciókat generál meccsekre
- Valós idejű elemzéseket nyújt
- Szerepkör-alapú hozzáférést biztosít
- Közösségi intelligenciát használ

### Terminológia / Key Terms

| Magyar / Hungarian | English | Leírás / Description |
|---|---|---|
| Jóslat | Prediction | AI által generált meccseredmény |
| Konfidencia | Confidence | Predikció megbízhatósági szintje |
| CSS Score | CSS Score | Custom Scoring System értékelés |
| Szerepkör | Role | Felhasználói jogosultsági szint |
| Háttérfeladat | Background Job | Automatizált rendszerfolyamat |

### Hozzáférés és Regisztráció / Access and Registration

#### Regisztráció Lépései / Sign-up Steps

1. **Látogasson el** a `/signup` oldalra
2. **Adja meg** email címét és jelszavát
   - Minimum 6 karakter hosszúságú jelszó
   - Érvényes email formátum
3. **Kattintson** a "Regisztráció" gombra
4. **Ellenőrizze** email fiókját a megerősítő linkért
5. **Jelentkezzen be** a `/login` oldalon

**English Summary:** Users can register with email/password, with automatic profile creation and optional email verification.

### Szerepkörök és Jogosultságok / Roles and Permissions

| Funkció / Feature | Admin | Elemző / Analyst | Felhasználó / User |
|---|---|---|---|
| 📊 Irányítópult / Dashboard | ✅ | ✅ | ✅ |
| 🔍 Predikciók létrehozása / Create predictions | ✅ | ✅ | ❌ |
| 📈 Elemzések / Analytics | ✅ | ✅ | ✅ (olvasás) |
| ⚙️ Modellek / Models | ✅ | ✅ | ✅ (olvasás) |
| 📋 Háttérfeladatok / Jobs | ✅ | ✅ | ❌ |
| 🌐 Bajnokságok / Leagues | ✅ | ✅ | ✅ |
| 👥 Csapatok / Teams | ✅ | ✅ | ✅ |
| 📱 Monitorozás / Monitoring | ✅ | ✅ | ❌ |

**English Summary:** Three-tier role system with Admin having full access, Analyst able to create predictions and manage jobs, and User having read-only access to most features.

---

## 2. Navigáció és Fő Folyamatok

### Útvonal Struktúra / Route Structure

#### Nyilvános Oldalak / Public Pages (Nincs auth szükséges)

```
🏠 / - Főoldal
🔐 /login - Bejelentkezés
📝 /signup - Regisztráció
```

#### Védett Útvonalak / Protected Routes (Auth szükséges)

```
📊 /dashboard - Főirányítópult
🔮 /predictions - Predikciók megtekintése
🔮 /predictions/new - Új predikció (Analyst+)
📈 /analytics - Elemzések
⚙️ /models - Modellek
📱 /monitoring - Monitorozás (Analyst+)
🌐 /crossleague - Bajnokságok közötti elemzés
```

---

## 3. Adatok és Modellek

### Predikció Generálás / Prediction Generation

**Folyamat / Process:**

1. **Adatgyűjtés** - Meccs adatok, statisztikák
2. **Elemzés** - Form elemzés, head-to-head
3. **Model futtatás** - AI algoritmusok
4. **Konfidencia számítás** - Megbízhatóság értékelés
5. **Predikció mentés** - Adatbázisba tárolás

---

## 4. CSV Importálás (Hamarosan)

> **Tervezett funkcionalitás** - Jelenleg nem elérhető.

---

## 5. Háttérfolyamatok és Feladatok

### Létező Háttérfeladatok / Existing Background Jobs

| Feladat / Job | Ütemezés / Schedule | Leírás / Description |
|---|---|---|
| Adatgyűjtés / Data Collection | Napi / Daily | Meccs adatok frissítése |
| Predikció generálás / Prediction Generation | Óránként / Hourly | Új predikciók készítése |
| Statisztika számítás / Statistics | Naponta / Daily | Teljesítmény metrikák |
| Rendszer karbantartás / Maintenance | Heti / Weekly | Adattisztítás, optimalizáció |

---

## 6. Monitorozás és Hibaelhárítás

### /monitoring Oldal Használata / Using the Monitoring Page

#### Rendszer Állapot Kártyák / System Health Cards

```
💚 Zöld - Minden rendben
🟡 Sárga - Figyelmeztetés
❌ Piros - Kritikus hiba
```

---

## 7. Biztonság és Adatvédelem

### Row Level Security (RLS) / Sor Szintű Biztonság

**English Summary:** The system uses Row Level Security policies to ensure users can only access data they're authorized to see.

---

## 8. Gyakran Ismételt Kérdések

**Q: Milyen gyakran frissülnek a predikciók?**  
A: Predikciók óránként frissülnek automatikusan, de meccsnapokon gyakrabban.

**Q: Pontosak a predikciók?**  
A: A predikciók pontossága változó, általában 60-75% között mozog.

---

## Kapcsolat és Támogatás / Contact and Support

- **[Gyors Kezdés](../01-getting-started/QUICK_START.md)** - 10-15 perces bevezető
- **[Szerepkörök és Jogosultságok](./ROLE_PERMISSIONS.md)** - Jogosultsági mátrix
- **[Admin Útmutató](../03-admin-guides/ADMIN_OVERVIEW_HU.md)** - Admin feladatok

---

**Verzió:** 1.1.0  
**Utolsó frissítés:** 2025-11-27  
**Karbantartó:** WinMix TipsterHub Documentation Team
