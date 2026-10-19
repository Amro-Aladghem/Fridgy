import { AppHeader } from '@/components/layout/AppHeader';
import { BottomNav } from '@/components/layout/BottomNav';
import { ChatProvider, useChat } from '@/contexts/ChatContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ProductsProvider } from '@/contexts/ProductsContext';
import { RouterProvider, useRouter } from '@/libs/router';
import { cn } from '@/libs/cn';
import { FridgeView } from '@/views/FridgeView';
import { HomeView } from '@/views/HomeView';
import { MonitoringView } from '@/views/MonitoringView';
import { ShoppingListsView } from '@/views/ShoppingListsView';

function CurrentView() {
  const { path } = useRouter();

  switch (path) {
    case '/fridge':
      return <FridgeView />;
    case '/shopping-lists':
      return <ShoppingListsView />;
    case '/monitoring':
      return <MonitoringView />;
    default:
      return <HomeView />;
  }
}

function AppShell() {
  const { path } = useRouter();
  const { chatOpen } = useChat();
  const showBottomNav = path !== '/' || !chatOpen;

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <AppHeader />
      <main className={cn('flex-1', showBottomNav && 'pb-24')}>
        <CurrentView />
      </main>
      {showBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <ProductsProvider>
        <ChatProvider>
          <RouterProvider>
            <AppShell />
          </RouterProvider>
        </ChatProvider>
      </ProductsProvider>
    </LanguageProvider>
  );
}

export default App;
