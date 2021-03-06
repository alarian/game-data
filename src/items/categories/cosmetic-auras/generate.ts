import * as path from 'path'
import * as fs from 'fs'
import fetch from 'node-fetch'
import escapeRegex from 'escape-regex-string'
import { escapeQuotes } from '../../../_helpers/generate'

interface AuraItemName {
  auraKey: string
  match: RegExp
}

export const AURA_ITEM_NAMES: Array<AuraItemName> = [
  { auraKey: 'kodasWarmthEnrichment', match: /^Koda's Warmth Enrichment$/ },
  { auraKey: 'chakEggSacks', match: /^(Chak Egg Sac|Chak Infusion)$/ },
  { auraKey: 'liquidAurillium', match: /^(Vial of Liquid Aurillium|Liquid Aurillium Infusion)$/ },
  { auraKey: 'preservedQueenBees', match: /^(Preserved Queen Bee|Queen Bee Infusion)$/ },
  { auraKey: 'ghostlyInfusions', match: /^Ghostly Infusion$/ },
  { auraKey: 'emberInfusions', match: /^Ember Infusion$/ },
  { auraKey: 'phospholuminescentInfusions', match: /^Phospholuminescent Infusion$/ },
  { auraKey: 'polysaturatingInfusions', match: /^Polysaturating Reverberating Infusion .*$/ },
  { auraKey: 'luminescentRefractors', match: /^Polyluminescent Undulating .*$/ },
  { auraKey: 'celestialInfusion', match: /^Celestial Infusion .*$/ },
  { auraKey: 'wintersHeartInfusions', match: /^Winter's Heart Infusion$/ },
  { auraKey: 'snowDiamondInfusions', match: /^Snow Diamond Infusion$/ },
  { auraKey: 'toyShellInfusions', match: /^Toy-Shell Infusion$/ },
  { auraKey: 'baubleInfusions', match: /^Moto's Unstable Bauble Infusion: .*$/ },
  { auraKey: 'festiveConfettiInfusions', match: /^Festive Confetti Infusion$/ },
  { auraKey: 'crystalInfusions', match: /^Crystal Infusion of .*$/ },
  { auraKey: 'mysticInfusions', match: /^Mystic Infusion$/ },
  { auraKey: 'peerlessInfusions', match: /^Peerless Infusion$/ },
  { auraKey: 'heartOfTheKhanUr', match: /^Heart of the Khan-Ur$/ },
]

interface UApiItem {
  id: number
  name: string
}

const FILE_PATH = path.join(__dirname, './data.ts')
const START_MARKER = `// -- GENERATE-START --`
const END_MARKER = `// -- GENERATE-END --`
const REPLACE_REGEX = new RegExp(`${escapeRegex(START_MARKER)}(.*)${escapeRegex(END_MARKER)}`, 's')

async function run() {
  const file = fs.readFileSync(FILE_PATH, 'utf-8')

  const response = await fetch('https://api.gw2efficiency.com/items?lang=en&ids=all')
  const items: Array<UApiItem> = await response.json()

  let generatedItems = ''

  AURA_ITEM_NAMES.forEach((aura, auraIndex) => {
    const matchingItems = items.filter((item) => item.name.match(aura.match))

    if (matchingItems.length === 0) {
      console.error(`Could not find any items for '${aura.auraKey}'`)
      process.exit(1)
    }

    matchingItems.sort((a, b) => a.id - b.id)

    matchingItems.forEach((item, itemIndex) => {
      const itemLine = [
        `  { `,
        `aura_key: '${aura.auraKey}', `,
        `id: ${item.id}, `,
        `name: '${escapeQuotes(item.name)}'`,
        ` }`,
      ]

      generatedItems += itemLine.join('') + ','
      if (auraIndex !== AURA_ITEM_NAMES.length - 1 || itemIndex !== matchingItems.length - 1) {
        generatedItems += '\n'
      }
    })

    if (auraIndex !== AURA_ITEM_NAMES.length - 1) generatedItems += '\n'
  })

  const content = file.replace(REPLACE_REGEX, `${START_MARKER}\n${generatedItems}\n  ${END_MARKER}`)
  fs.writeFileSync(FILE_PATH, content, 'utf-8')
}

run()
