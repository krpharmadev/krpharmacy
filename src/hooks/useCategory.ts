import useSWR from 'swr'
import { sanityClient } from '@/sanity/lib/client'
import { MAIN_CATEGORY_QUERY } from '@/sanity/lib/queries'

const CATEGORY_QUERY = `
*[_type == "category"]{
  _id,
  name,
  slug,
  "parent": parentCategory->{
    _id,
    name
  }
}
`

const fetcher = (query: string) => sanityClient.fetch(query)

export const useCategory = () => {
  const { data, error, isLoading, mutate } = useSWR(CATEGORY_QUERY, fetcher)

  return {
    categories: data,
    isLoading,
    isError: error,
    refresh: mutate,
  }
}

export const useMainCategory = () => {
  const { data, error, isLoading } = useSWR(MAIN_CATEGORY_QUERY, fetcher)

  return {
    mainCategories: data,
    isLoading,
    isError: error,
  }
}
