// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  // Cloudflare Turnstile (https://challenges.cloudflare.com/turnstile/v0/api.js)
  // が実行時にグローバルへ生やす API の型。スクリプト自体は動的に読み込むため
  // 型定義パッケージは存在せず、ここで最小限のシグネチャを手動宣言する。
  interface TurnstileRenderOptions {
    sitekey: string;
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
  }

  interface TurnstileApi {
    render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
    reset: (widgetId?: string) => void;
    remove: (widgetId: string) => void;
  }

  interface Window {
    turnstile?: TurnstileApi;
  }
}

export {};
