const fs = require('fs');
const path = require('path');
const converter = require('openapi-to-postmanv2');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

(async () => {
  try {
    const docsDir = path.join(process.cwd(), 'docs');
    const openapiPath = path.join(docsDir, 'openapi.json');
    if (!fs.existsSync(openapiPath)) {
      console.error('[postman:gen] No se encontró docs/openapi.json. Ejecuta primero: npm run openapi:gen');
      process.exit(1);
    }

    const spec = fs.readFileSync(openapiPath, 'utf8');

    await new Promise((resolve, reject) => {
      converter.convert({
        type: 'json',
        data: spec,
      }, {
        folderStrategy: 'Tags',
        includeAuthInfoInExample: true,
        enableOptionalParameters: true,
        optimizeConversion: true,
        requestParametersResolution: 'Example',
        exampleParametersResolution: 'Example',
        keepImplicitHeaders: true,
        showMissingInSchemaErrors: false,
        retainDeprecated: true,
        // target collection format
        schemaFaker: true,
      }, (err, result) => {
        if (err) return reject(err);
        if (!result.result) return reject(result.reason || new Error('Conversión a Postman fallida'));

        ensureDir(docsDir);
        const outCollection = path.join(docsDir, 'tms-postman.postman_collection.json');
        fs.writeFileSync(outCollection, JSON.stringify(result.output[0].data, null, 2));
        console.log(`[postman:gen] Colección Postman escrita en ${outCollection}`);

        // Generar environment básico
        const env = {
          id: 'tms-postman-env',
          name: 'tms-postman-env',
          values: [
            { key: 'baseUrl', value: 'http://localhost:3000', type: 'text', enabled: true },
            { key: 'apiPrefix', value: '/api/v1', type: 'text', enabled: true },
            { key: 'token', value: '', type: 'text', enabled: true },
          ],
          _postman_variable_scope: 'environment',
          _postman_exported_at: new Date().toISOString(),
          _postman_exported_using: 'openapi-to-postmanv2',
        };
        const outEnv = path.join(docsDir, 'tms-postman.environment.json');
        fs.writeFileSync(outEnv, JSON.stringify(env, null, 2));
        console.log(`[postman:gen] Environment Postman escrito en ${outEnv}`);
        resolve();
      });
    });
  } catch (err) {
    console.error('[postman:gen] Error generando colección Postman:', err);
    process.exit(1);
  }
})();
