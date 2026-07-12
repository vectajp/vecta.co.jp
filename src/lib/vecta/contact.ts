export type ContactFormValues = {
  name: string
  email: string
  company: string
  phone: string
  subject: string
  message: string
}

export type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>

export type ContactValidationResult = {
  valid: boolean
  errors: ContactFormErrors
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^[\d+()-]+$/

export const emptyContactFormValues = (): ContactFormValues => ({
  name: '',
  email: '',
  company: '',
  phone: '',
  subject: '',
  message: '',
})

export const buildContactPayload = (
  values: ContactFormValues,
): ContactFormValues => ({
  name: values.name.trim(),
  email: values.email.trim(),
  company: values.company.trim(),
  phone: values.phone.trim(),
  subject: values.subject.trim(),
  message: values.message.trim(),
})

export const validateContactForm = (
  values: ContactFormValues,
): ContactValidationResult => {
  const errors: ContactFormErrors = {}
  const payload = buildContactPayload(values)

  if (!payload.name) {
    errors.name = 'お名前を入力してください'
  } else if (payload.name.length > 100) {
    errors.name = 'お名前は100文字以内で入力してください'
  }

  if (!payload.email) {
    errors.email = 'メールアドレスを入力してください'
  } else if (!EMAIL_PATTERN.test(payload.email)) {
    errors.email = '有効なメールアドレスを入力してください'
  }

  if (payload.phone && !PHONE_PATTERN.test(payload.phone)) {
    errors.phone = '有効な電話番号を入力してください'
  }

  if (!payload.subject) {
    errors.subject = '件名を入力してください'
  } else if (payload.subject.length > 200) {
    errors.subject = '件名は200文字以内で入力してください'
  }

  if (!payload.message) {
    errors.message = 'メッセージを入力してください'
  } else if (payload.message.length > 1000) {
    errors.message = 'メッセージは1000文字以内で入力してください'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
