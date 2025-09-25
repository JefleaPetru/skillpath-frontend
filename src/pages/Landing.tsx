import Navbar from "../components/Navbar";
import WhatWeDo from "../components/WhatWeDo";
import '../css/Landing.css'

function Landing() {
    return (
    <div className = "landing">
      <Navbar />
      <section className = "intro-message">
        <h1 className="hero-title">
            Master new skills with your AI customized learning paths.
        </h1>

         <p className="sub-hero">
            Get personalized step-by-step learning paths. 
            Our AI adapts to the best resources on the Internet for you to
            achieve the best results and don't waist time. 
        </p>
        <div className="try-button-row">
          <button className="try-for-free">Try for free</button>
        </div>

        <div className="scroll-page" id="progress">1</div>
        <div className="scroll-page" id="whatwedo"><WhatWeDo /></div>
        <div className="scroll-page" id="skills">3</div>
      </section>
    </div>
  );
}

export default Landing;