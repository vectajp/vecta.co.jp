<script lang="ts">
  import {
    buildContactPayload,
    type ContactFormValues,
    emptyContactFormValues,
    validateContactForm,
  } from './contact'

  type FieldName = keyof ContactFormValues

  const fields: FieldName[] = [
    'name',
    'email',
    'company',
    'phone',
    'subject',
    'message',
  ]

  const emptyTouched = (): Record<FieldName, boolean> => ({
    name: false,
    email: false,
    company: false,
    phone: false,
    subject: false,
    message: false,
  })

  let values = $state<ContactFormValues>(emptyContactFormValues())
  let touched = $state<Record<FieldName, boolean>>(emptyTouched())
  let submitting = $state(false)
  let successMessageVisible = $state(false)
  let generalError = $state('')
  let successTimer: ReturnType<typeof setTimeout> | undefined

  const validation = $derived(validateContactForm(values))

  const fieldId = (field: FieldName) => `contact-${field}`

  const visibleError = (field: FieldName) =>
    touched[field] ? validation.errors[field] : undefined

  const markTouched = (field: FieldName) => {
    touched[field] = true
  }

  const markAllTouched = () => {
    for (const field of fields) {
      touched[field] = true
    }
  }

  const resetMessages = () => {
    successMessageVisible = false
    generalError = ''
    if (successTimer) {
      clearTimeout(successTimer)
      successTimer = undefined
    }
  }

  const resetForm = () => {
    values = emptyContactFormValues()
    touched = emptyTouched()
  }

  const submitContact = async (event: SubmitEvent) => {
    event.preventDefault()
    resetMessages()
    markAllTouched()

    const result = validateContactForm(values)
    if (!result.valid) {
      return
    }

    const apiBaseUrl = import.meta.env.PUBLIC_API_BASE_URL
    if (!apiBaseUrl) {
      generalError = '送信先 API が設定されていません。'
      return
    }

    submitting = true
    try {
      const response = await fetch(
        `${apiBaseUrl.replace(/\/$/, '')}/contacts`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(buildContactPayload(values)),
        },
      )

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      resetForm()
      successMessageVisible = true
      successTimer = setTimeout(() => {
        successMessageVisible = false
        successTimer = undefined
      }, 5000)
    } catch {
      generalError =
        '送信中にエラーが発生しました。しばらく経ってから再度お試しください。'
    } finally {
      submitting = false
    }
  }
</script>

<form class="contact-form" onsubmit={submitContact} novalidate>
  <div class="form-group">
    <label for={fieldId('name')}>お名前 <span class="required">*</span></label>
    <input
      class:error={visibleError('name')}
      type="text"
      id={fieldId('name')}
      name="name"
      autocomplete="name"
      bind:value={values.name}
      onblur={() => markTouched('name')}
      required
    >
    <span class="error-message">{visibleError('name') ?? ''}</span>
  </div>

  <div class="form-group">
    <label for={fieldId('email')}
      >メールアドレス <span class="required">*</span></label
    >
    <input
      class:error={visibleError('email')}
      type="email"
      id={fieldId('email')}
      name="email"
      autocomplete="email"
      bind:value={values.email}
      onblur={() => markTouched('email')}
      required
    >
    <span class="error-message">{visibleError('email') ?? ''}</span>
  </div>

  <div class="form-group">
    <label for={fieldId('company')}>会社名</label>
    <input
      type="text"
      id={fieldId('company')}
      name="company"
      autocomplete="organization"
      bind:value={values.company}
      onblur={() => markTouched('company')}
    >
  </div>

  <div class="form-group">
    <label for={fieldId('phone')}>電話番号</label>
    <input
      class:error={visibleError('phone')}
      type="tel"
      id={fieldId('phone')}
      name="phone"
      autocomplete="tel"
      bind:value={values.phone}
      onblur={() => markTouched('phone')}
    >
    <span class="error-message">{visibleError('phone') ?? ''}</span>
  </div>

  <div class="form-group">
    <label for={fieldId('subject')}>件名 <span class="required">*</span></label>
    <input
      class:error={visibleError('subject')}
      type="text"
      id={fieldId('subject')}
      name="subject"
      bind:value={values.subject}
      onblur={() => markTouched('subject')}
      required
    >
    <span class="error-message">{visibleError('subject') ?? ''}</span>
  </div>

  <div class="form-group">
    <label for={fieldId('message')}
      >メッセージ <span class="required">*</span></label
    >
    <textarea
      class:error={visibleError('message')}
      id={fieldId('message')}
      name="message"
      rows="5"
      bind:value={values.message}
      onblur={() => markTouched('message')}
      required
    ></textarea>
    <span class="error-message">{visibleError('message') ?? ''}</span>
  </div>

  <button type="submit" class="button button-submit" disabled={submitting}>
    {submitting ? '送信中...' : '送信する'}
  </button>

  <div class="message-region" aria-live="polite">
    {#if successMessageVisible}
      <div class="success-message">
        <p>
          お問い合わせありがとうございます。担当者より折り返しご連絡いたします。
        </p>
      </div>
    {/if}

    {#if generalError}
      <div class="error-message-general">
        <p>{generalError}</p>
      </div>
    {/if}
  </div>
</form>

<style>
  .contact-form {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-group label {
    color: var(--color-indigo);
    font-size: 0.92rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    border: 1px solid var(--color-line-strong);
    border-radius: 8px;
    background: var(--color-white);
    font: inherit;
    padding: 0.86rem 0.9rem;
    transition:
      background-color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .form-group textarea {
    resize: vertical;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    background-color: var(--color-paper);
    border-color: var(--color-vector-blue);
    box-shadow: 0 0 0 4px rgba(47, 111, 237, 0.14);
    outline: none;
  }

  .form-group input.error,
  .form-group textarea.error {
    border-color: #dc3545;
  }

  .required {
    color: var(--color-vector-blue);
    font-weight: 700;
  }

  .error-message {
    color: #dc3545;
    display: block;
    font-size: 0.875rem;
    margin-top: 0.25rem;
    min-height: 1.2em;
  }

  .message-region {
    min-height: 0;
  }

  .success-message,
  .error-message-general {
    border-radius: 8px;
    padding: 1rem;
  }

  .success-message {
    background-color: #e7f7ee;
    border: 1px solid #b7e3c8;
    color: #14552b;
  }

  .error-message-general {
    background-color: #fff0f1;
    border: 1px solid #f5b8c1;
    color: #8a1f2d;
  }

  .success-message p,
  .error-message-general p {
    margin: 0;
  }

  @media (min-width: 769px) {
    .contact-form {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1rem 1.1rem;
    }

    .form-group:nth-of-type(5),
    .form-group:nth-of-type(6),
    .button-submit,
    .message-region {
      grid-column: 1 / -1;
    }

    .button-submit {
      justify-self: stretch;
      width: 100%;
    }
  }
</style>
