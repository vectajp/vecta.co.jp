import { describe, expect, test } from 'bun:test'
import { buildContactPayload, validateContactForm } from './contact'

describe('contact form validation', () => {
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
