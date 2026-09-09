import * as THREE from 'three/webgpu'
import { InteractivePoints } from '../../InteractivePoints.js'
import { Area } from './Area.js'
import { Fn, texture, uv, vec2, vec3, vec4 } from 'three/tsl'
import gsap from 'gsap'

export class TimeMachineArea extends Area
{
    constructor(model)
    {
        super(model)

        this.setInteractivePoint()
        this.setTV()
        this.setAchievement()
    }

    setInteractivePoint()
    {
        this.interactivePoint = this.game.interactivePoints.create(
            this.references.items.get('interactivePoint')[0].position,
            'Time Machine',
            InteractivePoints.ALIGN_RIGHT,
            InteractivePoints.STATE_CONCEALED,
            () =>
            {
                this.game.leo.open('memories')
            },
            () =>
            {
                this.game.inputs.interactiveButtons.addItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            },
            () =>
            {
                this.game.inputs.interactiveButtons.removeItems(['interact'])
            }
        )
    }

    setTV()
    {
        let canCollide = true
        let collideIndex = 0

        const screenTextures = ['打开 Leo 的记忆', '去很大的世界'].map((title, index) => {
            const canvas = document.createElement('canvas')
            canvas.width = 1024; canvas.height = 640
            const context = canvas.getContext('2d')
            context.fillStyle = index ? '#263e47' : '#334637'
            context.fillRect(0, 0, 1024, 640)
            context.strokeStyle = '#acbc96'; context.lineWidth = 2
            context.strokeRect(38, 38, 948, 564)
            context.fillStyle = '#f3e8cc'; context.textAlign = 'center'
            context.font = '52px "Microsoft YaHei", sans-serif'
            context.fillText(title, 512, 310)
            context.font = '26px "Microsoft YaHei", sans-serif'
            context.fillText(index ? '从白马李家出发 · 旅行与光影' : '童年 · 故乡 · 在路上的坐标', 512, 385)
            const result = new THREE.CanvasTexture(canvas)
            result.flipY = false; result.colorSpace = THREE.SRGBColorSpace
            return result
        })

        const alertSound = this.game.audio.register({
            path: 'sounds/tv/alert.mp3',
            autoplay: false,
            loop: false,
            volume: 0.3,
            preload: true
        })
    

        const tv = this.references.items.get('tv')[0]
        tv.userData.object.physical.onCollision = (force, position) =>
        {
            if(canCollide)
            {
                canCollide = false
                collideIndex++
                material.outputNode = screenOutputNode()
                material.needsUpdate = true

                const clickSound = this.game.audio.groups.get('click')
                if(clickSound)
                    clickSound.play(true)

                if(collideIndex === 1)
                    alertSound.play()

                gsap.delayedCall(1, () =>
                {
                    canCollide = true
                })
            }
        }

        const screenMesh = this.references.items.get('screen')[0]

        const material = new THREE.MeshBasicNodeMaterial()
        const screenOutputNode = Fn(() =>
        {
            const baseUv = vec2(uv().x, uv().y)
            
            const textureColor = texture(screenTextures[collideIndex % screenTextures.length], baseUv)

            const stripes = texture(
                this.game.noises.perlin,
                vec2(
                    baseUv.y.add(this.game.ticker.elapsedScaledUniform.mul(0.1)),
                    0
                )
            ).r.smoothstep(0, 1)

            return vec4(textureColor.rgb.mul(stripes.mul(collideIndex % screenTextures.length === 0 ? 1 : 3).add(1)), 1)
        })
        material.outputNode = screenOutputNode()

        screenMesh.material = material
    }

    setAchievement()
    {
        this.events.on('boundingIn', () =>
        {
            this.game.achievements.setProgress('areas', 'timeMachine')
        })
    }
}
