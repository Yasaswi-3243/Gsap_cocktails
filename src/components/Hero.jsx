import { useGSAP } from "@gsap/react"
import { SplitText } from "gsap/all"
import gsap from "gsap"
import { useRef } from "react"
import { useMediaQuery} from 'react-responsive'

const Hero = () => {
    const videoRef=useRef()
    const videoTimelineRef = useRef(null)
    const isMobile=useMediaQuery({maxWidth:767})
    useGSAP(()=>{
        const heroSplit=new SplitText('.title',{type:'chars,words'})
        const paragraphSplit=new SplitText('.subtitle',{type:'lines'})
        heroSplit.chars.forEach((char)=> char.classList.add('text-gradient'))
        gsap.from(heroSplit.chars,{
            yPercent:100,
            duration:1.8,
            stagger:0.05,
            ease:'expo.Out'
        })
        gsap.from(paragraphSplit.lines,{
            yPercent:100,
            duration:1.8,
            stagger:0.06,
            delay:1,
            opacity:0,
            ease:'expo.out'
        })
        gsap.timeline({
            scrollTrigger:{
                trigger:'#hero',
                start:'top top',
                end:'bottom top',
                scrub:true,
            }
        })
        .to('.left-leaf',{y:-200},0)
        .to('.right-leaf',{y:200},0)
        const startValue=isMobile ? 'top 50%':'center 60%'
        const endValue=isMobile?'120% top ': 'bottom top'
        const tl=gsap.timeline({
            scrollTrigger:{
                trigger:'video',
                start:startValue,
                end:endValue,
                pin:true,
                scrub:true,
            }
        })
        videoTimelineRef.current = tl
        const videoEl = videoRef.current
        if (!videoEl) return
        const handleLoadedMetadata = () => {
            if (!Number.isFinite(videoEl.duration) || videoEl.duration <= 0) return
            tl.to(videoEl, {
                currentTime: videoEl.duration,
            })
        }
        const handleError = () => {
            tl.kill()
            videoTimelineRef.current = null
        }

        videoEl.addEventListener('loadedmetadata', handleLoadedMetadata)
        videoEl.addEventListener('error', handleError)

        return () => {
            videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata)
            videoEl.removeEventListener('error', handleError)
        }
    },[])
  return (
    <>
    <section id="hero" className="noisy">
        <h1 className="title">MOJITO</h1>
        <img src="./images/hero-left-leaf.png" alt="left-leaf" className="left-leaf"/>
        <img src="./images/hero-right-leaf.png" alt="right-leaf" className="right-leaf"/>
        <div className="body">
            <div className="content">
                <div className="space-y-5 hidden md:block">
                    <p>Cool. Crispy. Classic</p>
                    <p className="subtitle">
                        Sip the Sprit <br /> of Summer
                    </p>
                </div>
                <div className="view-cocktails">
                    <p className="subtitle">
                        Every cocktail on our menu is a blend of premium ingredients,
                        creating flair , and timeless receips - designed to delight your senses.
                    </p>
                    <a href="#cocktails">
                        view cocktails
                    </a>
                </div>
            </div>
        </div>
    </section>
    <div className="video absolute inset-0">
        <video ref={videoRef} muted playsInline preload="metadata">
            <source src="/videos/output.mp4" type="video/mp4" />
            <source src="/videos/input.mp4" type="video/mp4" />
        </video>
    </div>
    </>
  )
}

export default Hero