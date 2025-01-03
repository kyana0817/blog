const url = import.meta.env.BOOKMARKLETS_URL
type Bookmarklet = {
  name: string
  source: string
  description: string
}

type Props = {
  isError: boolean
  bookmarklets: Bookmarklet[]
}
export const GETALL = async (): Promise<Props> => {
  const response = await fetch(`${url}/output.json`)
  const props: Props = {
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

  return props
}