import type { CollectionEntry } from 'astro:content'
import { marked } from 'marked'
import hljs from 'highlight.js'

export type ScrapEntry = CollectionEntry<'scrap'>

export type ScrapSection = {
  id: string
  title: string
  html: string
}

type ScrapBodyLike = {
  body?: string
}

type ScrapRenderableEntry = CollectionEntry<'scrap'>

type RawScrapSection = {
  id: string
  title: string
  body: string
}

const renderer = new marked.Renderer()

renderer.code = ({ text, lang }) => {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
  const highlighted = hljs.highlight(text, { language }).value
  const langClass = lang ? ` language-${lang}` : ''
  return `<pre><code class="hljs${langClass}">${highlighted}</code></pre>`
}

marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
})

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^a-z0-9\-ぁ-んァ-ヶ一-龠ー]/g, '')
}

export function splitScrapSections(content?: string | null) {
  if (!content) {
    return []
  }

  const lines = content.split(/\r?\n/)
  const sections: RawScrapSection[] = []
  const introLines: string[] = []
  let current: RawScrapSection | null = null
  let inCodeBlock = false

  const flush = () => {
    if (!current) {
      return
    }

    const body = current.body.trim()
    if (!body) {
      return
    }

    sections.push({
      ...current,
      body,
    })
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
      inCodeBlock = !inCodeBlock
    }

    const headingMatch = !inCodeBlock ? line.match(/^(#{1,2})\s+(.+)$/) : null

    if (headingMatch) {
      flush()
      current = {
        id: slugify(headingMatch[2]),
        title: headingMatch[2].trim(),
        body: '',
      }
      continue
    }

    if (current) {
      current.body += `${line}\n`
    } else {
      introLines.push(line)
    }
  }

  flush()

  const intro = introLines.join('\n').trim()
  const normalizedSections = intro
    ? [
        {
          id: 'intro',
          title: 'メモ',
          body: intro,
        },
        ...sections,
      ]
    : sections

  return normalizedSections.map((section) => ({
    id: section.id,
    title: section.title,
    html: marked.parse(section.body) as string,
  }))
}

export async function getScrapEntries() {
  const { getCollection } = await import('astro:content')
  return (await getCollection('scrap')).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  )
}

export async function getScrapSections(entry: ScrapBodyLike | ScrapRenderableEntry) {
  return splitScrapSections(entry.body)
}
