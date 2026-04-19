export type Platform =
  | 'twitter' | 'instagram' | 'linkedin' | 'facebook'
  | 'tiktok'  | 'whatsapp'  | 'pinterest'| 'youtube' | 'threads'

export type AIModel    = 'gpt4o' | 'claude' | 'gemini' | 'llama3' | 'mistral'
export type PostStatus = 'published' | 'scheduled' | 'draft'
export type DashPanel  =
  | 'overview' | 'compose'  | 'buffer'  | 'analytics'
  | 'ai-creator' | 'media'  | 'connections' | 'settings'

export interface PlatformConfig {
  id: Platform; name: string; icon: string
  color: string; connected: boolean; followers?: string
}
export interface AIModelConfig {
  id: AIModel; name: string; color: string; badge: string; desc: string
}
export interface ToastItem {
  id: string; message: string; icon?: string
}
