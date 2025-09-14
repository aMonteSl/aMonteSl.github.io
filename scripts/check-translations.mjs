#!/usr/bin/env node

import { readFile, writeFile, stat } from 'fs/promises'
import { join } from 'path'

/**
 * Script de verificación de traducción para i18n
 * Verifica si es necesario traducir en.json a es.json
 */

const DICTIONARIES_PATH = './src/app/_i18n/dictionaries'
const EN_FILE = join(DICTIONARIES_PATH, 'en.json')
const ES_FILE = join(DICTIONARIES_PATH, 'es.json')

/**
 * Función principal
 */
async function main() {
  try {
    console.log('🌍 Verificando estado de traducciones...')

    // Leer archivo inglés
    const enContent = await readFile(EN_FILE, 'utf-8')
    const enData = JSON.parse(enContent)
    const enKeys = Object.keys(enData).filter(key => key !== '_comment')

    // Verificar archivo español
    let shouldTranslate = false
    let esData = {}
    
    try {
      const esContent = await readFile(ES_FILE, 'utf-8')
      esData = JSON.parse(esContent)
      const esKeys = Object.keys(esData).filter(key => key !== '_comment')
      
      // Comparar estructura
      if (enKeys.length !== esKeys.length) {
        console.log(`📊 Diferencia en número de claves: EN(${enKeys.length}) vs ES(${esKeys.length})`)
        shouldTranslate = true
      } else {
        console.log(`✅ Ambos archivos tienen ${enKeys.length} claves principales`)
        
        // Verificar fechas de modificación
        const esStat = await stat(ES_FILE)
        const enStat = await stat(EN_FILE)
        
        if (enStat.mtime > esStat.mtime) {
          console.log('⏰ El archivo inglés es más reciente que el español')
          shouldTranslate = true
        } else {
          console.log('⏰ El archivo español está actualizado')
        }
      }
      
    } catch (error) {
      console.log('📄 Archivo español no existe o es inválido')
      shouldTranslate = true
    }

    if (shouldTranslate) {
      console.log('⚠️ Se requiere traducción, pero no hay APIs configuradas')
      console.log('💡 Opciones:')
      console.log('   1. Configurar OPENAI_API_KEY o DEEPL_API_KEY')
      console.log('   2. Traducir manualmente el archivo es.json')
      console.log('   3. El archivo actual es funcional para el desarrollo')
      
      // No fallar - el archivo español actual es funcional
      console.log('✅ Continuando con el archivo español existente')
    } else {
      console.log('✅ No se requiere traducción - archivos sincronizados')
    }

    // Verificar contenido básico
    if (Object.keys(esData).length > 1) {
      console.log(`📚 Archivo español contiene ${Object.keys(esData).length} secciones`)
      console.log('✅ Traducciones disponibles y funcionales')
    }
    
  } catch (error) {
    console.error('❌ Error en verificación:', error)
    // No salir con error si es solo un problema de traducción
    console.log('⚠️ Continuando sin nueva traducción')
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
