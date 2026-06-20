# 📚 SLR Flow

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-%3E%3D10-e0234e.svg?style=flat-square&logo=nestjs&logoColor=white)](https://nestjs.com/)

> **Systematic Literature Review Flow Manager**  
> A streamlined workspace to manage academic paper screening, criteria evaluation, and data extraction without the spreadsheet chaos.

---

## 🛑 The Problem

Conducting a Systematic Literature Review (SLR) requires analyzing hundreds or thousands of scientific papers. Managing the traditional research funnel—removing duplicates, applying inclusion/exclusion criteria, screening abstracts, and extracting data—using standard spreadsheets is highly error-prone, hard to track, and difficult to collaborate on within a research lab.

## 💡 The Solution

**SLR Flow** is a dedicated tool designed to track the entire lifecycle of a systematic review. It provides a structured, step-by-step pipeline that ensures methodological rigor, prevents data loss, and makes it drastically easier to manage the paper pipeline for high-quality academic publications.

---

## ✨ Core Features

*   **📋 Protocol Management:** Define your Research Questions (RQs), search strings, and strict Inclusion/Exclusion Criteria (IC/EC) upfront.
*   **📥 Centralized Import:** Aggregate raw search results from major scientific databases (e.g., IEEE, ACM, Scopus, Web of Science).
*   **🔍 Phase 1 - Abstract Screening:** A distraction-free UI to quickly Accept/Reject papers based purely on their title and abstract, with mandatory criteria tagging for rejections.
*   **📖 Phase 2 - Full-Text Review:** Manage the deep-reading queue. Document exact reasons for exclusion to maintain traceability.
*   **📊 Data Extraction:** Structured forms to extract both quantitative and qualitative data required to answer your research questions.
*   **📈 PRISMA Ready:** Automatically tracks the flow of papers (identified, screened, included) to easily generate standard PRISMA flow diagrams.

---

## 🛠️ Tech Stack

*   **Backend:** [NestJS](https://nestjs.com/) (Node.js framework)
*   **Language:** TypeScript (100% strict type coverage)
*   **Database:** (Add your DB here, e.g., PostgreSQL / Prisma ORM)
*   **Containerization:** Docker & Docker Compose ready

---

## 🚀 Quick Start

### Prerequisites
Make sure you have Node.js (v20+) and Docker installed on your machine.

### Installation

```bash
# 1. Clone the repository
git clone [https://github.com/YvesDeSa/slr-flow.git](https://github.com/YvesDeSa/slr-flow.git)
cd slr-flow

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env

# 4. Start the database (if using Docker)
docker-compose up -d

# 5. Run database migrations
npm run db:migrate

# 6. Start the development server
npm run start:dev

```

---

## 🗺️ The SLR Pipeline

This application enforces the standard academic methodology for literature reviews:

1. **Identification:** Upload metadata records from scientific bases.
2. **Screening:** Fast-pass review over Titles & Abstracts.
3. **Eligibility:** Full-text analysis of accepted papers against IC/EC rules.
4. **Included:** Final list of papers ready for the Data Extraction phase.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://www.google.com/search?q=https://github.com/YvesDeSa/slr-flow/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 👨‍💻 Author

Created by **Yves de Sá Barbosa**.

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.
