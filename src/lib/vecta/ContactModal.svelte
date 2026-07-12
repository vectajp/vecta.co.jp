<script lang="ts">
  import ContactForm from './ContactForm.svelte'

  type Props = {
    open: boolean
    onClose: () => void
  }

  let { open, onClose }: Props = $props()
  let closeButton: HTMLButtonElement | undefined = $state()

  const handleBackdropClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  $effect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButton?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
    }
  })
</script>

<svelte:window
  onkeydown={(event) => open && event.key === 'Escape' && onClose()}
/>

{#if open}
  <div
    class="modal-backdrop"
    role="dialog"
    aria-modal="true"
    aria-labelledby="contact-modal-title"
    tabindex="-1"
    onclick={handleBackdropClick}
    onkeydown={(event) => event.key === 'Escape' && onClose()}
  >
    <div class="modal-panel" role="document">
      <button
        type="button"
        class="modal-close"
        bind:this={closeButton}
        onclick={onClose}
        aria-label="閉じる"
      >
        ×
      </button>

      <div class="modal-body">
        <p class="modal-kicker">Contact</p>
        <h3 id="contact-modal-title">Vectaに相談する</h3>
        <p class="modal-lead">
          自治体・公共領域でのAI活用、地域情報の整理、庁内ナレッジの継承など、構想段階からご相談ください。
        </p>
        <div class="modal-form">
          <ContactForm idPrefix="contact-modal" />
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: rgba(9, 27, 51, 0.46);
    backdrop-filter: blur(3px);
  }

  .modal-panel {
    position: relative;
    width: min(100%, 720px);
    max-height: min(92vh, 900px);
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.66);
    border-radius: 8px;
    background: linear-gradient(180deg, var(--color-white) 0%, #f8f9f5 100%);
    box-shadow: 0 30px 80px rgba(9, 27, 51, 0.28);
  }

  .modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.35rem;
    height: 2.35rem;
    border: 1px solid var(--color-line);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.86);
    color: var(--color-indigo);
    cursor: pointer;
    font: inherit;
    font-size: 1.35rem;
    line-height: 1;
  }

  .modal-close:hover {
    background: var(--color-amber-soft);
  }

  .modal-body {
    padding: clamp(1.5rem, 4vw, 2.4rem);
  }

  .modal-kicker {
    color: var(--color-vector-blue);
    font-family: var(--font-monospace);
    font-size: 0.8rem;
    font-weight: 700;
    margin: 0 0 0.55rem;
    text-transform: uppercase;
  }

  .modal-body h3 {
    color: var(--color-indigo);
    font-size: clamp(1.45rem, 4vw, 1.9rem);
    line-height: 1.35;
    margin: 0 2.7rem 0.7rem 0;
  }

  .modal-lead {
    color: var(--color-medium-text);
    line-height: 1.85;
    margin: 0 2.7rem 1.35rem 0;
  }

  .modal-form {
    padding-top: 0.25rem;
  }

  @media (max-width: 480px) {
    .modal-backdrop {
      align-items: stretch;
      padding: 0.75rem;
    }

    .modal-panel {
      max-height: calc(100vh - 1.5rem);
    }

    .modal-lead {
      margin-right: 0;
    }
  }
</style>
