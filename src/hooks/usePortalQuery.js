import { useEffect, useRef, useState, useCallback } from 'react';
export default function usePortalQuery(load, dependencies = [], initial = [], refreshMs = 0) {
  const loader = useRef(load); loader.current = load;
  const [version, setVersion] = useState(0);
  const dataKey=JSON.stringify(dependencies);
  const key = JSON.stringify([...dependencies, version]);
  const [state, setState] = useState({ key: '', dataKey: '', data: initial, loading: true, error: '' });
  useEffect(() => {
    let active = true;
    setState(previous=>previous.dataKey===dataKey ? {...previous,key,error:''} : { key, dataKey, data: initial, loading: true, error: '' });
    Promise.resolve().then(() => loader.current()).then(data => {
      if (active) setState({ key, dataKey, data, loading: false, error: '' });
    }).catch(() => {
      if (active) setState({ key, dataKey, data: initial, loading: false, error: 'Unable to load these records. Please retry or contact the school administrator.' });
    });
    return () => { active = false; };
  }, [key]);
  const reload = useCallback(() => setVersion(v => v + 1), []);
  useEffect(() => {
    const onStorage=e=>{if(e.key==='portal-content-version')reload();};
    const onVisible=()=>{if(document.visibilityState==='visible')reload();};
    window.addEventListener('portal-content-changed',reload);
    window.addEventListener('storage',onStorage);
    window.addEventListener('focus',onVisible);
    const timer=refreshMs?setInterval(onVisible,refreshMs):null;
    return()=>{window.removeEventListener('portal-content-changed',reload);window.removeEventListener('storage',onStorage);window.removeEventListener('focus',onVisible);if(timer)clearInterval(timer);};
  },[reload,refreshMs]);
  return { ...(state.dataKey === dataKey ? state : { data: initial, loading: true, error: '' }), reload };
}
