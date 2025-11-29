'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

type Provider = 'google' | 'facebook' | 'apple';

type OAuthButtonsProps = {
  apiBase: string | undefined;
  role?: string | null;
  onSuccess: (data: any) => void;
};

type WindowWithProviders = Window &
  typeof globalThis & {
    google?: any;
    FB?: any;
    AppleID?: any;
    fbAsyncInit?: () => void;
  };

const googleSrc = 'https://accounts.google.com/gsi/client';
const facebookSrc = 'https://connect.facebook.net/en_US/sdk.js';
const appleSrc = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

export function OAuthButtons({ apiBase, role, onSuccess }: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const [googleReady, setGoogleReady] = useState(false);
  const [facebookReady, setFacebookReady] = useState(false);
  const [appleReady, setAppleReady] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const facebookAppId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
  const appleClientId = process.env.NEXT_PUBLIC_APPLE_CLIENT_ID;
  const appleRedirectUri = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI || '';

  const loadScript = useCallback((src: string, id: string, onLoad: () => void) => {
    if (document.getElementById(id)) {
      onLoad();
      return;
    }
    const script = document.createElement('script');
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = onLoad;
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    loadScript(googleSrc, 'google-oauth', () => setGoogleReady(true));
  }, [loadScript]);

  useEffect(() => {
    loadScript(
      facebookSrc,
      'facebook-oauth',
      () => {
        const w = window as WindowWithProviders;
        if (w.FB || !facebookAppId) {
          setFacebookReady(Boolean(facebookAppId));
          return;
        }
        w.fbAsyncInit = function () {
          w.FB.init({
            appId: facebookAppId,
            cookie: true,
            xfbml: false,
            version: 'v19.0',
          });
          setFacebookReady(true);
        };
      }
    );
  }, [facebookAppId, loadScript]);

  useEffect(() => {
    if (!appleClientId) return;
    loadScript(appleSrc, 'apple-oauth', () => setAppleReady(true));
  }, [appleClientId, loadScript]);

  const handleOauthExchange = useCallback(
    async (provider: Provider, token: string, extraProfile?: Record<string, any>) => {
      if (!apiBase) throw new Error('API URL is missing');
      setLoadingProvider(provider);
      try {
        const response = await fetch(`${apiBase}/auth/oauth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            provider,
            token,
            role,
            profile: extraProfile,
          }),
        });
        const json = await response.json();
        if (!response.ok) {
          throw new Error(json.message || 'OAuth login failed');
        }
        onSuccess(json);
      } catch (err: any) {
        alert(err.message || 'Could not complete social login.');
      } finally {
        setLoadingProvider(null);
      }
    },
    [apiBase, onSuccess, role]
  );

  const signInWithGoogle = useCallback(() => {
    if (!googleReady || !googleClientId) {
      alert('Google Sign-In is not configured.');
      return;
    }
    const w = window as WindowWithProviders;
    w.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response: any) => {
        if (response.credential) {
          handleOauthExchange('google', response.credential);
        }
      },
    });
    w.google.accounts.id.prompt();
  }, [googleClientId, googleReady, handleOauthExchange]);

  const signInWithFacebook = useCallback(() => {
    if (!facebookReady || !facebookAppId) {
      alert('Facebook Sign-In is not configured.');
      return;
    }
    const w = window as WindowWithProviders;
    w.FB.login(
      (response: any) => {
        const token = response?.authResponse?.accessToken;
        if (token) {
          handleOauthExchange('facebook', token);
        }
      },
      { scope: 'email' }
    );
  }, [facebookAppId, facebookReady, handleOauthExchange]);

  const signInWithApple = useCallback(() => {
    if (!appleReady || !appleClientId || !appleRedirectUri) {
      alert('Apple Sign-In is not configured.');
      return;
    }
    const w = window as WindowWithProviders;
    const AppleID = w.AppleID;
    if (!AppleID?.auth) {
      alert('Apple Sign-In unavailable.');
      return;
    }
    AppleID.auth.init({
      clientId: appleClientId,
      scope: 'name email',
      redirectURI: appleRedirectUri,
      usePopup: true,
    });
    AppleID.auth
      .signIn()
      .then((resp: any) => {
        const token = resp?.authorization?.id_token;
        if (token) {
          const name = resp?.user?.name || {};
          handleOauthExchange('apple', token, {
            firstName: name.firstName,
            lastName: name.lastName,
          });
        }
      })
      .catch((err: any) => {
        console.error('Apple Sign-In error', err);
        alert('Apple Sign-In failed.');
      });
  }, [appleClientId, appleReady, appleRedirectUri, handleOauthExchange]);

  const disabled = useMemo(
    () => !apiBase || loadingProvider !== null,
    [apiBase, loadingProvider]
  );

  const buttonClass =
    'w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-4 py-2 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="space-y-3">
      <button
        type="button"
        className={buttonClass}
        onClick={signInWithGoogle}
        disabled={disabled || !googleClientId}
      >
        <span>Continue with Google</span>
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={signInWithFacebook}
        disabled={disabled || !facebookAppId}
      >
        <span>Continue with Facebook</span>
      </button>
      <button
        type="button"
        className={buttonClass}
        onClick={signInWithApple}
        disabled={disabled || !appleClientId || !appleRedirectUri}
      >
        <span>Continue with Apple</span>
      </button>
    </div>
  );
}
