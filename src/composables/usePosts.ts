import { computed, readonly, ref, shallowRef } from 'vue'
import * as postsApi from '@/api/posts'
import type { ExpandedPost, Post, PostInput, PostListInput } from '@/api/posts'

export type { ExpandedPost, Post, PostInput, PostListInput }

const posts = ref<Post[]>([])
const localPosts = ref<Post[]>([])
const postOverrides = ref<Record<number, Post>>({})
const deletedPostIds = ref<number[]>([])
const totalCount = shallowRef(0)
const isLoading = shallowRef(false)
const errorMessage = shallowRef('')

function applyLocalChanges(remotePosts: Post[], query = '') {
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const deletedIds = new Set(deletedPostIds.value)

  const mergedRemotePosts = remotePosts
    .filter((post) => !deletedIds.has(post.id))
    .map((post) => postOverrides.value[post.id] ?? post)

  const visibleLocalPosts = localPosts.value.filter((post) => {
    if (deletedIds.has(post.id)) {
      return false
    }

    if (!normalizedQuery) {
      return true
    }

    return post.title.toLocaleLowerCase().includes(normalizedQuery)
  })

  return [...visibleLocalPosts, ...mergedRemotePosts]
}

function rememberPost(post: Post) {
  if (post.id > 100) {
    localPosts.value = [post, ...localPosts.value.filter((item) => item.id !== post.id)]
    return
  }

  postOverrides.value = {
    ...postOverrides.value,
    [post.id]: post,
  }
}

export function usePosts() {
  const postCount = computed(() =>
    Math.max(totalCount.value + localPosts.value.length - deletedPostIds.value.length, 0),
  )

  async function loadPosts(input: PostListInput) {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const result = await postsApi.listPosts(input)

      totalCount.value = result.totalCount
      posts.value = applyLocalChanges(result.items, input.query)
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Unable to load posts.'
      posts.value = []
    } finally {
      isLoading.value = false
    }
  }

  async function findPost(id: number) {
    if (deletedPostIds.value.includes(id)) {
      return undefined
    }

    const localPost = localPosts.value.find((post) => post.id === id)

    if (localPost) {
      return localPost
    }

    const overriddenPost = postOverrides.value[id]

    if (overriddenPost) {
      return overriddenPost
    }

    try {
      return await postsApi.getPost(id)
    } catch {
      return undefined
    }
  }

  async function findExpandedPost(id: number) {
    const localPost = await findPost(id)

    if (!localPost) {
      return undefined
    }

    try {
      const expandedPost = await postsApi.getExpandedPost(id)

      return {
        ...expandedPost,
        ...localPost,
      }
    } catch {
      return localPost as ExpandedPost
    }
  }

  async function createPost(input: PostInput) {
    const post = await postsApi.createPost(input)

    rememberPost(post)

    return post
  }

  async function updatePost(id: number, input: PostInput) {
    const existingPost = await findPost(id)

    if (!existingPost) {
      return undefined
    }

    const updatedPost = await postsApi.patchPost(id, input)
    const post = { ...existingPost, ...updatedPost }

    rememberPost(post)
    posts.value = posts.value.map((item) => (item.id === id ? post : item))

    return post
  }

  async function removePost(id: number) {
    await postsApi.deletePost(id)

    deletedPostIds.value = [...new Set([...deletedPostIds.value, id])]
    posts.value = posts.value.filter((post) => post.id !== id)
    localPosts.value = localPosts.value.filter((post) => post.id !== id)
  }

  function clearError() {
    errorMessage.value = ''
  }

  return {
    posts: readonly(posts),
    postCount,
    isLoading: readonly(isLoading),
    errorMessage: readonly(errorMessage),
    loadPosts,
    findPost,
    findExpandedPost,
    createPost,
    updatePost,
    removePost,
    clearError,
  }
}
