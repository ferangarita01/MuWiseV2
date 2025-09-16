# 🔄 Guía de Migración Firebase → Supabase

## 📋 Resumen

Esta guía documenta la migración del proyecto MuWise de Firebase a Supabase, implementando un sistema dual que permite alternar entre ambos proveedores sin afectar la producción.

## 🏗️ Arquitectura Implementada

### **Sistema de Abstracción**
- **Interfaces unificadas** para operaciones de base de datos
- **Adaptadores** para Firebase y Supabase
- **Factory pattern** para alternar entre proveedores
- **Hooks unificados** para autenticación

### **Estructura de Archivos**
```
src/
├── lib/
│   ├── database/
│   │   ├── types.ts              # Interfaces unificadas
│   │   ├── firebase-adapter.ts   # Implementación Firebase
│   │   ├── supabase-adapter.ts   # Implementación Supabase
│   │   └── factory.ts            # Factory pattern
│   ├── supabase-client.ts        # Configuración Supabase
│   └── firebase-client.ts        # Configuración Firebase (existente)
├── hooks/
│   └── use-unified-auth.tsx      # Hook de autenticación unificado
└── services/
    └── unifiedAgreementService.ts # Servicio de acuerdos unificado
```

## 🔧 Configuración

### **Variables de Entorno**

Copia el archivo `env.example` a `.env.local` y configura:

```env
# Firebase (actual - producción)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"

# Supabase (nuevo - desarrollo)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Control de migración
USE_SUPABASE=false  # Cambiar a true para usar Supabase
```

### **Configuración de Supabase**

1. **Crear proyecto en Supabase**
2. **Configurar autenticación**
3. **Crear esquema de base de datos** (ver sección de esquema)
4. **Configurar storage buckets**

## 🗄️ Esquema de Base de Datos

### **Tabla de Usuarios**
```sql
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  profile_picture TEXT,
  phone TEXT,
  company TEXT,
  role TEXT DEFAULT 'user',
  is_email_verified BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  preferences JSONB DEFAULT '{}',
  stripe_customer_id TEXT,
  stripe_price_id TEXT,
  stripe_subscription_id TEXT,
  stripe_subscription_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Tabla de Acuerdos**
```sql
CREATE TABLE agreements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  song_title TEXT,
  description TEXT,
  publication_date TIMESTAMP WITH TIME ZONE,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  composers JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft',
  type TEXT NOT NULL,
  created_by UUID REFERENCES users(id),
  signers JSONB DEFAULT '[]',
  document_url TEXT,
  metadata JSONB DEFAULT '{}',
  expires_at TIMESTAMP WITH TIME ZONE,
  signed_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### **Políticas de Seguridad (RLS)**
```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Políticas para acuerdos
CREATE POLICY "Users can view own agreements" ON agreements
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can create agreements" ON agreements
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own agreements" ON agreements
  FOR UPDATE USING (auth.uid() = created_by);
```

## 🚀 Uso

### **Autenticación Unificada**

```tsx
import { useUnifiedAuth } from '@/hooks/use-unified-auth';

function LoginComponent() {
  const { signIn, signUp, user, loading, provider } = useUnifiedAuth();

  const handleSignIn = async (email: string, password: string) => {
    const result = await signIn(email, password);
    if (result.success) {
      console.log('Usuario autenticado');
    } else {
      console.error('Error:', result.error);
    }
  };

  return (
    <div>
      <p>Proveedor actual: {provider}</p>
      {/* Tu UI de login */}
    </div>
  );
}
```

### **Operaciones de Base de Datos**

```tsx
import { createDatabaseClient } from '@/lib/database/factory';

const db = createDatabaseClient();

// Crear acuerdo
const agreement = await db.db.createAgreement({
  title: 'Mi Acuerdo',
  type: 'dj_service',
  signers: [],
  metadata: {}
});

// Obtener acuerdos del usuario
const agreements = await db.db.getAgreements(userId);
```

### **Servicio de Acuerdos Unificado**

```tsx
import { unifiedAgreementService } from '@/services/unifiedAgreementService';

// Crear acuerdo
const agreement = await unifiedAgreementService.createAgreement({
  title: 'Nuevo Acuerdo',
  type: 'dj_service',
  signers: [],
  metadata: {}
}, userId);

// Obtener estadísticas
const stats = await unifiedAgreementService.getAgreementStats(userId);
```

## 🔄 Migración de Datos

### **Script de Migración**

```typescript
// scripts/migrate-to-supabase.ts
import { adminDb } from '@/lib/firebase-server';
import { supabaseAdmin } from '@/lib/supabase-client';

async function migrateUsers() {
  const usersSnapshot = await adminDb.collection('users').get();
  
  for (const doc of usersSnapshot.docs) {
    const userData = doc.data();
    
    await supabaseAdmin.from('users').insert({
      id: doc.id,
      email: userData.email,
      name: userData.name,
      // ... mapear otros campos
    });
  }
}

async function migrateAgreements() {
  const agreementsSnapshot = await adminDb.collection('agreements').get();
  
  for (const doc of agreementsSnapshot.docs) {
    const agreementData = doc.data();
    
    await supabaseAdmin.from('agreements').insert({
      id: doc.id,
      title: agreementData.title,
      // ... mapear otros campos
    });
  }
}
```

## 🧪 Testing

### **Testing de Adaptadores**

```typescript
// tests/database-adapters.test.ts
import { FirebaseDatabaseClient } from '@/lib/database/firebase-adapter';
import { SupabaseDatabaseClient } from '@/lib/database/supabase-adapter';

describe('Database Adapters', () => {
  test('Firebase adapter should work', async () => {
    const firebaseDb = new FirebaseDatabaseClient();
    // Test Firebase operations
  });

  test('Supabase adapter should work', async () => {
    const supabaseDb = new SupabaseDatabaseClient();
    // Test Supabase operations
  });
});
```

## 📊 Monitoreo

### **Métricas de Rendimiento**

```typescript
// utils/performance-monitor.ts
export class PerformanceMonitor {
  static async measureOperation<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    const start = performance.now();
    const result = await operation();
    const end = performance.now();
    
    console.log(`${operationName} took ${end - start} milliseconds`);
    return result;
  }
}
```

## 🚨 Rollback

### **Estrategia de Rollback**

```typescript
// En caso de problemas, cambiar USE_SUPABASE=false
// El sistema automáticamente volverá a Firebase

// O programáticamente:
import { resetDatabaseClient } from '@/lib/database/factory';

// Forzar recreación del cliente
resetDatabaseClient();
```

## 📈 Próximos Pasos

1. **Configurar proyecto Supabase**
2. **Ejecutar migración de datos**
3. **Testing exhaustivo**
4. **Despliegue gradual con feature flags**
5. **Monitoreo y métricas**
6. **Switch completo a Supabase**

## 🔗 Recursos

- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de migración de Firebase](https://supabase.com/docs/guides/migrations/firebase)
- [Edge Functions de Supabase](https://supabase.com/docs/guides/functions)

## ⚠️ Consideraciones

- **Backup de datos** antes de la migración
- **Testing exhaustivo** en entorno de desarrollo
- **Monitoreo** durante la transición
- **Plan de rollback** preparado
- **Comunicación** con el equipo sobre los cambios
