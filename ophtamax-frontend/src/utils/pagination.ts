import type { PageMeta } from '@/api/types/auth'

export const PAGE_SIZE = 10

export interface PageResult<T> {
  items: T[]
  page: number
  perPage: number
  total: number
  impayes?: number
}

export function slicePage<T>(items: T[], page: number, perPage = PAGE_SIZE): PageResult<T> {
  const safePage = Math.max(1, page)
  const start = (safePage - 1) * perPage
  return {
    items: items.slice(start, start + perPage),
    page: safePage,
    perPage,
    total: items.length,
  }
}

export function pageFromResponse<T>(
  payload: { data: T[]; meta?: PageMeta },
  page: number,
  perPage = PAGE_SIZE,
): PageResult<T> {
  if (payload.meta) {
    return {
      items: payload.data,
      page: payload.meta.page,
      perPage: payload.meta.per_page,
      total: payload.meta.total,
      impayes: payload.meta.impayes,
    }
  }
  return slicePage(payload.data, page, perPage)
}
