import path from 'node:path'

import { type FileSpec, type Names } from '../../../types'

export const buildCardSCSS = ({ PascalCase }: Names, entityDir: string): FileSpec => ({
  relativePath: path.join(entityDir, 'ui', `${PascalCase}Card`, `${PascalCase}Card.module.scss`),
  content: `.root {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(128, 128, 128, 0.18);
  border-radius: 18px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.16s ease,
    transform 0.16s ease,
    box-shadow 0.16s ease;

  &:hover:not(:disabled) {
    border-color: rgba(128, 128, 128, 0.36);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &:disabled {
    cursor: default;
  }
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
}

.overline {
  min-width: 0;
}

.title {
  display: -webkit-box;
  overflow: hidden;
  overflow-wrap: anywhere;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.subtitle {
  margin-top: auto;
}

.meta {
  min-width: 0;
  color: rgba(128, 128, 128, 0.92);
}

.after {
  align-self: flex-start;
}
`
})
