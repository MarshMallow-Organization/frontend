import { useEffect, useState } from 'react';
import LoginPage from './pages/login';
import ComponentsPreview from './pages/components-preview';
import ComponentsVerify from './pages/components-verify';

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
  return <LoginPage />;
}

export default App;
