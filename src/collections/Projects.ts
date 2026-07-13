import { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'status', type: 'select', options: ['Completed', 'In-Progress'] },
    {
      name: 'description',
      type: 'richText',
      editor: lexicalEditor(),
    },
    { name: 'softwareUsed', type: 'text' },
  ],
}
