# HU-155 – Frontend font-rendering diagnosis and mitigation (evidence)

## Error visual detectado
- En algunos entornos el menú mostraba caracteres raros para vocales acentuadas (ej.: "Iniciar sesi|n", "Categor|as", "Facturaci|n").

## Diagnóstico posterior
- El DOM contiene los textos correctos (ej. `Iniciar sesión`).
- `public/index.html` indica `charset=utf-8`.
- No se encontraron `@font-face` ni fuentes externas incluidas por la app.
- La fuente global actual (definida en `src/index.css`) era: `Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
- El render incorrecto se reproduce solo en entornos donde la fuente local `Inter` está instalada y posiblemente corrupta o mal renderizada; en mi entorno local al forzar la pila de sistema los acentos se muestran correctamente.

## Acción aplicada (hotfix mínimo)
- Se actualizó `src/index.css` para usar una pila de fuentes de sistema como prioridad y evitar depender de una `Inter` local defectuosa:

```
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

## Archivos modificados
- `src/index.css` (cambio de `font-family` global)
- `docs/evidence/HU-155_FRONTEND_ENCODING_FIX.md` (este documento actualizado)

## Textos verificados
- Iniciar sesión (DOM correcto y rendering con pila de sistema)
- Facturación (rendering verificado)
- Categorías (no parte de este fix; si aparece en la rama correspondiente, se visualiza correctamente con la nueva pila)

## Validación visual
- Levantar dev server y verificar rutas:
  - `/sales`
  - `/inventory`
  - `/inventory/new`
  - `/billing`
  - `/billing/invoice-copy`
  - `/billing/returns`
- En mi validación `Iniciar sesión` renderiza con `font-family` de sistema en el navbar.

## Confirmaciones
- No se modificó lógica funcional ni componentes de `/sales`.
- No se tocaron backend, BD, `.env`, `node_modules` ni archivos generados.

## Comandos ejecutados (resumen)
- `git checkout -b feature/HU-155-AFAF-normalize-frontend-encoding` (desde `develop`)
- Edición: `src/index.css` para cambiar `font-family` global
- Edición: `docs/evidence/HU-155_FRONTEND_ENCODING_FIX.md` (actualización de diagnóstico)
- `git add` + `git commit -m "fix(HU-155): use system font stack for UI text rendering"`
- `git push origin feature/HU-155-AFAF-normalize-frontend-encoding` (no crear PR hasta validar)

## Recomendación
- Confirmar en la(s) máquina(s) donde se observó el fallo que la fuente local `Inter` está dañada o que alguna extensión del navegador reemplaza fuentes.
- Si el problema persiste incluso con la pila de sistema, adjuntar captura del panel DevTools → Computed → Rendered Fonts para investigar.

## Nota
- No crear PR hasta que se valide visualmente en los entornos problemáticos.
