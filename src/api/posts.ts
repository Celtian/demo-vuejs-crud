export type Pagination<T> = {
  totalCount: number
  items: T[]
}

export type Post = {
  id: number
  userId: number
  title: string
  body: string
}

export type PostInput = {
  title: string
  body: string
  userId?: number
}

export type User = {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
}

export type ExpandedPost = Post & {
  user?: User
}

export type PostListInput = {
  page: number
  limit: number
  sort: keyof Post
  order: 'asc' | 'desc'
  query: string
}

const apiUrl = 'https://jsonplaceholder.typicode.com'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function listPosts(input: PostListInput): Promise<Pagination<Post>> {
  const params = new URLSearchParams({
    _limit: String(input.limit),
    _sort: input.sort,
    _order: input.order,
  })

  if (input.page > 0) {
    params.set('_page', String(input.page))
  }

  if (input.query.trim()) {
    params.set('title_like', input.query.trim())
  }

  const response = await fetch(`${apiUrl}/posts?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return {
    totalCount: Number(response.headers.get('x-total-count')) || 0,
    items: (await response.json()) as Post[],
  }
}

export function getPost(id: number): Promise<Post> {
  return request<Post>(`/posts/${id}`)
}

export function deletePost(id: number): Promise<void> {
  return request<void>(`/posts/${id}`, {
    method: 'DELETE',
  })
}

export function patchPost(id: number, body: Partial<Post>): Promise<Post> {
  return request<Post>(`/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export function createPost(post: PostInput): Promise<Post> {
  return request<Post>('/posts', {
    method: 'POST',
    body: JSON.stringify({
      userId: 1,
      ...post,
    }),
  })
}

export function getExpandedPost(id: number): Promise<ExpandedPost> {
  return request<ExpandedPost>(`/posts/${id}?_expand=user`)
}

export function getUser(id: number): Promise<User> {
  return request<User>(`/users/${id}`)
}
