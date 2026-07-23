import React, { useEffect, useRef, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

// @ts-ignore
declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement | string, params: {
        sitekey: string;
        callback?: (token: string) => void;
        "expired-callback"?: () => void;
        "error-callback"?: () => void;
        theme?: "light" | "dark" | "auto";
        size?: "normal" | "compact";
      }) => string | undefined;
      reset: (widgetId: string) => void;
      getResponse: (widgetId: string) => string | undefined;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileProps {
  siteKey?: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
  onChange?: (token: string | null) => void;
  className?: string;
  error?: string | null;
}

export const TurnstileWidget = React.forwardRef<TurnstileHandle, TurnstileProps>(
  function TurnstileWidget({ 
    siteKey, 
    theme = "auto", 
    size = "normal", 
    onChange, 
    className, 
    error 
  }, ref) {
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | undefined>(undefined);
    const onChangeRef = useRef(onChange);
    const [isVerified, setIsVerified] = useState(false);
    const renderedRef = useRef(false);
    onChangeRef.current = onChange;

    const SITE_KEY = siteKey || import.meta.env.VITE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA";

    React.useImperativeHandle(ref, () => ({
      isVerified: () => isVerified,
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          window.turnstile.reset(widgetIdRef.current);
          setIsVerified(false);
          onChangeRef.current?.(null);
        }
      },
      execute: async () => {
        if (widgetIdRef.current && window.turnstile) {
          return window.turnstile.getResponse(widgetIdRef.current) || null;
        }
        return null;
      },
    }), [isVerified]);

    // Função para renderizar o widget
    const renderWidget = useCallback(() => {
      if (renderedRef.current || !containerRef.current || !window.turnstile) return;
      
      renderedRef.current = true;
      
      try {
        const id = window.turnstile.render(containerRef.current, {
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
          size,
        });
        
        if (id) {
          widgetIdRef.current = id;
          setStatus("ready");
        } else {
          setStatus("error");
        }
      } catch (e) {
        console.warn("[Turnstile] Erro ao renderizar:", e);
        setStatus("error");
        renderedRef.current = false;
      }
    }, [SITE_KEY, theme, size]);

    // Carregar script e renderizar
    useEffect(() => {
      if (!SITE_KEY) return;

      renderedRef.current = false;

      const scriptId = "cf-turnstile-script";

      const loadAndRender = () => {
        const existing = document.getElementById(scriptId) as HTMLScriptElement | null;
        
        if (existing) {
          // Script já existe, mas pode não ter carregado ainda
          if (window.turnstile) {
            renderWidget();
          } else {
            existing.addEventListener("load", renderWidget);
          }
          return;
        }

        const script = document.createElement("script");
        script.id = scriptId;
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.onload = renderWidget;
        script.onerror = () => setStatus("error");
        document.head.appendChild(script);
      };

      loadAndRender();
    }, [SITE_KEY, renderWidget]);

    if (!SITE_KEY) {
      return (
        <div className={cn("py-2 text-center", className)}>
          <span className="text-xs text-muted-foreground">
            Verificação de segurança não configurada
          </span>
        </div>
      );
    }

    return (
      <div className={cn("space-y-2", className)}>
        <div 
          ref={containerRef}
          className="flex justify-center items-center min-h-[65px]"
        >
          {status === "loading" && (
            <div className="flex items-center gap-2 py-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-xs text-muted-foreground">Carregando verificação...</span>
            </div>
          )}
          {status === "error" && (
            <span className="text-xs text-amber-600">
              Erro ao carregar verificação de segurança
            </span>
          )}
        </div>
        {error && !isVerified && (
          <p className="text-center text-xs text-destructive">{error}</p>
        )}
      </div>
    );
  }
);

export interface TurnstileHandle {
  execute: () => Promise<string | null>;
  reset: () => void;
  isVerified: () => boolean;
}

export default TurnstileWidget;
