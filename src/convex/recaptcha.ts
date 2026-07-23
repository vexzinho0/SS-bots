import { v } from "convex/values";
import { action } from "./_generated/server";

/**
 * Verifica um token do Cloudflare Turnstile no servidor.
 *
 * Env vars necessárias (configurar na aba Keys):
 *   TURNSTILE_SECRET_KEY — chave secreta do Cloudflare Turnstile
 *
 * A Cloudflare Turnstile é uma alternativa gratuita e privada ao reCAPTCHA.
 * Docs: https://developers.cloudflare.com/turnstile/
 *
 * Uso no frontend:
 *   const token = await turnstileRef.current?.execute();
 *   if (token) await verifyTurnstile({ token });
 */
export const verify = action({
  args: { token: v.string() },
  handler: async (ctx, args): Promise<{ success: boolean; error?: string }> => {
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (!secret) {
      // Sem chave configurada — aceita em modo dev/test
      console.warn(
        "[Turnstile] TURNSTILE_SECRET_KEY não configurada. " +
          "Token não verificado no servidor. Configure na aba Keys."
      );
      return { success: true };
    }

    try {
      const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret,
            response: args.token,
          }),
        }
      );

      const data = (await response.json()) as {
        success: boolean;
        "error-codes"?: string[];
        challenge_ts?: string;
        hostname?: string;
        action?: string;
        cdata?: string;
      };

      if (!data.success) {
        console.warn("[Turnstile] Falha na verificação:", data["error-codes"]);
        return {
          success: false,
          error: data["error-codes"]?.join(", ") || "Verificação falhou",
        };
      }

      return { success: true };
    } catch (e) {
      console.error("[Turnstile] Erro na requisição de verificação:", e);
      return {
        success: false,
        error: e instanceof Error ? e.message : "Erro ao verificar Turnstile",
      };
    }
  },
});
