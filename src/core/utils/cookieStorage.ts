import Cookies from 'js-cookie';

export const customCookieStorage = {
  getItem: (key: string): string | null => {
    return Cookies.get(key) || null;
  },
  setItem: (key: string, value: string): void => {
    // Definimos flags de segurança:
    // secure: true se estivermos em HTTPS
    // sameSite: 'Lax' para proteger contra CSRF
    Cookies.set(key, value, {
      expires: 7, // A sessão persistirá por 7 dias
      secure: window.location.protocol === 'https:', 
      sameSite: 'Lax',
      path: '/',
    });
  },
  removeItem: (key: string): void => {
    Cookies.remove(key, { path: '/' });
  },
};
