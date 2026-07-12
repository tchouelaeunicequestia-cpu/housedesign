import { CollectionConfig } from 'payload';

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: { useAsTitle: 'title' },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'status', type: 'select', options: ['Completed', 'In-Progress'] },
    { name: 'description', type: 'richText' },
    { name: 'softwareUsed', type: 'text' },
  ],
};
