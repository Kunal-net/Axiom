#!/usr/bin/env bash
# ==============================================================================
# Axiom — Unified Pre-Merge & Local Verification Script
# ==============================================================================
# This script runs the full verification pipeline before committing or merging:
# 1. Oxlint static code analysis (0 errors, 0 warnings policy)
# 2. Vitest unit and service regression tests
# 3. TypeScript compilation & Vite production build
# ==============================================================================

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "========================================================"
echo " [Axiom CI/CD] Starting Local Verification Pipeline"
echo " Working directory: $ROOT_DIR"
echo "========================================================"

echo ""
echo "--> 1. Running Oxlint (Static Analysis)..."
npm run lint

echo ""
echo "--> 2. Running Vitest (Unit & Service Tests)..."
npm test

echo ""
echo "--> 3. Running TypeScript & Vite Production Build..."
npm run build

if [ -f "backend/.venv/bin/pytest" ]; then
  echo ""
  echo "--> 4. Running Backend Test Suite (Pytest)..."
  PYTHONPATH=. ./backend/.venv/bin/pytest backend/tests -q
fi

echo ""
echo "========================================================"
echo " [Axiom CI/CD] All verification checks passed successfully!"
echo " Safe to commit and submit PR."
echo "========================================================"
