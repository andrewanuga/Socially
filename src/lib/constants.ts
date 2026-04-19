import type { PlatformConfig, AIModelConfig } from '../types'

export const PLATFORMS: PlatformConfig[] = [
  { id:'twitter',   name:'Twitter / X',  icon:'𝕏',  color:'#1DA1F2', connected:true,  followers:'31.7K' },
  { id:'instagram', name:'Instagram',    icon:'📸', color:'#E1306C', connected:true,  followers:'48.2K' },
  { id:'linkedin',  name:'LinkedIn',     icon:'in', color:'#0077B5', connected:true,  followers:'12.4K' },
  { id:'facebook',  name:'Facebook',     icon:'f',  color:'#1877F2', connected:false },
  { id:'tiktok',    name:'TikTok',       icon:'▶',  color:'#69C9D0', connected:false },
  { id:'whatsapp',  name:'WhatsApp',     icon:'💬', color:'#25D366', connected:false },
  { id:'pinterest', name:'Pinterest',    icon:'📌', color:'#E60023', connected:false },
  { id:'youtube',   name:'YouTube',      icon:'▷',  color:'#FF0000', connected:false },
  { id:'threads',   name:'Threads',      icon:'@',  color:'#aaaaaa', connected:false },
]

export const COMPOSE_PLATFORMS = PLATFORMS.filter(p =>
  ['twitter','instagram','linkedin','facebook','tiktok'].includes(p.id)
)

export const AI_MODELS: AIModelConfig[] = [
  { id:'gpt4o',   name:'GPT-4o',     color:'#10A37F', badge:'G',  desc:'Versatile & creative. Best for threads, storytelling and viral hooks.' },
  { id:'claude',  name:'Claude 3.5', color:'#CC785C', badge:'C',  desc:'Nuanced & thoughtful. Ideal for LinkedIn posts and brand voice.' },
  { id:'gemini',  name:'Gemini Pro', color:'#4285F4', badge:'G',  desc:'Multimodal genius. Perfect for image-rich content and visual storytelling.' },
  { id:'llama3',  name:'Llama 3',    color:'#9333EA', badge:'⚡', desc:'Open-source powerhouse. Fast and private for high-volume teams.' },
  { id:'mistral', name:'Mistral',    color:'#FF6B35', badge:'M',  desc:'Lightning-fast. Excellent multilingual and technical content.' },
]

export const CONTENT_TYPES = [
  'Instagram Caption', 'Twitter/X Thread', 'LinkedIn Post',
  'TikTok Hook', 'Facebook Post', 'YouTube Description', 'Pinterest Description',
]

export const TONE_OPTIONS = [
  'Professional', 'Casual & Fun', 'Inspirational', 'Humorous', 'Educational', 'Promotional',
]

export const PROMPT_TEMPLATES = [
  'Viral hook opener', 'Behind the scenes', 'Product benefits',
  'Thought leadership', 'Customer success story', 'Trending hashtags thread',
]
