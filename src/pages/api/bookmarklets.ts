const url = import.meta.env.SECRET_BOOKMARKLETS_URL
type Bookmarklet = {
  name: string
  source: string
  description: string
}

export type GetBookmarkletResponse = {
  isError: boolean
  bookmarklets: Bookmarklet[]
}


export const GET = async (): Promise<Response> => {
  const response = await fetch(`${url}/output.json`)
  const props: GetBookmarkletResponse = {
    isError: false,
    bookmarklets: []
  }
  if (!response.ok) props.isError = true

  const output = (await response.json()) as {name: string, description: string}[]

  
  try {
    for (const {name, description} of output) {
      const source = await (await fetch(`${url}/dist/${name}`)).text()
      props.bookmarklets.push({
        name,
        description,
        source,
      })
    }
  } catch {
    props.isError = true
  }
  return new Response(JSON.stringify(props))
}