# Havenetværkets noter

Fælles noter fra havenetværket under Praktisk Økologi. Noterne skrives i [Obsidian](https://obsidian.md) og udgives automatisk som hjemmeside:

**https://smk-oekologi.github.io/noter/**

Hver gang der kommer en ændring i dette repositorium, bygges hjemmesiden på ny. Det tager et par minutter.

## Sådan bidrager du

Du skal have en gratis [GitHub-konto](https://github.com/signup) og være inviteret til organisationen SMK-oekologi. Skriv til Esbern for at få en invitation.

### Den hurtige måde: ret direkte på GitHub

1. Find noten her på GitHub, og klik på blyanten øverst til højre.
2. Ret teksten, og klik på **Commit changes**.

En ny note laver du med **Add file → Create new file** i den mappe, hvor den hører hjemme. Filnavnet skal ende på `.md`.

### Med Obsidian på din egen computer

1. Installer [GitHub Desktop](https://desktop.github.com) og [Obsidian](https://obsidian.md).
2. Hent noterne i GitHub Desktop: **File → Clone repository**, og vælg `SMK-oekologi/noter`.
3. Åbn mappen i Obsidian med **Åbn mappe som vault**.
4. Før du skriver, klikker du på **Fetch origin / Pull** i GitHub Desktop, så du har de andres seneste ændringer.
5. Når du er færdig, skriver du en kort beskrivelse i GitHub Desktop og klikker **Commit to main** og derefter **Push origin**.

## Sådan skriver vi noter

- Én note pr. emne. Filnavnet er notens navn, f.eks. `Hvidkløver.md`.
- Begynd noten med en overskrift: `# Hvidkløver`.
- Henvis til andre noter med dobbelte kantede parenteser: `[[Efterafgrøder]]`.
- Sæt gerne emneord øverst i noten:

  ```
  ---
  tags: [planter, bunddække]
  ---
  ```

- En note, der ikke er klar til at blive vist, får linjen `draft: true` mellem de to `---`.
- Billeder lægges i samme mappe som noten og indsættes med `![[billede.jpg]]`.

Alt her er offentligt. Skriv ikke adresser, telefonnumre eller andet privat.

## Teknik

- [quartz.config.yaml](quartz.config.yaml) styrer hjemmesidens titel, farver og opbygning. Se [Quartz' dokumentation](https://quartz.jzhao.xyz/configuration).
- [.github/workflows/deploy.yml](.github/workflows/deploy.yml) bygger siden med [Quartz 5](https://quartz.jzhao.xyz). Versionen står øverst i filen.
