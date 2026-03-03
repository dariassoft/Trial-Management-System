# 🔍 Scripts SQL para Verificar Datos

## Verificar que exista el ensayo ID 74

```sql
SELECT * FROM Ensayo WHERE ensayo_id = 74;
```

## Contar parcelas del ensayo 74

```sql
SELECT COUNT(*) as total_parcelas FROM Parcela WHERE ensayo_id_fk = 74;
```

## Ver todas las parcelas del ensayo 74

```sql
SELECT p.parcela_id, p.nombre_parcela, p.tratamiento_id_fk, p.bloque_id_fk
FROM Parcela p
WHERE p.ensayo_id_fk = 74;
```

## Contar datos de campo para el ensayo 74

```sql
SELECT COUNT(*) as total_datos_campo
FROM Datos_Campo dc
WHERE dc.parcela_id_fk IN (
  SELECT parcela_id FROM Parcela WHERE ensayo_id_fk = 74
);
```

## Ver datos de campo con mediciones

```sql
SELECT 
  dc.dato_campo_id,
  dc.parcela_id_fk,
  COUNT(dcm.medicion_id) as total_mediciones
FROM Datos_Campo dc
LEFT JOIN Datos_Campo_Medicion dcm ON dcm.dato_campo_id_fk = dc.dato_campo_id
WHERE dc.parcela_id_fk IN (
  SELECT parcela_id FROM Parcela WHERE ensayo_id_fk = 74
)
GROUP BY dc.dato_campo_id, dc.parcela_id_fk;
```

## Contar datos de cosecha para el ensayo 74

```sql
SELECT COUNT(*) as total_cosecha
FROM Datos_Cosecha dc
WHERE dc.parcela_id_fk IN (
  SELECT parcela_id FROM Parcela WHERE ensayo_id_fk = 74
);
```

## Ver datos de cosecha con valores

```sql
SELECT 
  dc.cosecha_id,
  dc.parcela_id_fk,
  dc.humedad_pct,
  dc.kg_ha_corregido,
  dc.gie
FROM Datos_Cosecha dc
WHERE dc.parcela_id_fk IN (
  SELECT parcela_id FROM Parcela WHERE ensayo_id_fk = 74
);
```

## Ver variables disponibles

```sql
SELECT * FROM Protocolo_Variable LIMIT 10;
```

## Ver mediciones con valores

```sql
SELECT 
  dcm.medicion_id,
  dcm.valor,
  pv.nombre_variable
FROM Datos_Campo_Medicion dcm
LEFT JOIN Protocolo_Variable pv ON pv.variable_id = dcm.variable_id_fk
WHERE dcm.dato_campo_id_fk IN (
  SELECT dato_campo_id FROM Datos_Campo
  WHERE parcela_id_fk IN (
    SELECT parcela_id FROM Parcela WHERE ensayo_id_fk = 74
  )
)
LIMIT 20;
```

## Verificación Completa del Ensayo 74

```sql
-- Contar todos los datos del ensayo 74
SELECT 
  (SELECT COUNT(*) FROM Parcela WHERE ensayo_id_fk = 74) as parcelas,
  (SELECT COUNT(*) FROM Datos_Campo WHERE parcela_id_fk IN (
    SELECT parcela_id FROM Parcela WHERE ensayo_id_fk = 74
  )) as datos_campo,
  (SELECT COUNT(*) FROM Datos_Cosecha WHERE parcela_id_fk IN (
    SELECT parcela_id FROM Parcela WHERE ensayo_id_fk = 74
  )) as datos_cosecha,
  (SELECT COUNT(*) FROM Datos_Campo_Medicion WHERE dato_campo_id_fk IN (
    SELECT dato_campo_id FROM Datos_Campo 
    WHERE parcela_id_fk IN (
      SELECT parcela_id FROM Parcela WHERE ensayo_id_fk = 74
    )
  )) as mediciones;
```

---

## 📊 Resultado Esperado

Si todo está bien, debería retornar:
```
parcelas: 12 (ejemplo)
datos_campo: 48 (ejemplo: 12 parcelas * 4 momentos de evaluación)
datos_cosecha: 12 (ejemplo: 1 cosecha por parcela)
mediciones: 192 (ejemplo: 48 datos * 4 variables)
```

Si algún número es 0, necesitas cargar esos datos primero.

