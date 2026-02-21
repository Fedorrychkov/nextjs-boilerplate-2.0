import { LLM_API_KEY } from '@config/env'
import OpenAI from 'openai'

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface ChatCompletionOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export interface ChatCompletionResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export class LLMService {
  private client: OpenAI | null = null

  /**
   * Инициализация клиента OpenAI
   */
  private getClient(): OpenAI {
    if (!this.client) {
      if (!LLM_API_KEY) {
        throw new Error('LLM_API_KEY is not configured. Please set CHAT_GPT_LLM_API_KEY in environment variables.')
      }

      this.client = new OpenAI({
        apiKey: LLM_API_KEY,
      })
    }

    return this.client
  }

  /**
   * Отправка сообщения в ChatGPT
   * @param messages - Массив сообщений для диалога
   * @param options - Опции для запроса (модель, температура и т.д.)
   * @returns Ответ от ChatGPT
   */
  async chat(messages: ChatMessage[], options?: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    const client = this.getClient()

    const { model = 'gpt-4o-mini', temperature = 0.7, maxTokens = 1000, stream = false } = options || {}

    try {
      const completion = await client.chat.completions.create({
        model,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature,
        max_tokens: maxTokens,
        stream,
      })

      if (stream) {
        // Для streaming нужно обрабатывать по-другому
        throw new Error('Streaming mode is not yet implemented. Please set stream: false')
      }

      const completionWithoutStream = 'choices' in completion ? completion : undefined

      const content = completionWithoutStream?.choices[0]?.message?.content || ''
      const usage = completionWithoutStream?.usage
        ? {
            promptTokens: completionWithoutStream.usage.prompt_tokens,
            completionTokens: completionWithoutStream.usage.completion_tokens,
            totalTokens: completionWithoutStream.usage.total_tokens,
          }
        : undefined

      return {
        content,
        usage,
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`OpenAI API error: ${error.message}`)
      }

      throw new Error('Unknown error occurred while calling OpenAI API')
    }
  }

  /**
   * Стриминг ответа по чанкам (для передачи на клиент).
   * @param messages - Массив сообщений для диалога
   * @param options - Опции для запроса
   * @yields Текстовые чанки ответа
   */
  async *chatStream(messages: ChatMessage[], options?: ChatCompletionOptions): AsyncGenerator<string> {
    const client = this.getClient()
    const { model = 'gpt-4o-mini', temperature = 0.7, maxTokens = 1000 } = options || {}

    const stream = await client.chat.completions.create({
      model,
      messages: messages.map((msg) => ({ role: msg.role, content: msg.content })),
      temperature,
      max_tokens: maxTokens,
      stream: true,
    })

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? ''

      // Отдаём чанк при наличии delta или usage (usage приходит в последнем чанке, часто без delta)
      if (delta) yield delta
    }
  }

  /**
   * Простой запрос к ChatGPT (без истории диалога)
   * @param prompt - Текст запроса
   * @param systemPrompt - Системный промпт (опционально)
   * @param options - Опции для запроса
   * @returns Ответ от ChatGPT
   */
  async ask(prompt: string, systemPrompt?: string, options?: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    const messages: ChatMessage[] = []

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt,
      })
    }

    messages.push({
      role: 'user',
      content: prompt,
    })

    return this.chat(messages, options)
  }

  /**
   * Генерация текста с использованием ChatGPT
   * @param prompt - Промпт для генерации
   * @param options - Опции для запроса
   * @returns Сгенерированный текст
   */
  async generateText(prompt: string, options?: ChatCompletionOptions): Promise<string> {
    const response = await this.ask(prompt, undefined, options)

    return response.content
  }

  /**
   * Лёгкий вызов LLM для обнаружения PII и оборачивания в теги.
   * Возвращает тот же текст, где каждый фрагмент PII обёрнут в <spoiler>...</spoiler>.
   * Без стрима, та же модель — для использования во время стрима основного ответа.
   */
  async detectAndWrapPii(text: string, options?: ChatCompletionOptions): Promise<string> {
    if (!text.trim()) return text

    const systemPrompt = `You are a PII (Personally Identifiable Information) detector.
Your task is to return the EXACT same text, but wrap every PII span in <spoiler>...</spoiler>.

PII includes: email addresses, phone numbers (any format), full names, physical addresses,
IDs, card numbers, and any other data that can identify a person.

Rules:
- Return ONLY the text with PII wrapped. No explanations, no preamble.
- Do not add or remove any non-PII characters. Preserve all spaces, newlines, punctuation.
- Wrap each contiguous PII span in <spoiler>...</spoiler>.
  Example: "Contact me at john@example.com" -> "Contact me at <spoiler>john@example.com</spoiler>".
- If there is no PII, return the text unchanged.`

    const response = await this.ask(text, systemPrompt, {
      ...options,
      model: options?.model ?? 'gpt-4o-mini',
      temperature: 0,
      maxTokens: 4000,
      stream: false,
    })

    return response.content.trim()
  }

  /**
   * Получение списка доступных моделей (для отладки)
   * @returns Список моделей
   */
  async listModels(): Promise<string[]> {
    const client = this.getClient()

    try {
      const models = await client.models.list()

      return models.data.map((model) => model.id)
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to list models: ${error.message}`)
      }

      throw new Error('Unknown error occurred while listing models')
    }
  }
}

export const llmService = new LLMService()
