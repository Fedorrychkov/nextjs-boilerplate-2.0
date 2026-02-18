# Database Setup

## MongoDB Connection

Подключение к MongoDB настроено в `lib/db/client.ts` с использованием connection pooling для оптимизации производительности.

## Модели

- **User** (`lib/db/models/User.ts`) - модель пользователя с хешированием паролей
- **RefreshToken** (`lib/db/models/RefreshToken.ts`) - модель для хранения refresh токенов

## Использование

```typescript
import connectDB from '~/lib/db/client'
import User from '~/lib/db/models/User'

// В API route или сервисе
await connectDB()
const users = await User.find({})
```
