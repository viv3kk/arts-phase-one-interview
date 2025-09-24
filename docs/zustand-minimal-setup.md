# Zustand Minimal Setup Documentation

## 📋 Overview

This document describes the minimal Zustand setup implemented in the project, focusing on infrastructure and SSR/SSG compatibility without specific business logic stores.

## 🏗️ Architecture

### **Directory Structure**

```
lib/
├── stores/
│   ├── types.ts              # Base type definitions
│   └── index.ts              # Centralized exports
├── providers/
│   └── StoreProvider.tsx     # Hydration management
└── hooks/
    ├── useHydration.ts       # Hydration utilities
    └── stores/
        ├── index.ts          # Store hook exports
        └── useStoreCoordination.ts  # React Query coordination
```

### **Provider Hierarchy**

```
<StoreProvider>          # Zustand hydration management
  <TenantProvider>       # Existing tenant context
    <ThemeProvider>      # Existing theme context
      {children}
    </ThemeProvider>
  </TenantProvider>
</StoreProvider>
```

## 🔧 Core Components

### **1. Base Types (`lib/stores/types.ts`)**

Defines minimal interfaces for:

- `StoreState`: Base store with hydration tracking
- `StoreConfig`: Configuration for store persistence
- `HydrationState`: Provider hydration status

### **2. Hydration Utilities (`lib/hooks/useHydration.ts`)**

- `useHydration()`: Basic hydration state detection
- `useStoreHydration()`: Store-specific hydration tracking

### **3. Store Provider (`lib/providers/StoreProvider.tsx`)**

- Manages SSR/SSG hydration lifecycle
- Shows loading state during hydration
- Error handling for hydration failures
- Prevents hydration mismatches

### **4. Coordination Hook (`lib/hooks/stores/useStoreCoordination.ts`)**

Provides utilities for React Query + Zustand coordination:

- `invalidateQueries()`: Cache invalidation
- `safeStoreUpdate()`: Post-hydration updates
- `coordinateOptimisticUpdate()`: Optimistic UI patterns

## 🚀 Integration

### **App Layout Integration**

The `StoreProvider` is integrated at the root level in `app/layout.tsx`:

```typescript
<StoreProvider>
  <TenantProvider initialConfig={config}>
    <ThemeProvider>{children}</ThemeProvider>
  </TenantProvider>
</StoreProvider>
```

### **Future Store Implementation**

When implementing specific stores (auth, UI, etc.):

1. **Create Store**: Implement with `skipHydration: true`
2. **Add to Provider**: Update `StoreProvider` hydration logic
3. **Export Hooks**: Add to `lib/hooks/stores/index.ts`
4. **Use Coordination**: Leverage `useStoreCoordination` for React Query sync

## 📝 Usage Patterns

### **Basic Hydration Check**

```typescript
const hasHydrated = useHydration()
if (!hasHydrated) return <LoadingState />
```

### **Store Coordination**

```typescript
const { safeStoreUpdate, invalidateQueries } = useStoreCoordination()

// Safe state update after hydration
safeStoreUpdate(() => {
  // Update store state
})

// Invalidate related queries
invalidateQueries(['user', 'auth'])
```

## ⚠️ SSR/SSG Considerations

### **Hydration Safety**

- All stores should use `skipHydration: true`
- Gate client-side features with `useHydration()`
- Provide fallback UI for pre-hydration state

### **Server Safety**

- No localStorage access during SSR
- Conditional client-side only operations
- Error boundaries for hydration failures

## ✅ **Setup Complete**

The minimal Zustand setup has been successfully implemented and tested:

- ✅ **Dependencies Installed**: Zustand v5.0.7
- ✅ **Directory Structure**: Clean, organized store architecture
- ✅ **SSR/SSG Hydration**: Manual hydration with loading states
- ✅ **Provider Integration**: Integrated with existing TenantProvider and ThemeProvider
- ✅ **Build Success**: Compiles without errors
- ✅ **Ready for Extension**: Foundation prepared for auth stores and React Query

## 🎯 Next Steps

This minimal setup provides the foundation for:

1. **Auth Store Implementation**: User authentication state
2. **React Query Integration**: Coordinated data fetching (install @tanstack/react-query first)
3. **UI State Management**: Modal, loading, preference states
4. **Multi-Tenant State**: Tenant-specific store isolation

## 📊 Benefits

- ✅ **SSR/SSG Compatible**: No hydration mismatches
- ✅ **Minimal Setup**: Infrastructure only, no business logic
- ✅ **React Query Ready**: Coordination patterns established
- ✅ **Type Safe**: Full TypeScript support
- ✅ **Scalable**: Ready for future store additions
- ✅ **Error Resilient**: Proper error handling and fallbacks

---

This setup provides a **solid foundation** for implementing Zustand with React Query coordination while maintaining SSR/SSG compatibility! 🚀
