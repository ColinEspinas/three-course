import { Quart, gsap } from 'gsap'
import { useStorage } from '../storage'

const usePresets = (current: any) => {
  const { getItem, setItem } = useStorage()

  let presets: { [name: string]: any } = getItem('presets')
  if (Object.keys(presets).length === 0) {
    presets = {
      default: structuredClone({ perlin: { ...current.perlin } }),
      volcano: {
        perlin: {
          redhell: false,
          size: 0.7,
          waves: 0.6,
          complex: 1.0,
          displace: 0.3,
          eqcolor: 9.0,
          rcolor: 0.85,
          gcolor: 0.05,
          bcolor: 0.32,
        },
      },
      cloud: {
        perlin: {
          redhell: true,
          size: 1.0,
          waves: 20.0,
          complex: 0.1,
          displace: 0.1,
          eqcolor: 4.0,
          rcolor: 1.5,
          gcolor: 0.7,
          bcolor: 1.5,
        },
      },
      tornasol: {
        perlin: {
          redhell: true,
          size: 1.0,
          waves: 3.0,
          complex: 0.65,
          displace: 0.5,
          eqcolor: 9.5,
          rcolor: 1.5,
          gcolor: 1.5,
          bcolor: 1.5,
        },
      },
    }
    setItem('presets', presets)
  }

  const createPreset = (name: string) => {
    presets[name] = structuredClone({ perlin: { ...current.perlin } })
    setItem('presets', presets)
  }

  const applyPreset = (name: string) => {
    const preset = presets[name]
    current.perlin.redhell = preset.perlin.redhell // 10 1 0.1 1.2
    gsap.to(current.perlin, 1, {
      ease: Quart.easeInOut,
      ...preset.perlin,
    })
  }

  return {
    createPreset,
    applyPreset,
    presets,
  }
}

export { usePresets }
