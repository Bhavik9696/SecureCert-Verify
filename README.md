# CertiShield — AI & QR Code Certificate Fraud Verification Platform

**CertiShield** is an automated academic certificate verification and fraud detection system designed for university faculty and institutional evaluators. 

Unlike conventional tools that only flag identical duplicate image files, CertiShield performs **deep QR-code payload extraction, multi-portal API validation, and OCR/Vision text cross-checks** to detect sophisticated name-tampering, serial number forgery, and stolen QR code credentials (e.g. Photoshop name edits on legitimate certificates from Infosys Springboard, NPTEL, Coursera, Cisco, and Udemy).

---

## Key Features

- **Automated QR Code Extraction**: Uses matrix decoding (`jsQR` + `Jimp`) to scan embedded QR codes directly from uploaded certificate images and PDFs.
- **Deep Name & Serial Cross-Matching**: Compares the student name visibly printed on the uploaded document against the student name registered in the official issuer verification portal.
- **AI-Powered OCR & Fallback Analysis**: Integrates Tesseract OCR and Gemini 2.5 Vision AI to read document headers, student names, course titles, and serial numbers.
- **Duplicate & Tamper Detection**: Flags duplicate certificate IDs, duplicate file hashes, and QR payload mismatches across submitted student assignments.
- **4-Step Audit Trail**: Generates a detailed audit breakdown for every submission showing step-by-step verification statuses (QR Scan → Portal Query → Name Cross-Check → Serial Validation).
- **Lecturer Analytics Dashboard**: Instant overview of pass/fail/flagged ratios, assignment submission trends, platform distribution, and verification logs.

---

## Verification Pipeline & Architecture

### High-Level Architecture Diagram

```
  +-----------------------------------------------------------------------------------+
  |                                 USER INTERFACE                                    |
  |             React 18 + Vite + Tailwind CSS + Lucide Icons + Motion               |
  +-----------------------------------------+-----------------------------------------+
                                            |
                                 REST API (/api/certificates/upload)
                                            v
  +-----------------------------------------------------------------------------------+
  |                                EXPRESS BACKEND SERVER                             |
  |                               (Node.js / Express 4/5)                             |
  +-----------------------------------------+-----------------------------------------+
                                            |
                       +--------------------+--------------------+
                       |                                         |
                       v                                         v
        +-----------------------------+           +-----------------------------+
        |   QR CODE DECODER MATRIX    |           |    DOCUMENT OCR & AI VISION  |
        |      (jsQR + Jimp)          |           |   (Tesseract.js / Gemini)   |
        +--------------+--------------+           +--------------+--------------+
                       |                                         |
                       | Extracted QR URL / Payload              | Extracted Text Name
                       v                                         v
  +-----------------------------------------------------------------------------------+
  |                             CROSS-VERIFICATION ENGINE                             |
  |  - Fetches Official Record from Issuer API (NPTEL, Infosys, Coursera, Cisco, etc) |
  |  - Compares Document Name vs Portal Registered Name                               |
  |  - Compares Document Serial vs Portal Serial                                      |
  |  - Checks Duplicate Hashes & IDs in Persistent Database                           |
  +-----------------------------------------+-----------------------------------------+
                                            |
                                  Audit Status & Matrix
                                            v
  +-----------------------------------------------------------------------------------+
  |                           PERSISTENT JSON / FIRESTORE DB                          |
  |                             (Verification Logs & Audit)                           |
  +-----------------------------------------------------------------------------------+
```

---

## How Name & QR Cross-Verification Works

1. **Document Upload**: The student or lecturer uploads a certificate image (PNG/JPEG) or PDF.
2. **QR Matrix Scanning**: The server decodes the matrix inside the certificate image to extract the official verification link or embedded JSON credential payload.
3. **Official Portal Lookup**: The system queries the issuer endpoint (e.g. `https://verify.onwingspan.com` or `https://nptel.ac.in/noc/Ecertificate`) to fetch the **officially registered student name**.
4. **Document Name OCR**: Tesseract OCR / Gemini reads the student name visibly printed on the certificate face (e.g. `"Karan Sharma"`).
5. **Name Match Audit**:
   - **PASS**: Visually printed name matches official portal registered name (`"Bhavik Rai"` == `"Bhavik Rai"`). Status: **Verified**.
   - **FAIL / FAKE**: Visually printed name differs from official portal registered name (`"Karan Sharma"` != `"Suresh Patel"`). Status: **Fake / Flagged**.

---

## Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)
- **Charts**: Recharts

### Backend
- **Server**: Express.js (Node.js runtime)
- **Image Processing & QR**: `jsQR`, `Jimp`
- **OCR & Computer Vision**: `Tesseract.js`, `@google/genai` (Gemini 2.5 Flash)
- **Data Persistence**: Local File-based JSON Store (`/.data/certificates_db.json`) / Firestore ready

---

## Project Directory Structure

```
├── .data/
│   └── certificates_db.json         # Persistent JSON database store
├── server/
│   ├── store.ts                     # Database access layer and seed data
│   └── verification.ts              # Core QR code, OCR, and cross-matching engine
├── src/
│   ├── components/
│   │   ├── dashboard/               # Statistics cards & charts
│   │   ├── layout/                  # Navigation bar & layout frame
│   │   ├── upload/                  # Drag-and-drop file upload zone
│   │   └── verification/            # Verification table & audit detail modal
│   ├── context/
│   │   └── VerificationContext.tsx  # React state context & API synchronizer
│   ├── services/
│   │   └── api.ts                   # Robust REST API client layer
│   ├── types/
│   │   └── index.ts                 # Shared TypeScript interfaces & types
│   ├── App.tsx                      # Main React application component
│   └── main.tsx                     # React DOM entry point
├── server.ts                        # Express server entry point & API routes
├── package.json                     # Dependencies & npm scripts
└── README.md                        # Documentation
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/certishield.git
   cd certishield
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables** (Optional for AI fallback):
   Create a `.env` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   NODE_ENV=development
   PORT=3000
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

---

## Deploying to Netlify 🚀

This repository is pre-configured for seamless zero-config deployment on **Netlify** using Netlify Serverless Functions and `netlify.toml` URL rewrites.

### Method 1: Deploy via GitHub (Recommended)

1. Push your repository to **GitHub**.
2. Log in to [Netlify](https://app.netlify.com/) and click **"Add new site"** → **"Import an existing project"**.
3. Select your GitHub repository.
4. Netlify will automatically detect `netlify.toml` with the following pre-configured build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. *(Optional)* Add Environment Variables under **Site settings** → **Environment variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API key (optional, for AI OCR fallback).
   - `JWT_SECRET`: Custom secret key for authentication tokens.
6. Click **"Deploy site"**!

### Method 2: Deploy via Netlify CLI

1. Install the Netlify CLI globally:
   ```bash
   npm install -g netlify-cli
   ```
2. Build and deploy:
   ```bash
   netlify login
   netlify deploy --build
   ```
3. For production deployment:
   ```bash
   netlify deploy --build --prod
   ```

---

## API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/dashboard/stats` | Returns aggregate metrics (Total, Verified, Fake, Pending, Manual Review). |
| `GET` | `/api/certificates` | Retrieves filtered list of verification audit records. |
| `POST` | `/api/certificates/upload` | Uploads certificate file(s), decodes QR code, performs OCR name matching, and returns audit verdict. |
| `DELETE` | `/api/certificates/:id` | Removes a verification record from the database. |
| `GET` | `/api/assignments` | Fetches active assignment portals. |
| `POST` | `/api/assignments` | Creates a new assignment portal for student submissions. |

---

## License

Built and maintained by Bhavik Rai