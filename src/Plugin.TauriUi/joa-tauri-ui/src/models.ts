
type ContextAction =
{
    id: string,
    name: string,
    key: string
}



type SearchResult = {
    title: string,
    description: string,
    icon: string,
    webIcon?: string
    actions: ContextAction[]
}

type PluginSearchResult = {
    commandId: string,
    searchResult: SearchResult,
}

type Step = {
    name: string,
    id: string
}

export type {ContextAction, SearchResult, PluginSearchResult, Step}



