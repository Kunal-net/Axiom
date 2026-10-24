# Development Setup

## First: Inspect the Actual Stack
Before running commands, inspect `package.json`, lockfiles, backend manifests, README files, and available runtime versions. Use the package manager already selected by the repository.

## Frontend (if Node.js frontend exists)
1. Install the supported Node.js version.
2. Install dependencies with the repository's package manager.
3. Copy `.env.example` to `.env` only when local values are needed.
4. Set the actual public API base URL if the frontend uses one.
5. Run the existing development script (for example, `npm run dev` for a configured Vite app).
6. Verify the browser console and terminal output.

Do not add scripts or dependencies blindly. Confirm they exist in the manifest.

## Python Backend (only if present)
On macOS/Linux, from the backend/project directory:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
```

Install dependencies using the project's actual dependency definition. For example, only if `requirements.txt` exists:

```bash
python -m pip install -r requirements.txt
```

Verify the active interpreter with:

```bash
which python
python --version
```

The interpreter path should point into `.venv`. Use the project's actual backend startup command, discovered from its documentation and configuration.

Windows PowerShell activation, if applicable:

```powershell
.venv\Scripts\Activate.ps1
```

Do not create a Python virtual environment for a frontend-only project.

## Environment Variables
- Copy `.env.example` to `.env` only when required.
- Fill in only values supported by the actual application.
- Never commit `.env`.
- Never expose server secrets in browser-exposed variables.
- Do not fabricate credentials or assume a database is available.

## Database
If the backend requires a database, follow its existing migration and setup documentation. Do not run destructive migrations or assume local database credentials.

## Combined Startup
If frontend and backend both exist, document and run their commands separately unless the repository already has a supported orchestration script.

## Verified Repository Commands

### Frontend Development & Build
```bash
# Start Vite development server (default port 5173)
npm run dev

# Run Oxlint static analysis (0 warnings, 0 errors)
npm run lint

# Run Vitest test suite (8 tests covering env config and contract services)
npm test

# Build production bundle with TypeScript checking
npm run build

# Preview production build locally (default port 4173)
npm run preview
```

### Environment Variables
- Local configuration is loaded from `.env` (derived from `.env.example`).
- `VITE_APP_ENV`: `development`
- `VITE_API_BASE_URL`: `http://localhost:8000` (target backend URL)
- `VITE_USE_MOCK_DATA`: `true` (enables in-memory contract service simulation)

### Verified Routes
- Public Landing: `http://localhost:5173/#/landing`
- Dashboard: `http://localhost:5173/#/dashboard`
- Analyze Contract: `http://localhost:5173/#/analyze`
- Analysis Results: `http://localhost:5173/#/results`
- Report Page: `http://localhost:5173/#/report`
- Document Compare: `http://localhost:5173/#/compare`
- Document History: `http://localhost:5173/#/history`
- Settings: `http://localhost:5173/#/settings`
