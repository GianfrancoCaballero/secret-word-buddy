# Guía de Despliegue en Vercel con Supabase Externo

## Prerrequisitos
- Cuenta en [Vercel](https://vercel.com)
- Cuenta en [Supabase](https://supabase.com)
- Repositorio en GitHub con el código

---

## Paso 1: Crear Proyecto Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta/proyecto nuevo
2. Anota las credenciales desde **Settings > API**:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Para el frontend
   - **service_role key**: Para Edge Functions (¡mantener secreto!)
3. Anota el **Project ID** desde **Settings > General**

---

## Paso 2: Configurar Base de Datos

Ejecuta el siguiente SQL en el **SQL Editor** de Supabase:

```sql
-- =============================================
-- TABLAS PRINCIPALES
-- =============================================

-- Tabla de salas de juego
CREATE TABLE IF NOT EXISTS public.game_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code VARCHAR(6) NOT NULL UNIQUE,
  host_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'waiting',
  words TEXT[] DEFAULT NULL,
  current_word TEXT DEFAULT NULL,
  impostor_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabla de jugadores en sala
CREATE TABLE IF NOT EXISTS public.room_players (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id UUID NOT NULL REFERENCES public.game_rooms(id) ON DELETE CASCADE,
  player_id UUID NOT NULL,
  player_name VARCHAR(50) NOT NULL,
  player_secret UUID DEFAULT NULL,
  is_host BOOLEAN DEFAULT FALSE,
  role VARCHAR(20) DEFAULT NULL,
  assigned_word TEXT DEFAULT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, player_id)
);

-- Vista segura de jugadores (sin secrets)
CREATE OR REPLACE VIEW public.room_players_safe AS
SELECT 
  id,
  room_id,
  player_id,
  player_name,
  is_host,
  joined_at
FROM public.room_players;

-- Tabla de categorías de palabras
CREATE TABLE IF NOT EXISTS public.word_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  icon VARCHAR(50) DEFAULT NULL,
  words TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Habilitar RLS
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.word_categories ENABLE ROW LEVEL SECURITY;

-- Políticas para game_rooms (acceso público para juego anónimo)
CREATE POLICY "Anyone can view rooms" ON public.game_rooms FOR SELECT USING (true);
CREATE POLICY "Anyone can create rooms" ON public.game_rooms FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update rooms" ON public.game_rooms FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete rooms" ON public.game_rooms FOR DELETE USING (true);

-- Políticas para room_players
CREATE POLICY "Anyone can view players" ON public.room_players FOR SELECT USING (true);
CREATE POLICY "Anyone can join rooms" ON public.room_players FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update players" ON public.room_players FOR UPDATE USING (true);
CREATE POLICY "Anyone can leave rooms" ON public.room_players FOR DELETE USING (true);

-- Políticas para word_categories (solo lectura pública)
CREATE POLICY "Anyone can view categories" ON public.word_categories FOR SELECT USING (true);

-- =============================================
-- REALTIME
-- =============================================

-- Habilitar realtime para actualizaciones en tiempo real
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_players;

-- =============================================
-- DATOS INICIALES
-- =============================================

INSERT INTO public.word_categories (name, icon, words) VALUES
  ('Animales', '🐾', ARRAY['Perro', 'Gato', 'Elefante', 'León', 'Tigre', 'Jirafa', 'Mono', 'Oso', 'Lobo', 'Zorro']),
  ('Comidas', '🍕', ARRAY['Pizza', 'Hamburguesa', 'Tacos', 'Sushi', 'Pasta', 'Ensalada', 'Pollo', 'Arroz', 'Sopa', 'Helado']),
  ('Países', '🌍', ARRAY['España', 'México', 'Argentina', 'Colombia', 'Chile', 'Perú', 'Francia', 'Italia', 'Alemania', 'Japón']),
  ('Deportes', '⚽', ARRAY['Fútbol', 'Baloncesto', 'Tenis', 'Natación', 'Atletismo', 'Voleibol', 'Golf', 'Boxeo', 'Ciclismo', 'Esquí']),
  ('Profesiones', '👨‍💼', ARRAY['Doctor', 'Abogado', 'Ingeniero', 'Profesor', 'Chef', 'Arquitecto', 'Piloto', 'Bombero', 'Policía', 'Artista'])
ON CONFLICT DO NOTHING;
```

---

## Paso 3: Desplegar Edge Function

### Instalar Supabase CLI

```bash
npm install -g supabase
```

### Iniciar sesión y vincular proyecto

```bash
supabase login
supabase link --project-ref TU_PROJECT_ID
```

### Desplegar la función

```bash
supabase functions deploy game-actions
```

### Configurar secrets

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

---

## Paso 4: Actualizar CORS

Edita `supabase/functions/game-actions/index.ts` y actualiza `ALLOWED_ORIGINS`:

```typescript
const ALLOWED_ORIGINS = [
  'https://tu-app.vercel.app',           // Tu dominio de Vercel
  'https://tu-dominio.com',              // Tu dominio personalizado (opcional)
  'http://localhost:8080',               // Desarrollo local
  'http://localhost:5173',               // Vite dev server
];
```

Luego redesplegar:

```bash
supabase functions deploy game-actions
```

---

## Paso 5: Configurar Vercel

### 1. Conectar repositorio

1. Ve a [vercel.com](https://vercel.com) y crea un nuevo proyecto
2. Importa tu repositorio de GitHub

### 2. Variables de entorno

Agrega estas variables en **Settings > Environment Variables**:

| Variable | Valor |
|----------|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Tu anon key |
| `VITE_SUPABASE_PROJECT_ID` | Tu project ID |

### 3. Configuración de build

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## Paso 6: Desplegar

1. Haz push a la rama `main` para trigger automático
2. O usa el botón "Deploy" en el dashboard de Vercel

---

## Verificación

1. ✅ Frontend carga correctamente
2. ✅ Puedes crear una sala
3. ✅ Puedes unirte con código desde otro dispositivo
4. ✅ Actualizaciones en tiempo real funcionan
5. ✅ El juego inicia y muestra roles

---

## Troubleshooting

### Error CORS
- Verifica que tu dominio de Vercel esté en `ALLOWED_ORIGINS`
- Redesplegar la función después de cambiar CORS

### Error de conexión a Supabase
- Verifica las variables de entorno en Vercel
- Asegúrate de usar la URL y key correctas

### Realtime no funciona
- Verifica que las tablas tienen Realtime habilitado
- Comprueba las políticas RLS

---

## Costos

| Servicio | Plan Gratuito |
|----------|---------------|
| Vercel | 100GB bandwidth/mes, despliegues ilimitados |
| Supabase | 500MB DB, 2GB storage, 50K edge function invocations/mes |

Para producción considera los planes pagos según tu tráfico.
