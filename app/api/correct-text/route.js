import { NextResponse } from 'next/server'

// Common typos and corrections for Italian
const corrections = {
  'emdico': 'medico',
  'medcio': 'medico',
  'mdico': 'medico',
  'emdicale': 'medicale',
  'pazzo': 'pazzo',
  'pazo': 'pazzo',
  'pazoz': 'pazzo',
  'soluzoine': 'soluzione',
  'soluzone': 'soluzione',
  'solzuione': 'soluzione',
  'soluizone': 'soluzione',
  'prende': 'prende',
  'pernde': 'prende',
  'predne': 'prende',
  'bodybulider': 'bodybuilder',
  'bodybiulder': 'bodybuilder',
  'bodybuidler': 'bodybuilder',
  'groso': 'grosso',
  'gross': 'grosso',
  'gorso': 'grosso',
  'urla': 'urla',
  'ural': 'urla',
  'ulra': 'urla',
  'linki': 'link',
  'lniki': 'link',
  'likn': 'link',
  'sotto': 'sotto',
  'soto': 'sotto',
  'stto': 'sotto',
  'acocunt': 'account',
  'dahsboard': 'dashboard',
  'cioe': 'cioè',
  'eprche': 'perché',
  'perche': 'perché',
  'pero': 'però',
  'puo': 'può',
  'gia': 'già',
  'piu': 'più',
  'e': 'è', // quando appropriato
  'cmq': 'comunque',
  'nn': 'non',
  'xche': 'perché',
  'xke': 'perché',
  'x': 'per',
  'cn': 'con',
  'qlcs': 'qualcosa',
  'qlcn': 'qualcuno',
  'bototne': 'bottone',
  'perr': 'per',
  'modificar': 'modificare',
  'elimamgine': "dell'immagine",
  'lai': "l'AI",
  'caòpire': 'capire',
  'junerrore': "un errore",
  'fixare': 'correggere',
  'defve': 'deve'
}

function correctText(text) {
  let corrected = text

  // Split into words and correct each
  const words = text.split(/\s+/)
  const correctedWords = words.map(word => {
    // Keep punctuation
    const punctuation = word.match(/[.,!?;:]$/)?.[0] || ''
    const cleanWord = word.replace(/[.,!?;:]$/, '').toLowerCase()

    // Check for correction
    if (corrections[cleanWord]) {
      // Preserve capitalization
      let correctedWord = corrections[cleanWord]
      if (word[0] === word[0].toUpperCase()) {
        correctedWord = correctedWord.charAt(0).toUpperCase() + correctedWord.slice(1)
      }
      if (word === word.toUpperCase()) {
        correctedWord = correctedWord.toUpperCase()
      }
      return correctedWord + punctuation
    }

    return word
  })

  corrected = correctedWords.join(' ')

  // Fix common phrases
  corrected = corrected
    .replace(/\bil\s+emdico\b/gi, 'il medico')
    .replace(/\bil\s+medcio\b/gi, 'il medico')
    .replace(/\be\s+la\s+soluzione\b/gi, 'è la soluzione')
    .replace(/\bti\s+prende\s+per\s+pazzo\b/gi, 'ti prende per pazzo')
    .replace(/\bsdf\s+e\s+la\b/gi, 'SDF è la')
    .replace(/\bper\s+pazzo\?\s+sdf\b/gi, 'per pazzo? SDF')

  // Fix apostrophes and accents
  corrected = corrected
    .replace(/\bl\s*'\s*ai\b/gi, "l'AI")
    .replace(/\bdell\s*'\s*immagine\b/gi, "dell'immagine")
    .replace(/\bun\s*'\s*immagine\b/gi, "un'immagine")
    .replace(/\bc\s*'\s*e\b/gi, "c'è")
    .replace(/\be\s+(\w)/gi, (match, p1) => {
      // Check if 'e' should be 'è'
      const nextWord = p1.toLowerCase()
      if (['la', 'il', 'un', 'una', 'questo', 'quello', 'molto', 'stato', 'stata'].includes(nextWord)) {
        return 'è ' + p1
      }
      return match
    })

  return corrected
}

export async function POST(request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return NextResponse.json({ correctedText: '' })
    }

    const correctedText = correctText(text)

    // Log corrections for debugging
    if (text !== correctedText) {
      console.log('Text correction:', {
        original: text,
        corrected: correctedText
      })
    }

    return NextResponse.json({
      correctedText,
      hadErrors: text !== correctedText
    })
  } catch (error) {
    console.error('Text correction error:', error)
    return NextResponse.json({
      correctedText: text,
      hadErrors: false
    })
  }
}