import {
    TextureLoader,
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
} from 'three' ;
  
   export async function useTexture (files: string | string[] , path: string ){
   
   const isCubeMap = Array.isArray(files)
        if (Array.isArray(files)) { 
           const loader =  new CubeTextureLoader();
           loader.setPath(path);
           loader.load (files);
           return loader;
        }
        else {
           const texture = new TextureLoader().load( files );
           return texture;
        }
   }