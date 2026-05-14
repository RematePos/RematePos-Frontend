# HU-155 – Frontend encoding normalization (evidence)

## Error visual detectado
- Textos del menú mostraban caracteres corruptos (ej.: "Iniciar sesi├│n", "Categor├¡as", "Facturaci├│n").

## Causa probable
- Archivos con codificación incompatible (BOM o UTF-16) siendo interpretados como UTF-8 por la herramienta de build, provocando caracteres rotos.

## Archivos corregidos
- `src/app/routes/AppRouter.js` (normalizada a UTF-8 sin BOM, cadenas corregidas: "Iniciar sesión", "Facturación").
- No se detectaron otros archivos con BOM en `develop` que requirieran cambios.

## Textos corregidos
- Iniciar sesión
- Facturación

(Nota: `Categorías` no existía en `develop` y es parte del HU-151; no se tocó.)

## Validación visual
- Iniciar servidor de desarrollo y verificar navegación:
  - `/sales` → se carga la vista de ventas.
  - `/inventory` → se carga inventario.
  - `/inventory/new` → se carga formulario de producto.
  - `/billing`, `/billing/invoice-copy`, `/billing/returns` → páginas de facturación y retornos cargan.
- El menú ya muestra los textos acentuados correctamente: "Iniciar sesión", "Facturación".

## Confirmaciones
- No se modificó la lógica funcional de ventas (`/sales`) ni se añadieron/recuperaron componentes del POS.
- No se tocaron archivos backend, base de datos, `.env`, `node_modules` ni generados.

## Comandos ejecutados (resumen)
- `git fetch origin`
- `git checkout develop`
- `git pull origin develop`
- `git checkout -b feature/HU-155-AFAF-normalize-frontend-encoding`
- Modificación: `src/app/routes/AppRouter.js` (reescritura en UTF-8 sin BOM)
- `git add` + `git commit -m "fix(HU-155): normalize frontend encoding and nav labels"`
- `git add docs/evidence/HU-155_FRONTEND_ENCODING_FIX.md`
- `git commit -m "docs(HU-155): document frontend encoding validation"`
- `git push origin feature/HU-155-AFAF-normalize-frontend-encoding`

## Nota
- Recomendado: revisar CI/linter en pipeline para confirmar ausencia de `unicode-bom` warnings.
