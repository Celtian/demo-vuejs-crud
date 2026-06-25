import { inject, type InjectionKey, type Ref } from 'vue'

export type Messages = Record<string, string>

export const fallbackMessages: Messages = {
  'actions.cancel': 'Cancel',
  'actions.clearFilters': 'Clear filters',
  'actions.create': 'Create',
  'actions.delete': 'Delete',
  'actions.detail': 'Detail',
  'actions.edit': 'Edit',
  'actions.saveChanges': 'Save changes',
  'app.rights': '',
  'app.title': 'CRUD Demo',
  'confirm.deletePost.message': 'Do you want to delete post?',
  'confirm.deletePost.title': 'Delete post',
  'common.no': 'No',
  'common.yes': 'Yes',
  'errors.loadPosts': 'Unable to load posts.',
  'form.body': 'Body',
  'form.bodyPlaceholder': 'Write the post body',
  'form.required': 'required',
  'form.title': 'Title',
  'form.titlePlaceholder': 'Post title',
  'language.switch': 'Switch language',
  'notFound.backToPosts': 'Back to posts',
  'notFound.description': 'The page you are looking for does not exist.',
  'notFound.title': 'Page not found',
  'pagination.itemsPerPage': 'Items per page',
  'pagination.label': 'Pagination',
  'pagination.nextPage': 'Next page',
  'pagination.previousPage': 'Previous page',
  'pagination.range': '{first} - {last} from {total}',
  'post.byUser': 'By {name}',
  'post.createHeading': 'Create post',
  'post.detailHeading': 'Post detail',
  'post.editHeading': 'Edit post',
  'post.newPost': 'New post',
  'post.notEditable': 'This post cannot be edited.',
  'post.notFound': 'Post not found',
  'post.notFoundDescription': 'This post does not exist.',
  'post.number': 'Post #{id}',
  'postActions.label': 'Post actions',
  'postForm.create': 'Create post',
  'postList.noPosts': 'No posts found.',
  'postList.search': 'Search',
  'postList.searchPlaceholder': 'Search by title or body',
  'table.actions': 'Actions',
  'table.body': 'Body',
  'table.title': 'Title',
  'title.create': 'Create post | CRUD Demo',
  'title.detail': 'Post detail | CRUD Demo',
  'title.edit': 'Edit post | CRUD Demo',
  'title.list': 'Posts | CRUD Demo',
  'title.notFound': 'Page not found | CRUD Demo',
}

export const messagesKey: InjectionKey<Ref<Messages>> = Symbol('messages')

export function interpolate(message: string, values: Record<string, string | number> = {}) {
  return message.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? `{${key}}`))
}

export function useTranslations() {
  const messages = inject(messagesKey)

  function t(key: string, values?: Record<string, string | number>) {
    const message = messages?.value[key] ?? fallbackMessages[key] ?? key

    return interpolate(message, values)
  }

  return { t }
}
