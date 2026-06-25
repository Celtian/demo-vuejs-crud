import { computed, readonly, ref } from 'vue'

export type Post = {
  id: number
  title: string
  body: string
}

export type PostInput = {
  title: string
  body: string
}

const posts = ref<Post[]>([
  {
    id: 1,
    title: 'First CRUD post',
    body: 'This post introduces the demo list, detail, create, and edit routes.',
  },
  {
    id: 2,
    title: 'Vue Router setup',
    body: 'Routes are configured for list, create, detail, edit, and not found pages.',
  },
  {
    id: 3,
    title: 'Reusable form component',
    body: 'The create and edit pages share one typed form component.',
  },
])

const nextId = ref(4)

export function usePosts() {
  const postCount = computed(() => posts.value.length)

  function findPost(id: number) {
    return posts.value.find((post) => post.id === id)
  }

  function createPost(input: PostInput) {
    const post = {
      id: nextId.value,
      title: input.title,
      body: input.body,
    }

    nextId.value += 1
    posts.value = [post, ...posts.value]

    return post
  }

  function updatePost(id: number, input: PostInput) {
    const postIndex = posts.value.findIndex((post) => post.id === id)

    if (postIndex === -1) {
      return undefined
    }

    const updatedPost = {
      id,
      title: input.title,
      body: input.body,
    }

    posts.value = posts.value.map((post, index) => (index === postIndex ? updatedPost : post))

    return updatedPost
  }

  return {
    posts: readonly(posts),
    postCount,
    findPost,
    createPost,
    updatePost,
  }
}
