import { useEffect, useState } from 'react';
import LoginPage from './pages/login/LoginPage';
import ComponentsPreview from './pages/dev/ComponentsPreviewPage';
import ComponentsVerify from './pages/dev/ComponentsVerifyPage';
import NewsPage from './pages/news/NewsPage';

function App() {
  // Dev-only routes: /#preview = component gallery, /#verify=<key> = isolated
  // single component for matched-scale drift verification (see figma-verify).
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  if (hash === '#preview') return <ComponentsPreview />;
  if (hash.startsWith('#verify=')) {
    return (
      <ComponentsVerify
        vkey={decodeURIComponent(hash.slice('#verify='.length))}
      />
    );
  }
  if (window.location.pathname.startsWith('/news')) return <NewsPage />;
  return <LoginPage />;
}

export default App;
