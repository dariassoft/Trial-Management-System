# 🧪 Guía de Prueba: Generación de PDF con Gráficas Corregidas

**Ensayo de prueba:** ID 76
**Objetivo:** Verificar que las gráficas de Rendimiento y GIE ya no se desbordan

---

## 📋 Pasos para Probar

### 1. Verificar que el Backend esté Corriendo

```bash
docker compose ps app
```

Debe mostrar: `STATUS: Up`

### 2. Obtener Token de Autenticación

Si tienes un usuario de prueba:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tu_email@example.com",
    "password": "tu_password"
  }'
```

Copia el `access_token` de la respuesta.

### 3. Generar PDF del Ensayo 76

**Usando curl:**
```bash
TOKEN="TU_TOKEN_AQUI"

curl -X GET "http://localhost:3000/api/v1/reportes/ensayo/76/pdf" \
  -H "Authorization: Bearer $TOKEN" \
  --output ensayo_76_test.pdf
```

**Usando el navegador:**
1. Inicia sesión en la aplicación web (http://localhost:3001)
2. Navega a: Ensayos → Ensayo #76 → Reportes → Generar PDF
3. El PDF se descargará automáticamente

### 4. Verificar las Gráficas

Abre el PDF descargado y busca las páginas con gráficas:

#### ✅ Checklist de Verificación

**Gráfica de Rendimiento:**
- [ ] Las barras están completamente dentro del recuadro
- [ ] Los valores en el eje Y corresponden a los datos reales (no 5200-5900)
- [ ] Hay margen visible entre las barras más altas y el borde superior
- [ ] Las etiquetas de tratamientos son legibles
- [ ] Los valores sobre las barras son legibles

**Gráfica de GIE:**
- [ ] Las barras están completamente dentro del recuadro
- [ ] Los valores en el eje Y corresponden a los datos reales (no 94-100 fijo)
- [ ] La gráfica está en su propia página (no compartida)
- [ ] Hay margen visible entre las barras y los bordes
- [ ] Los porcentajes son legibles

**Gráfica de Plagas (si tiene datos):**
- [ ] Las dos barras (larvas y benéficos) están dentro del recuadro
- [ ] La gráfica está en su propia página
- [ ] La leyenda es clara
- [ ] No hay solapamiento de barras

---

## 🔍 Qué Buscar Específicamente

### Antes (Problemas):
- ❌ Valores hardcodeados (5200-5900 kg/ha, 94-100%)
- ❌ Barras saliendo del recuadro
- ❌ Gráficas cortadas entre páginas
- ❌ Etiquetas ilegibles o superpuestas

### Después (Esperado):
- ✅ Valores dinámicos basados en datos reales
- ✅ Todas las barras dentro del recuadro
- ✅ Cada gráfica en su propia página
- ✅ Márgenes apropiados (10% del rango)
- ✅ Grillas de referencia con valores correctos

---

## 📊 Ejemplo de Valores Esperados

Si el ensayo 76 tiene rendimientos entre 3000-5000 kg/ha:

**Rango esperado en gráfica:**
- Min: ~2700 kg/ha (3000 - 10% margen)
- Max: ~5500 kg/ha (5000 + 10% margen)

Si tiene GIE entre 95-98%:

**Rango esperado en gráfica:**
- Min: ~94.7% (95 - 0.3% margen)
- Max: ~98.3% (98 + 0.3% margen)

---

## 🐛 Troubleshooting

### El PDF no se genera
```bash
# Ver logs del backend
docker compose logs -f app | grep -i error
```

### Error de autorización
- Verifica que el token sea válido
- Verifica que el usuario tenga permisos para ver el ensayo 76

### El ensayo 76 no existe
```bash
# Verificar ensayos disponibles
curl -X GET "http://localhost:3000/api/v1/ensayos" \
  -H "Authorization: Bearer $TOKEN"
```

### Sin datos de cosecha
Si el ensayo 76 no tiene datos de cosecha, las gráficas no se generarán.
Prueba con otro ensayo que tenga datos completos.

---

## 📸 Comparación Visual

### Antes (con problema):
```
┌─────────────────────────────────────┐
│ Rendimiento (kg/ha)                 │
├─────────────────────────────────────┤
│ 5900 ─────────────────────────      │
│        ██████                        │ ← Barras saliendo
│        ██████████████                │    del recuadro
│ 5200 ████████████████████████████   │
└──────────────────────────────────── ← Corte aquí
  (continúa en siguiente página) ✗
```

### Después (corregido):
```
┌─────────────────────────────────────┐
│ Rendimiento (kg/ha)                 │
├─────────────────────────────────────┤
│ 5500 ─────────────────────────      │ ← Margen superior
│        ████                          │
│ 4000 ─ ████████ ─────────────       │ ← Grillas dinámicas
│        ████████████                  │
│ 2700 ─ ████████████████ ────────    │ ← Margen inferior
│        T1    T2    T3    T4          │
└─────────────────────────────────────┘ ✓
```

---

## ✨ Resultado Esperado Final

Al abrir el PDF deberías ver:
1. ✅ Todas las gráficas en páginas separadas
2. ✅ Barras completamente contenidas en recuadros
3. ✅ Escalas ajustadas a los datos reales
4. ✅ Márgenes visuales apropiados
5. ✅ Legibilidad mejorada

---

## 📝 Reportar Resultados

Si encuentras algún problema:
1. Toma screenshot del PDF
2. Anota los valores exactos de los datos
3. Verifica que los cálculos del rango sean correctos
4. Revisa los logs del backend durante la generación

**Comando para generar PDF con logs:**
```bash
# Terminal 1: Ver logs en tiempo real
docker compose logs -f app

# Terminal 2: Generar PDF
curl -X GET "http://localhost:3000/api/v1/reportes/ensayo/76/pdf" \
  -H "Authorization: Bearer $TOKEN" \
  --output ensayo_76_test.pdf
```

Busca en los logs líneas como:
```
📊 Gráficos generados: 3
🐛 GRÁFICO PLAGAS - Labels: ["T1","T2","T3"]
🐛 GRÁFICO PLAGAS - Larvas: [2.5, 1.8, 3.2]
```

---

**Fecha de prueba:** ___________
**Resultado:** [ ] ✅ OK  [ ] ❌ Falló  [ ] ⚠️ Parcial
**Notas adicionales:**
_______________________________________
_______________________________________

