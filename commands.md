```bash
devbox init
git init
git add devbox.json && git commit -m "Devbox init"
devbox generate direnv
git add .envrc && git commit -m "Add .envrc"
devbox add nodejs
git add .gitignore && git commit -m "ignore helper file"
```

Added:
```json
"env": {
    "DEVBOX_COREPACK_ENABLED": "true",
    "COREPACK_ROOT": "./.corepack",
  }
```
to devbox.json

Created package.json with content:
```json
{
  "packageManager": "pnpm@10.0.0"
}
```

made corepack dir
```bash
mkdir .corepack && echo ".corepack" >> .gitignore
```

re-entered devbox shell (exit is leaving shell)
```bash
exit
devbox shell
```

Enable corepack
```bash
corepack enable pnpm --install-directory ./.corepack
```

```bash
pnpm create astro@latest -- --template markhorn-dev/astro-nano
```
put the astro under ./src

To serve the site:
```bash
cd src
pnpm dev
```

# We wuz here
```
