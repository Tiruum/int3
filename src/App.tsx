import CustomCursor from "./components/CustomCursor"
import Header from "./components/Header"
import './App.css'
import Preloader from "./components/Preloader"
import Footer from "./components/Footer";
import React, {useState} from "react";
import Intro from "./components/Views/Intro";
import ContactForm from "./components/ContactForm";
import Section from "./components/Section";
import Benefits from "./components/Views/Benefits";
import Grid from "./components/Grid";
import Scenarios from "./components/Views/Scenarios";
import Functions from "./components/Views/Functions";

const App: React.FC = () => {
    const [showContact, setShowContact] = useState<boolean>(false)
    return (
        <div className="text-white overflow-hidden">
            <Preloader/>
            {showContact && <ContactForm setShowContact={setShowContact}/>}
            <Header/>
            <CustomCursor/>
            <Intro id={'intro'}/>
            <div id="description" className="w-full h-72 bg-red-800 my-32">Description</div>
            <Section id={'functions'}>
                <Functions/>
            </Section>
            <Section id={'benefits'} className={`bg-gradient-to-br from-blue-900/50 to-blue-900/30 rounded-3xl`}>
                <Grid className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10'/>
                <Benefits/>
            </Section>
            <Section id={'scenarios'}>
                <Scenarios />
            </Section>
            <div id="visualization" className="w-full h-72 bg-red-800 my-32">Visualisation</div>
            <Footer/>
        </div>
    )
}

export default App
