<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Component Composition in React: A Comprehensive Implementation Guide

A complete guide to building scalable, maintainable React applications using composition patterns that eliminate prop drilling, reduce complexity, and create reusable component architectures.

## Table of Contents

1. [Overview](#overview)
2. [The Problem: Configuration Hell](#the-problem-configuration-hell)
3. [The Solution: Composition Pattern](#the-solution-composition-pattern)
4. [Implementation Patterns](#implementation-patterns)
5. [State Management with Composition](#state-management-with-composition)
6. [Advanced Composition Techniques](#advanced-composition-techniques)
7. [Real-World Examples](#real-world-examples)
8. [Best Practices](#best-practices)
9. [Common Pitfalls](#common-pitfalls)

## Overview

Component composition is a design pattern that focuses on building complex UIs by combining simple, focused components rather than creating monolithic components with numerous configuration props.

### Core Principles

- **Render or Don't Render**: Instead of conditional rendering based on props, compose only what you need
- **Single Responsibility**: Each component has one clear purpose
- **Declarative Structure**: JSX defines the component structure, not props
- **Provider Pattern**: Lift state up using Context for shared functionality

### Benefits

- Eliminates "boolean prop hell"
- Reduces component complexity
- Improves reusability and testability
- Makes code more readable and maintainable
- Enables better separation of concerns

## The Problem: Configuration Hell

### The Boolean Swamp

Many React applications suffer from components that accumulate boolean configuration props over time:

```tsx
// ❌ Bad: Configuration-driven component
interface UserFormProps {
  isEditing?: boolean
  hideWelcomeMessage?: boolean
  isSlugRequired?: boolean
  showAdvancedOptions?: boolean
  isAdminMode?: boolean
  disableSubmit?: boolean
  // ... dozens more boolean props
}

function UserForm({
  isEditing,
  hideWelcomeMessage,
  isSlugRequired,
  showAdvancedOptions,
  isAdminMode,
  disableSubmit,
}: UserFormProps) {
  return (
    <form>
      {!hideWelcomeMessage && <WelcomeMessage />}

      <input name='name' />

      {isSlugRequired && <input name='slug' />}

      {showAdvancedOptions && (
        <div>
          <input name='role' />
          {isAdminMode && <input name='permissions' />}
        </div>
      )}

      <button disabled={disableSubmit}>
        {isEditing ? 'Update' : 'Create'}
      </button>
    </form>
  )
}
```

### Problems with This Approach

1. **Complex Mental Model**: Developers must understand all possible prop combinations
2. **Testing Nightmare**: Exponential test case combinations
3. **Maintainability**: Adding features requires touching existing code
4. **Performance**: Unnecessary re-renders due to prop changes
5. **Coupling**: High coupling between parent and child components

## The Solution: Composition Pattern

### Render What You Need

Instead of configuration props, compose only the components you actually need:

```tsx
// ✅ Good: Composition-based approach
function CreateUserForm() {
  return (
    <UserFormProvider>
      <form>
        <WelcomeMessage />
        <UserNameInput />
        <EmailInput />
        <SubmitButton>Create User</SubmitButton>
      </form>
    </UserFormProvider>
  )
}

function EditUserForm() {
  return (
    <UserFormProvider>
      <form>
        <UserNameInput />
        <SlugInput />
        <EmailInput />
        <RoleSelector />
        <SubmitButton>Update User</SubmitButton>
      </form>
    </UserFormProvider>
  )
}
```

### Benefits of This Approach

- **Clear Intent**: Each form variant has explicit structure
- **No Conditional Logic**: No complex if/else statements
- **Easy Testing**: Test each variant independently
- **Flexible**: Easy to create new variants by composition

## Implementation Patterns

### 1. Compound Components Pattern

Build components that work together as a cohesive unit:

```tsx
// Modal compound component
function Modal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </ModalContext.Provider>
  )
}

Modal.Trigger = function ModalTrigger({
  children,
}: {
  children: React.ReactNode
}) {
  const { setIsOpen } = useModalContext()

  return <button onClick={() => setIsOpen(true)}>{children}</button>
}

Modal.Content = function ModalContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen, setIsOpen } = useModalContext()

  if (!isOpen) return null

  return (
    <div className='modal-overlay' onClick={() => setIsOpen(false)}>
      <div className='modal-content' onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

Modal.Header = function ModalHeader({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='modal-header'>{children}</div>
}

Modal.Body = function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className='modal-body'>{children}</div>
}

Modal.Footer = function ModalFooter({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className='modal-footer'>{children}</div>
}

// Usage
function UserProfile() {
  return (
    <Modal>
      <Modal.Trigger>Edit Profile</Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <h2>Edit Profile</h2>
        </Modal.Header>
        <Modal.Body>
          <UserForm />
        </Modal.Body>
        <Modal.Footer>
          <CancelButton />
          <SaveButton />
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  )
}
```

### 2. Render Props Pattern

Pass rendering logic as props to enable flexible composition:

```tsx
interface DataFetcherProps<T> {
  url: string
  children: (data: {
    data: T | null
    loading: boolean
    error: Error | null
    refetch: () => void
  }) => React.ReactNode
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(url)
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return <>{children({ data, loading, error, refetch: fetchData })}</>
}

// Usage
function UserList() {
  return (
    <DataFetcher<User[]> url='/api/users'>
      {({ data, loading, error, refetch }) => {
        if (loading) return <LoadingSpinner />
        if (error) return <ErrorMessage error={error} onRetry={refetch} />
        return (
          <div>
            {data?.map(user => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        )
      }}
    </DataFetcher>
  )
}
```

### 3. Higher-Order Components (HOCs)

Wrap components to add shared functionality:

```tsx
function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()

    if (loading) return <LoadingSpinner />

    if (!user) {
      return <Navigate to='/login' replace />
    }

    return <Component {...props} />
  }
}

// Usage
const ProtectedDashboard = withAuth(Dashboard)
const ProtectedSettings = withAuth(Settings)
```

### 4. Custom Hooks for Logic Composition

Extract and share stateful logic across components:

```tsx
function useToggle(initialState = false) {
  const [state, setState] = useState(initialState)

  const toggle = useCallback(() => setState(prev => !prev), [])
  const setTrue = useCallback(() => setState(true), [])
  const setFalse = useCallback(() => setState(false), [])

  return { state, toggle, setTrue, setFalse }
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setStoredValue = useCallback(
    (newValue: T) => {
      try {
        setValue(newValue)
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`Error saving to localStorage:`, error)
      }
    },
    [key],
  )

  return [value, setStoredValue] as const
}

// Usage
function Settings() {
  const { state: isOpen, toggle } = useToggle()
  const [theme, setTheme] = useLocalStorage('theme', 'light')

  return (
    <div>
      <button onClick={toggle}>
        {isOpen ? 'Hide' : 'Show'} Advanced Settings
      </button>

      {isOpen && <ThemeSelector value={theme} onChange={setTheme} />}
    </div>
  )
}
```

## State Management with Composition

### Provider Pattern for Shared State

Use Context to lift state up and share it across component trees:

```tsx
// Context creation
interface ComposerState {
  content: string
  setContent: (content: string) => void
  attachments: File[]
  addAttachment: (file: File) => void
  removeAttachment: (index: number) => void
  submit: () => Promise<void>
  isSubmitting: boolean
}

const ComposerContext = createContext<ComposerState | null>(null)

function useComposer() {
  const context = useContext(ComposerContext)
  if (!context) {
    throw new Error('useComposer must be used within ComposerProvider')
  }
  return context
}

// Provider implementation
function ComposerProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState('')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addAttachment = useCallback((file: File) => {
    setAttachments(prev => [...prev, file])
  }, [])

  const removeAttachment = useCallback((index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }, [])

  const submit = useCallback(async () => {
    setIsSubmitting(true)
    try {
      await submitMessage({ content, attachments })
      setContent('')
      setAttachments([])
    } finally {
      setIsSubmitting(false)
    }
  }, [content, attachments])

  const value: ComposerState = {
    content,
    setContent,
    attachments,
    addAttachment,
    removeAttachment,
    submit,
    isSubmitting,
  }

  return (
    <ComposerContext.Provider value={value}>
      {children}
    </ComposerContext.Provider>
  )
}

// Component implementations
function TextInput() {
  const { content, setContent } = useComposer()

  return (
    <textarea
      value={content}
      onChange={e => setContent(e.target.value)}
      placeholder='Type your message...'
    />
  )
}

function AttachmentZone() {
  const { addAttachment } = useComposer()

  return (
    <div
      onDrop={e => {
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files)
        files.forEach(addAttachment)
      }}
      onDragOver={e => e.preventDefault()}
    >
      Drop files here to attach
    </div>
  )
}

function SubmitButton() {
  const { submit, isSubmitting, content } = useComposer()

  return (
    <button onClick={submit} disabled={isSubmitting || !content.trim()}>
      {isSubmitting ? 'Sending...' : 'Send'}
    </button>
  )
}

// Different composer variants
function StandardComposer() {
  return (
    <ComposerProvider>
      <div className='composer'>
        <TextInput />
        <AttachmentZone />
        <div className='actions'>
          <SubmitButton />
        </div>
      </div>
    </ComposerProvider>
  )
}

function QuickReplyComposer() {
  return (
    <ComposerProvider>
      <div className='quick-composer'>
        <TextInput />
        <SubmitButton />
      </div>
    </ComposerProvider>
  )
}
```

### Different State Implementations

The same interface can support different state management strategies:

```tsx
// Ephemeral state for modal
function EphemeralComposerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Uses regular useState - state is lost when component unmounts
  const [content, setContent] = useState('')
  // ... rest of implementation
}

// Persistent state for main composer
function PersistentComposerProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Uses custom hook that syncs with server
  const [content, setContent] = useGlobalMessageDraft()
  // ... rest of implementation
}

// Usage based on context
function ForwardMessageModal() {
  return (
    <EphemeralComposerProvider>
      <StandardComposer />
    </EphemeralComposerProvider>
  )
}

function ChannelComposer() {
  return (
    <PersistentComposerProvider>
      <StandardComposer />
    </PersistentComposerProvider>
  )
}
```

## Advanced Composition Techniques

### 1. Slot Pattern

Create flexible layouts with named slots:

```tsx
interface LayoutProps {
  children: React.ReactNode
  header?: React.ReactNode
  sidebar?: React.ReactNode
  footer?: React.ReactNode
}

function Layout({ children, header, sidebar, footer }: LayoutProps) {
  return (
    <div className='layout'>
      {header && <header className='layout-header'>{header}</header>}

      <div className='layout-body'>
        {sidebar && <aside className='layout-sidebar'>{sidebar}</aside>}

        <main className='layout-main'>{children}</main>
      </div>

      {footer && <footer className='layout-footer'>{footer}</footer>}
    </div>
  )
}

// Usage
function DashboardPage() {
  return (
    <Layout
      header={<NavigationBar />}
      sidebar={<SidebarMenu />}
      footer={<StatusBar />}
    >
      <DashboardContent />
    </Layout>
  )
}

function LandingPage() {
  return (
    <Layout header={<PublicNav />}>
      <Hero />
      <Features />
      <CallToAction />
    </Layout>
  )
}
```

### 2. Polymorphic Components

Create components that can render as different elements:

```tsx
type As = keyof JSX.IntrinsicElements

interface PolymorphicProps<T extends As> {
  as?: T
  children: React.ReactNode
}

type Props<T extends As> = PolymorphicProps<T> &
  Omit<JSX.IntrinsicElements[T], keyof PolymorphicProps<T>>

function Button<T extends As = 'button'>({ as, children, ...props }: Props<T>) {
  const Component = as || 'button'

  return (
    <Component className='btn' {...props}>
      {children}
    </Component>
  )
}

// Usage
function Navigation() {
  return (
    <nav>
      <Button as='a' href='/home'>
        Home
      </Button>
      <Button as='a' href='/about'>
        About
      </Button>
      <Button onClick={() => console.log('clicked')}>Action</Button>
    </nav>
  )
}
```

### 3. Render Prop Composition

Combine multiple render prop components:

```tsx
function DataWithAuth<T>({
  children,
  ...dataProps
}: {
  children: (authData: AuthData, fetchData: FetchData<T>) => React.ReactNode
} & Omit<DataFetcherProps<T>, 'children'>) {
  return (
    <AuthProvider>
      {authData => (
        <DataFetcher {...dataProps}>
          {fetchData => children(authData, fetchData)}
        </DataFetcher>
      )}
    </AuthProvider>
  )
}

// Usage
function UserProfile() {
  return (
    <DataWithAuth<User> url='/api/user/profile'>
      {({ user }, { data: profile, loading }) => {
        if (!user) return <LoginPrompt />
        if (loading) return <LoadingSpinner />

        return <ProfileDisplay profile={profile} />
      }}
    </DataWithAuth>
  )
}
```

## Real-World Examples

### 1. Form Composition

Build flexible forms using composition:

```tsx
// Form context
const FormContext = createContext<{
  values: Record<string, any>
  errors: Record<string, string>
  touched: Record<string, boolean>
  setValue: (name: string, value: any) => void
  setError: (name: string, error: string) => void
  setTouched: (name: string, touched: boolean) => void
  validate: () => boolean
  submit: () => Promise<void>
} | null>(null)

// Form components
function Form({
  children,
  onSubmit,
}: {
  children: React.ReactNode
  onSubmit: (values: Record<string, any>) => Promise<void>
}) {
  const [values, setValues] = useState({})
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Implementation details...

  return (
    <FormContext.Provider value={contextValue}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormContext.Provider>
  )
}

function Field({
  name,
  label,
  type = 'text',
  required,
}: {
  name: string
  label: string
  type?: string
  required?: boolean
}) {
  const form = useContext(FormContext)!

  return (
    <div className='field'>
      <label htmlFor={name}>
        {label} {required && '*'}
      </label>
      <input
        id={name}
        type={type}
        value={form.values[name] || ''}
        onChange={e => form.setValue(name, e.target.value)}
        onBlur={() => form.setTouched(name, true)}
        className={form.errors[name] ? 'error' : ''}
      />
      {form.touched[name] && form.errors[name] && (
        <span className='error-message'>{form.errors[name]}</span>
      )}
    </div>
  )
}

// Usage - Create User Form
function CreateUserForm() {
  return (
    <Form onSubmit={createUser}>
      <Field name='firstName' label='First Name' required />
      <Field name='lastName' label='Last Name' required />
      <Field name='email' label='Email' type='email' required />
      <Field name='password' label='Password' type='password' required />
      <button type='submit'>Create User</button>
    </Form>
  )
}

// Usage - Login Form
function LoginForm() {
  return (
    <Form onSubmit={login}>
      <Field name='email' label='Email' type='email' required />
      <Field name='password' label='Password' type='password' required />
      <button type='submit'>Sign In</button>
    </Form>
  )
}
```

### 2. Data Table Composition

Build flexible data tables:

```tsx
function DataTable<T>({
  children,
  data,
}: {
  children: React.ReactNode
  data: T[]
}) {
  return (
    <DataTableProvider data={data}>
      <table className='data-table'>{children}</table>
    </DataTableProvider>
  )
}

DataTable.Header = function TableHeader({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  )
}

DataTable.Column = function TableColumn<T>({
  title,
  dataKey,
  render,
}: {
  title: string
  dataKey?: keyof T
  render?: (item: T) => React.ReactNode
}) {
  return <th>{title}</th>
}

DataTable.Body = function TableBody<T>({
  children,
}: {
  children: React.ReactNode
}) {
  const { data } = useDataTable<T>()

  return (
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          {React.Children.map(children, child => {
            if (
              React.isValidElement(child) &&
              child.type === DataTable.Column
            ) {
              const { dataKey, render } = child.props
              return (
                <td>
                  {render ? render(item) : dataKey ? item[dataKey] : null}
                </td>
              )
            }
            return child
          })}
        </tr>
      ))}
    </tbody>
  )
}

// Usage
function UserTable() {
  return (
    <DataTable data={users}>
      <DataTable.Header>
        <DataTable.Column title='Name' />
        <DataTable.Column title='Email' />
        <DataTable.Column title='Status' />
        <DataTable.Column title='Actions' />
      </DataTable.Header>

      <DataTable.Body>
        <DataTable.Column dataKey='name' />
        <DataTable.Column dataKey='email' />
        <DataTable.Column
          render={user => (
            <Badge variant={user.isActive ? 'success' : 'danger'}>
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          )}
        />
        <DataTable.Column
          render={user => (
            <div>
              <Button size='sm' onClick={() => editUser(user)}>
                Edit
              </Button>
              <Button
                size='sm'
                variant='danger'
                onClick={() => deleteUser(user)}
              >
                Delete
              </Button>
            </div>
          )}
        />
      </DataTable.Body>
    </DataTable>
  )
}
```

## Best Practices

### 1. Start with Composition in Mind

Design components from the ground up with composition:

```tsx
// ✅ Good: Designed for composition
function Card({ children }: { children: React.ReactNode }) {
  return <div className='card'>{children}</div>
}

Card.Header = function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className='card-header'>{children}</div>
}

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className='card-body'>{children}</div>
}

Card.Footer = function CardFooter({ children }: { children: React.ReactNode }) {
  return <div className='card-footer'>{children}</div>
}
```

### 2. Use TypeScript for Better Composition

Leverage TypeScript to ensure proper composition:

```tsx
interface BaseProps {
  children: React.ReactNode
  className?: string
}

interface ButtonProps extends BaseProps {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: () => void
}

function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const classes = `btn btn-${variant} btn-${size} ${className}`.trim()

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}
```

### 3. Provide Escape Hatches

Always provide ways to escape abstraction when needed:

```tsx
function ActionBar({
  children,
  showDefaults = true,
}: {
  children?: React.ReactNode
  showDefaults?: boolean
}) {
  return (
    <div className='action-bar'>
      {showDefaults && <DefaultActions />}
      {children}
    </div>
  )
}

// Usage with defaults
function StandardComposer() {
  return (
    <div>
      <TextInput />
      <ActionBar /> {/* Uses default actions */}
    </div>
  )
}

// Usage with custom actions
function CustomComposer() {
  return (
    <div>
      <TextInput />
      <ActionBar showDefaults={false}>
        <EmojiButton />
        <SendButton />
      </ActionBar>
    </div>
  )
}
```

### 4. Test Composition Boundaries

Test components in isolation and composition:

```tsx
describe('Card Component', () => {
  it('renders basic card', () => {
    render(
      <Card>
        <Card.Body>Content</Card.Body>
      </Card>,
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders full card composition', () => {
    render(
      <Card>
        <Card.Header>Title</Card.Header>
        <Card.Body>Content</Card.Body>
        <Card.Footer>Footer</Card.Footer>
      </Card>,
    )

    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
})
```

## Common Pitfalls

### 1. Over-Abstracting Too Early

Don't create abstractions before you need them:

```tsx
// ❌ Bad: Premature abstraction
function GenericWidget({ type, data, config, handlers }: GenericWidgetProps) {
  // Complex logic to handle all possible widget types
}

// ✅ Good: Start specific, abstract when patterns emerge
function UserWidget({ user }: { user: User }) {
  return (
    <div className='user-widget'>
      <Avatar src={user.avatar} />
      <span>{user.name}</span>
    </div>
  )
}
```

### 2. Deep Nesting of Providers

Avoid provider hell:

```tsx
// ❌ Bad: Too many nested providers
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <DataProvider>
            <NotificationProvider>
              <MyApp />
            </NotificationProvider>
          </DataProvider>
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

// ✅ Good: Combine related providers
function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>{children}</RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

function App() {
  return (
    <AppProviders>
      <MyApp />
    </AppProviders>
  )
}
```

### 3. Ignoring Performance

Be mindful of re-renders in composed components:

```tsx
// ✅ Good: Memoize expensive operations
const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
}: {
  data: ComplexData
}) {
  const processedData = useMemo(() => {
    return expensiveOperation(data)
  }, [data])

  return <div>{processedData}</div>
})

// ✅ Good: Split contexts to avoid unnecessary re-renders
const UIContext = createContext(uiState)
const DataContext = createContext(dataState)
```

## Summary

Component composition is a powerful pattern that leads to more maintainable, testable, and flexible React applications. By focusing on small, focused components that work together rather than monolithic components with many configuration options, you create code that is easier to understand, modify, and extend.

### Key Takeaways

1. **Prefer composition over configuration props**
2. **Use the Provider pattern for shared state**
3. **Design components to work well together**
4. **Provide escape hatches for custom use cases**
5. **Test both individual components and their compositions**
6. **Start specific and abstract only when patterns emerge**

By following these principles and patterns, you'll build React applications that scale gracefully and remain maintainable as they grow in complexity.
