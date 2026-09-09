import * as THREE from 'three/webgpu'
import { Cycles } from './Cycles.js'

const presets = {
    day:   { revealColor: new THREE.Color('#5f7dff'), revealIntensity: 12, electricField: 0, temperature: 5, lightColor: new THREE.Color('#ffe4b8'), lightIntensity: 1.2, shadowColor: new THREE.Color('#788a7a'), fogColorA: new THREE.Color('#c1ddd6'), fogColorB: new THREE.Color('#c7cbb5'), fogNearRatio: 0.315, fogFarRatio: 1.25 },
    dusk:  { revealColor: new THREE.Color('#ff86d9'), revealIntensity: 5.55, electricField: 0.25, temperature: 0, lightColor: new THREE.Color('#ff8181'), lightIntensity: 1.2, shadowColor: new THREE.Color('#6f5c75'), fogColorA: new THREE.Color('#a1b4bc'), fogColorB: new THREE.Color('#d9ab91'), fogNearRatio: 0, fogFarRatio: 1.25 },
    night: { revealColor: new THREE.Color('#b678ff'), revealIntensity: 10, electricField: 1, temperature: -7.5, lightColor: new THREE.Color('#7792af'), lightIntensity: 1.5, shadowColor: new THREE.Color('#263448'), fogColorA: new THREE.Color('#253e49'), fogColorB: new THREE.Color('#333d45'), fogNearRatio: -0.85, fogFarRatio: 1 },
    dawn:  { revealColor: new THREE.Color('#ff9d9d'), revealIntensity: 4.85, electricField: 0.25, temperature: 0, lightColor: new THREE.Color('#ffa882'), lightIntensity: 1.2, shadowColor: new THREE.Color('#866770'), fogColorA: new THREE.Color('#d3b8b1'), fogColorB: new THREE.Color('#edc599'), fogNearRatio: 0.3, fogFarRatio: 1.25 },
}

export class DayCycles extends Cycles
{
    constructor()
    {
        const forcedProgress = import.meta.env.VITE_DAY_CYCLE_PROGRESS ? parseFloat(import.meta.env.VITE_DAY_CYCLE_PROGRESS) : null
        super('🕜 Day Cycles', 12 * 60, 0.08, false)
        this.newAbsoluteProgressBinding.update = () => { this.newAbsoluteProgress = 0.08 + this.game.ticker.elapsed / this.duration }
    }

    get presets()
    {
        return presets
    }

    getKeyframesDescriptions()
    {
        // Debug
        if(this.game.debug.active)
        {
            this.debugPanel.addBinding(this, 'duration', { min: 1, max: 60 * 10, step: 1 })

            for(const presetKey in presets)
            {
                const preset = presets[presetKey]
                const presetsDebugPanel = this.debugPanel.addFolder({
                    title: presetKey,
                    expanded: true,
                })

                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.revealColor, 'revealColor')
                presetsDebugPanel.addBinding(preset, 'revealIntensity', { min: 0, max: 20, step: 0.001 })
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.lightColor, 'lightColor')
                presetsDebugPanel.addBinding(preset, 'lightIntensity', { min: 0, max: 20 })
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.shadowColor, 'shadowColor')
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.fogColorA, 'fogColorA')
                this.game.debug.addThreeColorBinding(presetsDebugPanel, preset.fogColorB, 'fogColorB')
                presetsDebugPanel.addBinding(preset, 'fogNearRatio', { label: 'near', min: -2, max: 2, step: 0.001 })
                presetsDebugPanel.addBinding(preset, 'fogFarRatio', { label: 'far', min: -2, max: 2, step: 0.001 })
            }
        }

        return [
            [
                { properties: presets.day, stop: 0.0 }, // day
                { properties: presets.day, stop: 0.15 }, // day
                { properties: presets.dusk, stop: 0.25 }, // Dusk
                { properties: presets.night, stop: 0.35 }, // Night
                { properties: presets.night, stop: 0.6 }, // Night
                { properties: presets.dawn, stop: 0.8 }, // Dawn
                { properties: presets.day, stop: 0.9 }, // day
            ]
        ]
    }

    getIntervalDescriptions()
    {
        return [
            { name: 'night', start: 0.25, end: 0.7 },
            { name: 'deepNight', start: 0.35, end: 0.6 },
        ]
    }
}