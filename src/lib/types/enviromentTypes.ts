import type {
  WebGLCubeRenderTarget,
  EquirectangularReflectionMapping,
  CubeTextureLoader,
  Texture,
  Scene,
  Loader,
  CubeCamera,
  HalfFloatType,
  CubeReflectionMapping,
  CubeTexture,
  sRGBEncoding,
  LinearEncoding,
  TextureEncoding,
} from 'three'
import type {PresetsType } from '../utils/environment-assets'

export type Props = {
    frames?: number
    near?: number
    far?: number
    resolution?: number
    background?: boolean | 'only'
    map: Texture | null
    files?: string | string[]
    path?: string
    preset?: PresetsType
    ground?:
      | boolean
      | {
          radius?: number
          height?: number
          scale?: number
        }
    encoding?: TextureEncoding
  } 