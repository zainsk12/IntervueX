export type AppRoutePath =
  | '/'
  | '/interview/setup'
  | '/interview'
  | '/results'
  | '/evidence'
  | `/evidence/${string}`

export interface RouteDefinition {
  path: string
  label: string
  description: string
}

export interface PlaceholderPageConfig {
  title: string
  description: string
}
