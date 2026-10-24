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

## Record Verified Commands
After inspection and execution, replace examples with exact commands that work in this repository. Mark any unverified commands as examples.
