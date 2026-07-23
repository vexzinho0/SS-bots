import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// @ts-ignore
declare global {
  interface Window {
    grecaptcha?: {
      render: (container: HTMLElement | string, params: {
        sitekey: string;
        callback?: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
        theme?: "light" | "dark";
        size?: "normal" | "compact";
      }) => number;
      reset: (widgetId: number) => void;
      getResponse: (widgetId: number) => string;
      ready: (cb: () => void) => void;
    };
  }
}

interface ReCAPTCHAProps {
  siteKey?: string;
  theme?: "light" | "dark";
  size?: "normal" | "compact";
  onChange?: (token: string | null) => void;
  className?: string;
  error?: string | null;
}

export const ReCAPTCHA = React.forwardRef<ReCAPTCHAHandle, ReCAPTCHAProps>(
  function ReCAPTCHA({ siteKey, theme = "light", onChange, className, error }, ref) {
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const [isVerified, setIsVerified] = useState(false);

    const SITE_KEY = siteKey || import.meta.env.VITE_RECAPTCHA_SITE_KEY || "6LdhbGEtAAAAAHvz-lU0gvwtL6_hpva5kDcj3g1j";

    React.useImperativeHandle(ref, () => ({
      isVerified: () => isVerified,
      reset: () => {
        if (widgetIdRef.current !== null && window.grecaptcha) {
          window.grecaptcha.reset(widgetIdRef.current);
          setIsVerified(false);
        }
      },
      execute: async () => {
        return null;
      },
    }), [isVerified]);

    // Carregar script do Google reCAPTCHA
    useEffect(() => {
      if (!SITE_KEY) return;

      const loadScript = () => {
        const existing = document.querySelector<HTMLScriptElement>(
          'script[src*="recaptcha/api.js"]'
        );
        if (existing) {
          existing.addEventListener("load", initWidget);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://www.google.com/recaptcha/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = initWidget;
        script.onerror = () => setStatus("error");
        document.head.appendChild(script);
      };

      const initWidget = () => {
        if (!window.grecaptcha || !containerRef.current) return;

        window.grecaptcha.ready(() => {
          if (!containerRef.current || widgetIdRef.current !== null) return;

          try {
            const id = window.grecaptcha!.render(containerRef.current, {
              sitekey: SITE_KEY!,
              callback: (token: string) => {
                setIsVerified(true);
                onChangeRef.current?.(token);
              },
              "expired-callback": () => {
                setIsVerified(false);
                onChangeRef.current?.(null);
              },
              "error-callback": () => {
                setIsVerified(false);
                onChangeRef.current?.(null);
              },
              theme,
              size: "normal",
            });
            widgetIdRef.current = id;
            setStatus("ready");
          } catch (e) {
            console.warn("[reCAPTCHA] Erro ao renderizar:", e);
            setStatus("error");
          }
        });
      };

      loadScript();
    }, [SITE_KEY, theme]);

    if (!SITE_KEY) {
      return (
        <div className={cn("py-2 text-center", className)}>
          <span className="text-xs text-muted-foreground">
            reCAPTCHA não configurado
          </span>
        </div>
      );
    }

    if (status === "loading") {
      return (
        <div className={cn("flex items-center justify-center py-4", className)}>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="ml-2 text-xs text-muted-foreground">Carregando...</span>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className={cn("py-2 text-center", className)}>
          <span className="text-xs text-amber-600">
            Erro ao carregar verificação
          </span>
        </div>
      );
    }

    return (
      <div className={cn("space-y-2", className)}>
        <div 
          ref={containerRef}
          className="flex justify-center min-h-[78px]"
        />
        {error && !isVerified && (
          <p className="text-center text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

export interface ReCAPTCHAHandle {
  execute: () => Promise<string | null>;
  reset: () => void;
  isVerified: () => boolean;
}

export default ReCAPTCHA;
