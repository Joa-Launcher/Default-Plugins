import {HubConnection} from "@microsoft/signalr";

export type ContextAction =
{
    id: string,
    name: string,
    key: string
}

export const updateSearchResults = "UpdateSearchResults";
export const goToStep = "GoToStep";
export const executeSearchResult = "ExecuteSearchResult";

export const receiveSearchResults = "ReceiveSearchResults";
export const updateSteps = "UpdateSteps";

export type SearchResult = {
    title: string,
    description: string,
    icon: string,
    webIcon: string
    actions: ContextAction[]
}

export type PluginSearchResult = {
    commandId: string,
    searchResult: SearchResult,
}

export type FeatureProps = {
    connection: HubConnection
}


