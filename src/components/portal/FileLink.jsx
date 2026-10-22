import React, { useState } from 'react';
import { portalService } from '../../services/portalService';
export default function FileLink({ value, children = 'Download file' }) {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const open = async () => {
    setBusy(true); setError('');
    try { const url = await portalService.getFileUrl(value); if (!url) throw new Error(); window.open(url, '_blank', 'noopener,noreferrer'); }
    catch { setError('This file is unavailable. Please contact the school.'); }
    finally { setBusy(false); }
  };
  return <span><button type="button" disabled={busy || !value} onClick={open} className="text-sm font-bold text-mis-blue underline disabled:opacity-50">{busy ? 'Opening...' : children}</button>{error && <span role="alert" className="block text-xs text-red-700">{error}</span>}</span>;
}
