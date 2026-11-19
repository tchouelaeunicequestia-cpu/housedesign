/**
 * Talks to the AI provider over plain HTTPS (no extra npm package needed).
 * Works with Anthropic (Claude) or OpenAI. If both keys exist, Anthropic is used,
 * unless AI_PROVIDER=openai is set.
 *
 * It has no framework imports, so it can be tested on its own.
 */
export type EnvGetter = (key: string) => string | undefined;

export interface LoggerLike {
  warn(message: string): void;
  error(message: string): void;
}

export type AiProvider = 'anthropic' | 'openai';

const REQUEST_TIMEOUT_MS = 60_000;

export class AiClient {
  constructor(
    protected readonly env: EnvGetter,
    protected readonly log: LoggerLike = console,
  ) {}

  private key(name: string): string | undefined {
    const value = this.env(name)?.trim();
    return value && value !== 'dummy-key' ? value : undefined;
  }

  get provider(): AiProvider | null {
    const wanted = this.env('AI_PROVIDER')?.trim().toLowerCase();
    const anthropic = this.key('ANTHROPIC_API_KEY');
    const openai = this.key('OPENAI_API_KEY');
    if (wanted === 'openai') return openai ? 'openai' : null;
    if (wanted === 'anthropic') return anthropic ? 'anthropic' : null;
    return anthropic ? 'anthropic' : openai ? 'openai' : null;
  }

  get isEnabled(): boolean {
    return this.provider !== null;
  }

  /** Image generation uses OpenAI and must be switched on with AI_IMAGE_ENABLED=true. */
  get imageEnabled(): boolean {
    return this.env('AI_IMAGE_ENABLED')?.trim() === 'true' && this.key('OPENAI_API_KEY') !== undefined;
  }

  /** Returns the AI's text answer, or null if the AI is off or the request failed. */
  async complete(system: string, user: string, maxTokens = 900): Promise<string | null> {
    const provider = this.provider;
    if (!provider) return null;

    try {
      if (provider === 'anthropic') {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'x-api-key': this.key('ANTHROPIC_API_KEY') as string,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: this.env('AI_MODEL')?.trim() || 'claude-sonnet-5-5',
            max_tokens: maxTokens,
            system,
            messages: [{ role: 'user', content: user }],
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
        if (!response.ok) return this.fail('Anthropic', response);
        const data = (await response.json()) as { content?: { type?: string; text?: string }[] };
        const text = (data.content ?? [])
          .filter((block) => block.type === 'text' && typeof block.text === 'string')
          .map((block) => block.text)
          .join('\n')
          .trim();
        return text || null;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${this.key('OPENAI_API_KEY')}`,
        },
        body: JSON.stringify({
          model: this.env('AI_MODEL')?.trim() || 'gpt-4o-mini',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      });
      if (!response.ok) return this.fail('OpenAI', response);
      const data = (await response.json()) as { choices?: { message?: { content?: string } }[] };
      return data.choices?.[0]?.message?.content?.trim() || null;
    } catch (error) {
      this.log.error(`AI request failed: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /** Returns a PNG/JPEG image as bytes, or null if images are off or the request failed. */
  async generateImage(prompt: string): Promise<Buffer | null> {
    if (!this.imageEnabled) return null;

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${this.key('OPENAI_API_KEY')}`,
        },
        body: JSON.stringify({
          model: this.env('AI_IMAGE_MODEL')?.trim() || 'gpt-image-1',
          prompt,
          size: '1536x1024',
          n: 1,
        }),
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS * 2),
      });
      if (!response.ok) {
        await this.fail('OpenAI image', response);
        return null;
      }
      const data = (await response.json()) as { data?: { b64_json?: string; url?: string }[] };
      const item = data.data?.[0];
      if (item?.b64_json) return Buffer.from(item.b64_json, 'base64');
      if (item?.url) {
        const image = await fetch(item.url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
        return image.ok ? Buffer.from(await image.arrayBuffer()) : null;
      }
      return null;
    } catch (error) {
      this.log.error(`AI image request failed: ${error instanceof Error ? error.message : String(error)}`);
      return null;
    }
  }

  /** Logs the provider's error message (never the request, so the key cannot leak). */
  private async fail(name: string, response: Response): Promise<null> {
    let detail = '';
    try {
      detail = (await response.text()).slice(0, 300);
    } catch {
      /* ignore */
    }
    this.log.error(`${name} returned HTTP ${response.status}. ${detail}`);
    return null;
  }
}
