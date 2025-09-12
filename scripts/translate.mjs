#!/usr/bin/env node

import { readFile, writeFile, stat } from 'fs/promises'
import { join } from 'path'

/**
 * Script de traducción automática para i18n
 * Traduce en.json a es.json usando OpenAI o DeepL
 */

const DICTIONARIES_PATH = './src/app/_i18n/dictionaries'
const EN_FILE = join(DICTIONARIES_PATH, 'en.json')
const ES_FILE = join(DICTIONARIES_PATH, 'es.json')

// Rate limiting para evitar problemas con APIs
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Aplanar objeto JSON en claves dot-notation
 */
function flattenObject(obj, prefix = '') {
  const flattened = {}
  
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey))
    } else {
      flattened[newKey] = value
    }
  }
  
  return flattened
}

/**
 * Reconstruir objeto desde claves flat
 */
function unflattenObject(flattened) {
  const result = {}
  
  for (const [key, value] of Object.entries(flattened)) {
    const keys = key.split('.')
    let current = result
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
  }
  
  return result
}

/**
 * Traducir usando OpenAI
 */
async function translateWithOpenAI(texts) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY no encontrada')
  }

  const prompt = `Traduce los siguientes textos del inglés al español neutro (no específico de ningún país). 
Mantén el formato JSON exacto con las mismas claves. No añadas ni quites campos.
Solo traduce los VALORES, no las claves JSON.

Textos a traducir:
${JSON.stringify(texts, null, 2)}

Responde SOLO con el JSON traducido, sin explicaciones adicionales.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Eres un traductor profesional. Traduces del inglés al español neutro manteniendo el formato JSON exacto.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const translatedText = data.choices[0]?.message?.content?.trim()
    
    if (!translatedText) {
      throw new Error('Respuesta vacía de OpenAI')
    }

    // Intentar parsear JSON
    try {
      return JSON.parse(translatedText)
    } catch (parseError) {
      console.warn('JSON malformado de OpenAI, reintentando...')
      
      // Segundo intento con prompt de corrección
      const fixPrompt = `El siguiente texto debería ser JSON válido pero está malformado. Corrígelo y devuelve SOLO el JSON válido:

${translatedText}`

      const fixResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: fixPrompt
            }
          ],
          temperature: 0.1,
          max_tokens: 2000
        })
      })

      if (!fixResponse.ok) {
        throw new Error(`OpenAI API error en reintento: ${fixResponse.status}`)
      }

      const fixData = await fixResponse.json()
      const fixedText = fixData.choices[0]?.message?.content?.trim()
      
      return JSON.parse(fixedText)
    }
  } catch (error) {
    console.error('Error en traducción OpenAI:', error)
    throw error
  }
}

/**
 * Traducir usando DeepL
 */
async function translateWithDeepL(texts) {
  const DEEPL_API_KEY = process.env.DEEPL_API_KEY
  if (!DEEPL_API_KEY) {
    throw new Error('DEEPL_API_KEY no encontrada')
  }

  const translated = {}
  const entries = Object.entries(texts)
  
  // Procesar en lotes para evitar rate limits
  const batchSize = 10
  for (let i = 0; i < entries.length; i += batchSize) {
    const batch = entries.slice(i, i + batchSize)
    
    for (const [key, text] of batch) {
      if (typeof text !== 'string') {
        translated[key] = text
        continue
      }

      try {
        const response = await fetch('https://api-free.deepl.com/v2/translate', {
          method: 'POST',
          headers: {
            'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            text: text,
            source_lang: 'EN',
            target_lang: 'ES'
          })
        })

        if (!response.ok) {
          throw new Error(`DeepL API error: ${response.status}`)
        }

        const data = await response.json()
        translated[key] = data.translations[0]?.text || text
        
        // Rate limiting
        await delay(100)
      } catch (error) {
        console.warn(`Error traduciendo "${key}":`, error)
        translated[key] = text // Fallback al texto original
      }
    }
    
    if (i + batchSize < entries.length) {
      await delay(1000) // Pausa entre lotes
    }
  }

  return translated
}

/**
 * Función principal
 */
async function main() {
  try {
    console.log('🌍 Iniciando traducción automática...')

    // Leer archivo inglés
    const enContent = await readFile(EN_FILE, 'utf-8')
    const enData = JSON.parse(enContent)

    // Verificar si necesitamos traducir
    let shouldTranslate = true
    try {
      const esStat = await stat(ES_FILE)
      const enStat = await stat(EN_FILE)
      
      // Si el archivo español es más reciente que el inglés, tal vez no necesitamos traducir
      if (esStat.mtime > enStat.mtime) {
        const esContent = await readFile(ES_FILE, 'utf-8')
        const esData = JSON.parse(esContent)
        
        // Si el archivo español no está vacío y es reciente, preguntamos
        if (Object.keys(esData).length > 1) { // Más que solo "_comment"
          console.log('📄 Archivo español existente y reciente encontrado.')
          
          // En CI, siempre traducir. En local, podrías agregar lógica diferente
          if (process.env.CI) {
            console.log('🤖 Modo CI: forzando nueva traducción.')
          } else {
            console.log('🔄 Procediendo con nueva traducción...')
          }
        }
      }
    } catch {
      // El archivo español no existe, necesitamos traducir
      shouldTranslate = true
    }

    if (!shouldTranslate) {
      console.log('✅ No se requiere traducción.')
      return
    }

    // Aplanar el objeto para traducir
    const flatEnData = flattenObject(enData)
    
    let translatedFlat
    
    // Intentar OpenAI primero
    if (process.env.OPENAI_API_KEY) {
      console.log('🤖 Usando OpenAI para traducción...')
      try {
        // Procesar en lotes más pequeños
        const entries = Object.entries(flatEnData)
        const batchSize = 20
        const translatedParts = {}
        
        for (let i = 0; i < entries.length; i += batchSize) {
          const batch = entries.slice(i, i + batchSize)
          const batchObj = Object.fromEntries(batch)
          
          console.log(`📦 Procesando lote ${Math.floor(i/batchSize) + 1}/${Math.ceil(entries.length/batchSize)}...`)
          
          const translated = await translateWithOpenAI(batchObj)
          Object.assign(translatedParts, translated)
          
          // Rate limiting entre lotes
          if (i + batchSize < entries.length) {
            await delay(1000)
          }
        }
        
        translatedFlat = translatedParts
      } catch (error) {
        console.warn('⚠️ OpenAI falló:', error.message)
        translatedFlat = null
      }
    }
    
    // Fallback a DeepL si OpenAI falla
    if (!translatedFlat && process.env.DEEPL_API_KEY) {
      console.log('🔄 Intentando con DeepL...')
      try {
        translatedFlat = await translateWithDeepL(flatEnData)
      } catch (error) {
        console.warn('⚠️ DeepL falló:', error.message)
        translatedFlat = null
      }
    }
    
    if (!translatedFlat) {
      throw new Error('No se pudo traducir con ninguno de los servicios disponibles')
    }

    // Reconstruir objeto jerárquico
    const translatedData = unflattenObject(translatedFlat)
    
    // Añadir comentario de generación
    const finalData = {
      _comment: 'GENERATED – do not edit',
      ...translatedData
    }

    // Escribir archivo traducido
    await writeFile(ES_FILE, JSON.stringify(finalData, null, 2), 'utf-8')
    
    console.log('✅ Traducción completada exitosamente.')
    console.log(`📝 Traducidas ${Object.keys(translatedFlat).length} claves.`)
    console.log(`💾 Archivo guardado: ${ES_FILE}`)
    
  } catch (error) {
    console.error('❌ Error en traducción:', error)
    process.exit(1)
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
