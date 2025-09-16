#!/bin/bash
echo "🚀 Iniciando migración de código..."

# Función para mover archivo si existe
move_if_exists() {
    if [ -f "$1" ]; then
        echo "📦 Moviendo $1 → $2"
        mkdir -p "$(dirname "$2")"
        mv "$1" "$2"
    else
        echo "⚠️  Archivo no encontrado: $1"
    fi
}

# Mover tipos existentes
echo "📁 Migrando tipos..."
move_if_exists "src/lib/types.ts" "src/types/legacy.ts"

# Mover acciones existentes (si existen en src/actions)
echo "📁 Migrando acciones..."
if [ -f "src/actions/agreementActions.ts" ]; then
    mv "src/actions/agreementActions.ts" "src/actions/agreement/legacy.ts"
fi

if [ -f "src/actions/userActions.ts" ]; then
    mv "src/actions/userActions.ts" "src/actions/user/legacy.ts"
fi

# Crear servicios desde archivos existentes
echo "📁 Creando servicios desde archivos existentes..."
if [ -f "src/lib/actions.ts" ]; then
    cp "src/lib/actions.ts" "src/services/legacy-actions.ts"
fi

echo "✅ Migración de archivos completada"
echo "📋 Próximos pasos:"
echo "   1. Revisar archivos en src/types/legacy.ts"
echo "   2. Revisar archivos en src/actions/*/legacy.ts"
echo "   3. Migrar código específico a la nueva estructura"
echo "   4. Actualizar imports en componentes"
