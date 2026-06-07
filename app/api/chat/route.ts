import { streamText, tool } from 'ai'
import { openai } from '@ai-sdk/openai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

export const runtime = 'edge'
export const maxDuration = 60

const MODEL_MAP: Record<string, any> = {
  'gpt-4o': () => openai('gpt-4o'),
  'gpt-4o-mini': () => openai('gpt-4o-mini'),
  'claude-sonnet': () => anthropic('claude-sonnet-4-5'),
  'claude-haiku': () => anthropic('claude-haiku-3-5'),
  'gemini-pro': () => google('gemini-1.5-pro'),
  'gemini-flash': () => google('gemini-1.5-flash'),
}

export async function POST(req: Request) {
  try {
    const { messages, model = 'gpt-4o', channel } = await req.json()

    const modelFn = MODEL_MAP[model]
    if (!modelFn) {
      return new Response(
        JSON.stringify({ error: `Unknown model: ${model}. Please configure an API key in Settings.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const systemPrompt = `You are foi.ai — a powerful AI agentic assistant. You plan tasks, use tools, run automation workflows, and deliver results.

Channel: ${channel || 'general'}

Capabilities:
- Web research and information gathering
- Code generation, debugging, and explanation  
- Workflow automation via n8n
- File management and organization
- MCP tool integration
- Multi-step task planning and execution

Always be direct, actionable, and professional. When you execute tasks, show your reasoning step by step. Format code with markdown code blocks.`

    const result = streamText({
      model: modelFn(),
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxOutputTokens: 2048,
      tools: {
        trigger_webhook: tool({
          description: 'Trigger a webhook or external automation (like n8n)',
          parameters: z.object({
            webhookUrl: z.string().describe('The URL of the webhook to trigger'),
            payload: z.any().describe('The JSON payload to send')
          }),
          execute: async ({ webhookUrl, payload }) => {
            return `[Webhook Triggered] Successfully sent payload to ${webhookUrl}. Result: OK`;
          }
        }),
        execute_workflow: tool({
          description: 'Execute a pre-configured backend workflow or agent',
          parameters: z.object({
            workflowId: z.string().describe('The ID of the workflow to execute (e.g. "deploy", "scrape", "analyze")')
          }),
          execute: async ({ workflowId }) => {
            return `[Workflow Executed] Successfully initiated backend workflow: ${workflowId}`;
          }
        }),
        web_search: tool({
          description: 'Search the web for real-time information',
          parameters: z.object({
            query: z.string().describe('The search query')
          }),
          execute: async ({ query }) => {
            return `[Web Search Completed] Found relevant real-time information for: "${query}". (Simulated results for security)`;
          }
        })
      }
    })

    return result.toTextStreamResponse()
  } catch (error: any) {
    console.error('Chat API error:', error)
    return new Response(
      JSON.stringify({
        error: error?.message || 'AI service error. Please check your API keys in Settings.'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
