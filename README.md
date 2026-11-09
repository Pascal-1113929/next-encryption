# Next Encryption
Web application for symmetrical encryption and decryption with an automated key generation. Fully client side.

Build with Next.js, TypeScript, shadcn/ui and `crypto-js`.

---
## Content
- [Features](#features)
- [Getting Started](#getting-started)
- [How It Works](#how-it-works)
- [Encryption & Decryption](#encryption--decryption)
- [Export File Format](#export-file-format)
- [Tech Stack](#tech-stack)
- [Kerckhoffs's Principle](#kerckhoffs-principle)
- [Key Management](#key-management)

---
## Features
| Feature | Description |
|---------|-------------|
| **Random key generation** | 256-bit key via `crypto.getRandomValues()` |
| **Per-message IV** | A fresh 128-bit IV is generated for every encryption call |
| **Clipboard copy** | Copy key, IV, ciphertext, or decrypted text |
| **File export** | Download the full encrypted payload as a `.txt` file |
| **File import** | Drag-and-drop or browse for a `.txt` file to auto-fill all decrypt fields |

---
## Getting Started

The Github repository is at [https://github.com/Pascal-1113929/next-encryption](https://github.com/Pascal-1113929/next-encryption)

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18
- [pnpm](https://pnpm.io) ≥ 8 (`npm i -g pnpm` if missing)

### Install & Run

#### Clone Repo
```bash
git clone https://github.com/Pascal-1113929/next-encryption.git
cd next-encryption

```

#### Install dependencies
```bash
pnpm install
```

#### Start Server
```bash
pnpm dev
```

Open the server on http://localhost:3000.

---
## How it works
The application works by genreating a random key via `crypto.getRandomValues()`. Using that and a generated IV, it turns plaintext into a ciphertext (using AES-256-CBC). 
This is both copy-able for clipboard and downloadable as a `.txt` file with the IV and the Key for easy sharing. 

---
## Encryption & Decryption
The application implements symmetric encryption using the **AES-256-CBC** algorithm with **PKCS#7** padding via the well-tested `crypto-js` library. The entire encryption/decryption pipeline runs in the browser.

### Encryption
1. **Key & IV:** A random 256-bit key is automatically generated using the browser's cryptographically secure pseudo-random number generator (`crypto.getRandomValues()`). For every encryption call, a fresh 128-bit Initialization Vector (IV) is generated.
2. **Process:** The plaintext message is padded using **PKCS#7** and encrypted with the AES-256 algorithm in **Cipher Block Chaining (CBC)** mode.
3. **Output:** The resulting ciphertext is formatted into a base64 string and bundled with the key and IV for file export.

### Decryption
1. **Input:** The user provides the encrypted payload by either uploading/dropping the exported `.txt` file or pasting the content directly.
2. **Parsing:** The application reads the structured text to safely extract the specific `key`, `iv`, and `ciphertext`.
3. **Process:** Using the extracted key and IV, `crypto-js` reverses the CBC transformation and strips the PKCS#7 padding.
4. **Output:** The original plaintext message is successfully restored and displayed to the user.

---
## Export File Format
Every encrypted message can be exported as a plain-text file:

```txt
# Encryptie Export
key: 73f37ad705e53ec14ca059dbf46b5322ab076ae60cb9a652922e65b484f723db
iv: b128586e50ff5a1c1600f93b25d997e9
ciphertext: 9lZebLLGbfhFc8kKpcvsJXwcrzXQA01gw0W3eRcz8M57xvWJ...
algorithm: AES-256-CBC
created: 2026-11-02T13:13:20.286Z
```

---
## Tech Stack
| Layer | Technology |
|---------|-------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **UI** | React 19 + shadcn/ui |
| **Crypto** | crypto-js |
| **Toasts** | sonner |

---
## Kerckhoffs's Principle
This principle states: `a cryptosystem should be secure even if everything
about the system, except the key, is public.`

This application does not hide the algorithm or its implementation. This matches Kerckhoffs's Principle because the security comes from the key being unknown, not from the system being obscure.
Only the key is random and not visible unless the exported file is available.

The only limitation is that the key is stored in the same `.txt` file as the ciphertext. So if the file is public, the key is also public.

---
## Key Management
### Key generation
The key is generated via `crypto.getRandomValues(new Uint8Array(32))`.
That is the browser's CSPRNG, backed by the OS entropy pool
(`/dev/urandom`, `BCryptGenRandom`). This key is truly random generated, either via a reload button on the page or at page reload.

### Storage
The key is only stored in the exported `.txt` file. Not anywhere else without the user's knowledge. 

### Exchange
The key is shared either directly via the user or via the downloadable `.txt` file. 

### Scaling
With symmetric encryption, every pair of users who want to share messages needs the same key. 
This means that the key needs to be shared with every user who wants to communicate. 

This application sidesteps the problem by making each message self-contained: the key travels with the ciphertext in the exported file.
 