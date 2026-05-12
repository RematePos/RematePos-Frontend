# HU-095 Frontend Safe Cleanup Plan

## Purpose

HU-095 prepares the RematePOS frontend repository for a safe cleanup before any structural reorganization.

This user story protects the repository from committing sensitive, generated, or heavy files. It does not change frontend behavior, routes, imports, components, services, or security logic.

## Detected Sensitive Or Generated Files

The active frontend working tree previously showed local or untracked generated files such as:

- `.env`
- `node_modules/`
- `build/`
- `build-output.log`
- Docker support files pending classification
- frontend source changes pending classification by HU

The clean HU-095 worktree also confirmed that `src/.env` was tracked in the current baseline. It must not remain versioned because environment files can contain deployment-specific values.

## Files That Must Not Be Committed

- `.env`
- `.env.*`
- `node_modules/`
- `build/`
- `dist/`
- `coverage/`
- `logs/`
- `*.log`
- `build-output.log`
- real credentials
- tokens
- passwords
- heavy generated files

Only `.env.example` should be versioned as the safe frontend environment template.

## Relation With Existing User Stories

HU-030: POS flow consuming backend/API Gateway. Existing functional changes must be separated from cleanup work.

HU-035: invoice copy and billing consumption from the frontend. Existing functional changes must be classified separately.

HU-073: future frontend visual/security hardening. Not implemented in HU-095.

HU-074: future session persistence and expiration. Not implemented in HU-095.

HU-078: future returns frontend hardening. Not implemented in HU-095.

## Pending Functional Change Classification

Do not commit functional frontend changes in HU-095.

Pending areas from the dirty local repository should be reviewed later and mapped to their correct HU before push:

- POS sales flow files.
- product/category/customer pages and services.
- billing and invoice copy views.
- Docker/frontend deployment files.
- static assets such as placeholder images.

## Pending For HU-094 Frontend

HU-094 frontend should run only after HU-095 is merged and the team decides how to handle existing functional changes.

Recommended before HU-094:

- Keep a clean worktree.
- Confirm the official repository path.
- Avoid moving `src/` until imports and route references are reviewed.
- Preserve feature work by HU before reorganizing folders.
- Keep generated files ignored.

## Validation Checklist

- `.gitignore` protects frontend generated files.
- `.env.example` contains only safe placeholder/default values.
- Real `.env` files are ignored.
- `node_modules/`, `build/`, `dist/`, `coverage/`, and logs are ignored.
- No source code behavior was changed.
- No imports were changed.
- No components or routes were reorganized.
