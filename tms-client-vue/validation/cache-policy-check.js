// Validación de políticas de caché en TMS Frontend
// Copiar y ejecutar en la consola de DevTools del navegador en producción

const validateCachePolicy = async () => {
  console.log('🔍 Validando política de caché...\n');

  const results = {
    passed: [],
    failed: []
  };

  try {
    // 1. Verificar index.html
    console.log('1️⃣  Verificando index.html...');
    const indexResponse = await fetch(window.location.href, {
      method: 'HEAD',
      cache: 'no-store'
    });
    const indexCache = indexResponse.headers.get('cache-control');
    if (indexCache && indexCache.includes('no-cache')) {
      console.log('✅ index.html: NO-CACHE (correcto)');
      results.passed.push('index.html: ' + indexCache);
    } else {
      console.warn('❌ index.html: Cache incorrecto -', indexCache);
      results.failed.push('index.html: ' + (indexCache || 'sin header'));
    }

    // 2. Verificar version.json
    console.log('\n2️⃣  Verificando version.json...');
    const versionResponse = await fetch('/version.json', {
      cache: 'no-store'
    });
    const versionCache = versionResponse.headers.get('cache-control');
    if (versionCache && versionCache.includes('no-cache')) {
      console.log('✅ version.json: NO-CACHE (correcto)');
      results.passed.push('version.json: ' + versionCache);
      const versionData = await versionResponse.json();
      console.log('   Versión actual:', versionData.version);
      console.log('   Timestamp:', versionData.timestamp);
    } else {
      console.warn('❌ version.json: Cache incorrecto -', versionCache);
      results.failed.push('version.json: ' + (versionCache || 'sin header'));
    }

    // 3. Verificar assets (_nuxt/)
    console.log('\n3️⃣  Verificando assets versionados...');
    const scripts = document.querySelectorAll('script[src*="_nuxt"]');
    if (scripts.length > 0) {
      const firstScript = scripts[0].src;
      console.log('   Checking:', firstScript);

      const assetResponse = await fetch(firstScript, {
        method: 'HEAD',
        cache: 'no-store'
      });
      const assetCache = assetResponse.headers.get('cache-control');

      if (assetCache && assetCache.includes('immutable')) {
        console.log('✅ Assets: IMMUTABLE (correcto)');
        results.passed.push('Assets: ' + assetCache);
      } else {
        console.warn('❌ Assets: Cache incorrecto -', assetCache);
        results.failed.push('Assets: ' + (assetCache || 'sin header'));
      }
    }

    // 4. Verificar que assets tengan hash
    console.log('\n4️⃣  Verificando hash en assets...');
    const hashedAssets = Array.from(scripts).filter(s => s.src.includes('-') && s.src.includes('.'));
    if (hashedAssets.length > 0) {
      console.log('✅ Assets con hash:', hashedAssets.length);
      results.passed.push('Assets con hash: ' + hashedAssets.length);
    } else {
      console.warn('⚠️  No se encontraron assets con hash');
      results.failed.push('Assets sin hash detectados');
    }

  } catch (error) {
    console.error('❌ Error durante validación:', error);
    results.failed.push('Error: ' + error.message);
  }

  // Resumen
  console.log('\n═══════════════════════════════════════════');
  console.log('RESUMEN DE VALIDACIÓN');
  console.log('═══════════════════════════════════════════');
  console.log(`✅ Pasaron: ${results.passed.length}`);
  console.log(`❌ Fallaron: ${results.failed.length}`);

  if (results.failed.length === 0) {
    console.log('\n🎉 ¡Todas las políticas de caché están correctamente configuradas!');
  } else {
    console.log('\n⚠️  Problemas detectados:');
    results.failed.forEach(f => console.log('  - ' + f));
  }

  return results;
};

// Ejecutar
validateCachePolicy();

