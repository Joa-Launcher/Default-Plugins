import ContextAction from "./contextAction";

export default interface SearchResult {
    title: string,
    description: string,
    icon: string,
    webIcon: string
    actions: ContextAction[]
}
