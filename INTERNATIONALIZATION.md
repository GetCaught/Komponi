# Internationalization (i18n) Setup

This project uses `next-intl` for internationalization, supporting both Danish (da) and English (en) languages.

## Quick Language Switching

The application includes a language switcher in the navigation bar that allows users to switch between Danish and English instantly.

## How to Add New Translations

### 1. Add to Translation Files

Add new translation keys to both language files:

**Danish (`messages/da.json`):**
```json
{
  "newSection": {
    "title": "Ny titel",
    "description": "Ny beskrivelse"
  }
}
```

**English (`messages/en.json`):**
```json
{
  "newSection": {
    "title": "New title",
    "description": "New description"
  }
}
```

### 2. Use in Components

In your React components, use the `useTranslations` hook:

```tsx
import { useTranslations } from 'next-intl'

export default function MyComponent() {
  const t = useTranslations()
  
  return (
    <div>
      <h1>{t('newSection.title')}</h1>
      <p>{t('newSection.description')}</p>
    </div>
  )
}
```

### 3. For Arrays and Complex Data

For arrays or complex data structures:

```json
{
  "features": [
    "Feature 1",
    "Feature 2",
    "Feature 3"
  ]
}
```

Use `t.raw()` to get the raw value:

```tsx
{t.raw('features').map((feature, index) => (
  <li key={index}>{feature}</li>
))}
```

### 4. For Pluralization

Use ICU MessageFormat syntax:

```json
{
  "items": "{count} item{count, plural, one {} other {s}}"
}
```

```tsx
{t('items', { count: 5 })} // "5 items"
{t('items', { count: 1 })} // "1 item"
```

## Adding New Languages

1. Create a new translation file: `messages/[locale].json`
2. Add the locale to the `locales` array in `i18n.ts`
3. Update the language switcher in `LanguageSwitcher.tsx`

## Current Structure

- **Default Language**: Danish (da)
- **Supported Languages**: Danish (da), English (en)
- **Translation Files**: `messages/da.json`, `messages/en.json`
- **Configuration**: `i18n.ts`, `middleware.ts`, `next.config.ts`

## Best Practices

1. **Use nested keys** for better organization: `section.subsection.key`
2. **Keep translations consistent** across all languages
3. **Use descriptive key names** that indicate the content
4. **Test both languages** when adding new features
5. **Consider cultural differences** in translations

## URL Structure

The application uses locale-prefixed URLs:
- Danish: `/da/...`
- English: `/en/...`
- Default (Danish): `/...`

## Components

- `LanguageSwitcher`: Dropdown to switch between languages
- `useTranslations`: Hook to access translations in components
- `NextIntlClientProvider`: Provider for client-side translations 