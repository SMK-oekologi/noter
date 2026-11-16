// Dansk oversættelse af Quartz' menuer og knapper.
//
// Quartz 5 har ingen dansk oversættelse. Dette script lægger én ind, før
// siden bygges (se .github/workflows/deploy.yml), både i Quartz selv og i
// de plugins, der har egne tekster. Ret teksterne herunder for at ændre dem.
//
// Brug: node dansk.mjs <sti til quartz-mappen>

import fs from "node:fs"
import path from "node:path"

const dansk = {
  propertyDefaults: {
    title: "Uden titel",
    description: "Ingen beskrivelse",
  },
  components: {
    callout: {
      note: "Note",
      abstract: "Resumé",
      info: "Info",
      todo: "Huskeliste",
      tip: "Tip",
      success: "Gennemført",
      question: "Spørgsmål",
      warning: "Advarsel",
      failure: "Fejl",
      danger: "Fare",
      bug: "Fejl",
      example: "Eksempel",
      quote: "Citat",
    },
    backlinks: {
      title: "Henvisninger hertil",
      noBacklinksFound: "Ingen sider henviser hertil",
    },
    themeToggle: {
      lightMode: "Lyst tema",
      darkMode: "Mørkt tema",
    },
    readerMode: {
      title: "Læsetilstand",
    },
    explorer: {
      title: "Indhold",
    },
    footer: {
      createdWith: "Lavet med",
    },
    graph: {
      title: "Netværk af noter",
    },
    recentNotes: {
      title: "Seneste noter",
      seeRemainingMore: ({ remaining }) => `Se ${remaining} mere →`,
    },
    transcludes: {
      transcludeOf: ({ targetSlug }) => `Indlejret fra ${targetSlug}`,
      linkToOriginal: "Link til originalen",
    },
    search: {
      title: "Søg",
      searchBarPlaceholder: "Søg i noterne",
      noResults: "Ingen resultater.",
      noResultsHint: "Prøv et andet søgeord.",
      tagFilterHint: "Filtrér efter emneord",
      noTagsFound: "Ingen emneord passer",
    },
    tableOfContents: {
      title: "Indhold på siden",
    },
    contentMeta: {
      readingTime: ({ minutes }) => `${minutes} min. læsning`,
    },
    noteProperties: {
      title: "Egenskaber",
    },
  },
  pages: {
    rss: {
      recentNotes: "Seneste noter",
      lastFewNotes: ({ count }) => `De seneste ${count} noter`,
    },
    error: {
      title: "Ikke fundet",
      notFound: "Siden findes ikke, eller den er ikke offentlig.",
      home: "Tilbage til forsiden",
    },
    folderContent: {
      folder: "Mappe",
      itemsUnderFolder: ({ count }) =>
        count === 1 ? "1 side i denne mappe." : `${count} sider i denne mappe.`,
    },
    tagContent: {
      tag: "Emneord",
      tagIndex: "Alle emneord",
      itemsUnderTag: ({ count }) =>
        count === 1 ? "1 side med dette emneord." : `${count} sider med dette emneord.`,
      showingFirst: ({ count }) => `Viser de første ${count} emneord.`,
      totalTags: ({ count }) => `${count} emneord i alt.`,
    },
  },
}

// Skriver objektet som JavaScript-kode (JSON kan ikke rumme funktioner).
function tilKode(v, indryk = "") {
  if (typeof v === "function") return v.toString()
  if (typeof v === "string") return JSON.stringify(v)
  const ind = indryk + "  "
  const linjer = Object.entries(v).map(([k, x]) => `${ind}${JSON.stringify(k)}: ${tilKode(x, ind)},`)
  return `{\n${linjer.join("\n")}\n${indryk}}`
}

const quartz = process.argv[2]
if (!quartz) throw new Error("Angiv stien til quartz-mappen")
const kode = tilKode(dansk)

// 1. Quartz selv: ny sprogfil og registrering af da-DK.
const i18nMappe = path.join(quartz, "quartz/i18n")
fs.writeFileSync(
  path.join(i18nMappe, "locales/da-DK.ts"),
  `import { Translation } from "./definition"\n\nexport default ${kode} as const satisfies Translation\n`,
)
const indexFil = path.join(i18nMappe, "index.ts")
let index = fs.readFileSync(indexFil, "utf8")
const importLinje = 'import no from "./locales/nb-NO"'
const mapLinje = '"nb-NO": no,'
if (!index.includes(importLinje) || !index.includes(mapLinje)) {
  throw new Error("Quartz' i18n/index.ts ser anderledes ud end ventet. Tjek dansk.mjs efter opgradering.")
}
if (!index.includes("locales/da-DK")) {
  index = index
    .replace(importLinje, `${importLinje}\nimport da from "./locales/da-DK"`)
    .replace(mapLinje, `${mapLinje}\n  "da-DK": da,`)
  fs.writeFileSync(indexFil, index)
}
console.log("Dansk lagt ind i Quartz")

// 2. Plugins: hver har sin egen liste over sprog. Dansk sættes ind ved siden af engelsk,
//    som alle plugins har. Enkelte tekster står direkte i koden og erstattes én for én.
const pluginMappe = path.join(quartz, "node_modules/@quartz-community")
const markør = '"en-US": en_US_default'
const faste = [
  ['jsx("title", { children: "Search" })', 'jsx("title", { children: "Søg" })'],
  ['"aria-label": "Global Graph"', '"aria-label": "Vis hele netværket"'],
  ['textContent="No results."', 'textContent="Ingen resultater."'],
  ['textContent="Try another search term?"', 'textContent="Prøv et andet søgeord."'],
]
let antal = 0
for (const plugin of fs.readdirSync(pluginMappe)) {
  for (const fil of ["dist/index.js", "dist/components/index.js"]) {
    const sti = path.join(pluginMappe, plugin, fil)
    if (!fs.existsSync(sti)) continue
    let js = fs.readFileSync(sti, "utf8")
    if (!js.includes(markør) || js.includes("__dansk__")) continue
    js = `const __dansk__ = ${kode};\n` + js.replace(markør, `"da-DK": __dansk__,\n  ${markør}`)
    for (const [fra, til] of faste) js = js.replaceAll(fra, til)
    fs.writeFileSync(sti, js)
    antal++
  }
}
console.log(`Dansk lagt ind i ${antal} plugin-filer`)
