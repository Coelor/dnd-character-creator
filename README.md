# DnD Character & Campaign Manager

*Based on AWS Amplify React+Vite Starter Template: a starter template for React+Vite apps with Amplify integration.*

---

## 📝 Overview

This application provides a guided, multi-step character creation experience for D\&D 5e, persisting data in DynamoDB via AWS AppSync (GraphQL) and leveraging AWS Amplify for development velocity. It includes:

* **Authentication**: Secure user sign-up and login with Amazon Cognito
* **API**: GraphQL endpoint powered by AWS AppSync
* **Database**: JSON-backed persistence in Amazon DynamoDB

Users can:

* Sign up / log in via Cognito
* Create characters through a wizard (Basics → Race → Class → Abilities → Background → Review)
* Save, update, and fetch characters (with JSON fields stored as AWSJSON) **In Progress**
* View saved characters on a responsive Dashboard **In Progress**

---

## 🚀 Features

### Implemented

* **Authentication**: Amplify & Cognito user flows (sign-up, login, password reset)
* **GraphQL API**: CRUD operations using AppSync and DynamoDB
* **Multi‑step Form**:

  * Basics (name, alignment, HP, AC, initiative)
  * Race selection with ability bonuses
  * Class selection (core classes)
  * Abilities entry (Randomizer | Standard Array | Manual)
  * Backgrounds with trait picker (personality, ideals, bonds, flaws)
  * Review & Save
* **Data Serialization**: JSON.stringify on all AWSJSON fields (`baseAbilities`, `raceBonuses`, `classAbilityBonuses`, etc.)

### On the Backburner

* Campaign & session management
* Printable character sheet export (PDF)
* Collaboration & sharing features
* Custom avatar uploads
* Automated level‑up ability improvements
* Unit & integration tests (Jest, React Testing Library)
* Fetch & display character cards (image, name, level, stats) on Dashboard

---

## 🧰 Tech Stack

* **Frontend**: React, Vite, TypeScript, Tailwind CSS, React Router
* **Backend**: AWS Amplify, AWS AppSync (GraphQL), DynamoDB, Lambda, API Gateway
* **Auth**: Amazon Cognito
* **Hosting**: AWS Amplify Console

---

## ⚙️ Setup & Installation

### Prerequisites

* Node.js (>=14)
* AWS CLI & Amplify CLI configured

### Local Development

```bash
# Clone
git clone <repo-url>
cd <project-directory>

# Install
npm install

# Pull backend
amplify pull --appId <AMPLIFY_APP_ID> --envName dev

# Run
npm start
```

Open your browser at `http://localhost:3000`.

---

## 🛠️ Amplify Sandbox

Use the Amplify Sandbox plugin to spin up an isolated backend & frontend environment for testing:

```bash
npx ampx sandbox
```

This single command will:

1. Create (or switch to) a `sandbox` environment in Amplify
2. Deploy all configured backend resources (Cognito, AppSync, DynamoDB, etc.)
3. Deploy the frontend to that sandbox

Once you’re done experimenting, you can tear down the sandbox with:

```bash
npx ampx sandbox delete
```

---

## 📦 Production Deployment

For full deployment and CI/CD setup, follow the Amplify docs:
[Deploy a fullstack app to AWS](https://docs.amplify.aws/react/start/quickstart/#deploy-a-fullstack-app-to-aws)

---

## 🔒 Security

Please review [CONTRIBUTING.md](CONTRIBUTING.md#security-issue-notifications) for reporting vulnerabilities and security best practices.

---

## 🤝 Contributing

1. Fork the repo
2. Create a branch (`git checkout -b feature/YourFeature`)
3. Commit (`git commit -m "feat: add feature"`)
4. Push (`git push origin feature/YourFeature`)
5. Open a PR

---

## 📜 License

Licensed under the MIT License. See [LICENSE](LICENSE).
