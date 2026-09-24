INSTRUCOES - SUBIR DESDE CELULAR PARA GERAR .EXE DESKTOP

ARQUIVOS QUE VOCE VAI SUBIR NO GITHUB (todos desta pasta):
- package.json
- index.html
- vite.config.js
- src/main.jsx
- src/App.jsx
- src-tauri/tauri.conf.json
- src-tauri/main.rs  (JA COM VALIDACAO DE LICENCA 25 CHARS)
- src-tauri/Cargo.toml
- src-tauri/build.rs
- .github/workflows/build.yml

PASSO A PASSO NO CELULAR:
1. github.com > New repository > ia-sentinel-pro > Public > Create
2. Add file > Upload files > Selecione TODOS os arquivos acima (mantenha pastas)
3. Commit
4. Aba Actions > Veja Build rodando > Espera 10 min > Artifacts > Baixe IA-Sentinel-Portable-EXE
5. Esse EXE pede chave 25 chars XXXXX-XXXXX-XXXXX-XXXXX-XXXXX

SISTEMA DE LICENCAS:
- Gerador: GERADOR_LICENCAS_25_CHARS.html (abre no celular, gera chave)
- Validador: ja esta dentro do main.rs (validate_license_25)
- Formato: 5 blocos de 5 = 25 caracteres, sem I,O,0,1 para nao confundir
- Checksum: ultimos 5 chars sao derivados de HMAC secreto

SEGREDO: Troque SECRET em main.rs antes de vender: IA_COMPUTERS_2026_SECRET_KEY_CHANGE_THIS_BEFORE_SELLING
fix build 1 >
