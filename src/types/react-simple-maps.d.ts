declare module 'react-simple-maps' {
  import type { ReactNode, SVGProps, MouseEvent } from 'react'

  interface ComposableMapProps {
    projection?: string
    projectionConfig?: Record<string, unknown>
    width?: number
    height?: number
    style?: React.CSSProperties
    children?: ReactNode
  }
  export function ComposableMap(props: ComposableMapProps): JSX.Element

  interface LineProps extends SVGProps<SVGPathElement> {
    from: [number, number]
    to: [number, number]
  }
  export function Line(props: LineProps): JSX.Element

  interface ZoomableGroupProps {
    zoom?: number
    center?: [number, number]
    minZoom?: number
    maxZoom?: number
    onMoveEnd?: (position: { coordinates: [number, number]; zoom: number }) => void
    children?: ReactNode
  }
  export function ZoomableGroup(props: ZoomableGroupProps): JSX.Element

  interface GeographiesProps {
    geography: string | Record<string, unknown>
    children: (args: { geographies: GeoEntry[] }) => ReactNode
  }
  export function Geographies(props: GeographiesProps): JSX.Element

  interface GeoEntry {
    rsmKey: string
    properties: Record<string, string>
    [key: string]: unknown
  }

  interface GeographyProps extends SVGProps<SVGPathElement> {
    geography: GeoEntry
    style?: {
      default?: React.CSSProperties
      hover?: React.CSSProperties
      pressed?: React.CSSProperties
    }
  }
  export function Geography(props: GeographyProps): JSX.Element

  interface MarkerProps {
    coordinates: [number, number]
    children?: ReactNode
    onMouseEnter?: (e: MouseEvent<SVGGElement>) => void
    onMouseLeave?: (e: MouseEvent<SVGGElement>) => void
    onClick?: (e: MouseEvent<SVGGElement>) => void
  }
  export function Marker(props: MarkerProps): JSX.Element
}
