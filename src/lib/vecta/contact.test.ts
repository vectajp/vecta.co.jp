import { describe, expect, test } from 'bun:test'
import { buildContactPayload, validateContactForm } from './contact'

describe('contact form validation', () => {
  test('keeps the source product and page in saved contact fields', () => {
    const values = {
      name: '山田 太郎',
      email: 'taro@example.com',
      company: 'Example',
      phone: '',
      subject: ' 導入相談 ',
      message: ' 質問本文 ',
    }
    for (const product of ['chat', 'call'] as const) {
      const payload = buildContactPayload(values, product)
      expect(payload.subject).toBe(
        `[${product === 'chat' ? 'SwarrowChat' : 'SwarrowCall'}] 導入相談`,
      )
      expect(payload.message).toBe(
        `送信元ページ: https://swarrow.com/${product}\n\n質問本文`,
      )
      expect(payload.email).toBe(values.email)
    }
  })
  test('validates API length limits after source metadata is added', () => {
    const values = {
      name: 'QA',
      email: 'qa@example.com',
      company: '',
      phone: '',
      subject: '件'.repeat(200),
      message: '文'.repeat(1000),
    }
    expect(validateContactForm(values).valid).toBe(true)
    for (const product of ['chat', 'call'] as const) {
      expect(validateContactForm(values, product).valid).toBe(false)
      expect(
        validateContactForm({ ...values, subject: '', message: '' }, product)
          .errors.subject,
      ).toBe('件名を入力してください')
      const overhead = buildContactPayload(
        { ...values, subject: '', message: '' },
        product,
      )
      const accepted = {
        ...values,
        subject: '件'.repeat(200 - overhead.subject.length),
        message: '文'.repeat(1000 - overhead.message.length),
      }
      expect(validateContactForm(accepted, product).valid).toBe(true)
      expect(buildContactPayload(accepted, product).message.length).toBe(1000)
    }
  })
  test('requires name email subject and message', () => {
    const result = validateContactForm({
      name: '',
      email: '',
      company: '',
      phone: '',
      subject: '',
      message: '',
    })

    expect(result.valid).toBe(false)
    expect(result.errors.name).toBe('お名前を入力してください')
    expect(result.errors.email).toBe('メールアドレスを入力してください')
    expect(result.errors.subject).toBe('件名を入力してください')
    expect(result.errors.message).toBe('メッセージを入力してください')
  })

  test('builds the existing API payload shape', () => {
    expect(
      buildContactPayload({
        name: '山田 太郎',
        email: 'taro@example.com',
        company: 'Example',
        phone: '03-1234-5678',
        subject: '相談',
        message: '問い合わせ内容',
      }),
    ).toEqual({
      name: '山田 太郎',
      email: 'taro@example.com',
      company: 'Example',
      phone: '03-1234-5678',
      subject: '相談',
      message: '問い合わせ内容',
    })
  })
})
