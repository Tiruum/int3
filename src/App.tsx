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
import ContactWithUs from "./components/Views/ContactWithUs";
import Visualisation from "./components/Views/Visualisation";
import Description from "./components/Views/Description";

const App: React.FC = () => {
    const [showContact, setShowContact] = useState<boolean>(false)
    return (
        <div className="text-white overflow-hidden">
            <Preloader/>
            {showContact && <ContactForm setShowContact={setShowContact}/>}
            <Header/>
            <CustomCursor/>
            <Intro id={'intro'}/>
            <Section id={'description'}>
                <Grid className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10'/>
                <Description />
            </Section>
            <Section id={'functions'}>
                <Grid className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 rotate-180'/>
                <Functions/>
            </Section>
            <Section id={'benefits'} className={`bg-gradient-to-br from-blue-900/50 to-blue-900/30 rounded-3xl`}>
                <Grid className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10'/>
                <Benefits/>
            </Section>
            <Section id={'scenarios'}>
                <Grid className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 rotate-180'/>
                <Scenarios />
            </Section>
            <Section id={'contactWithUs'}
                     className={`bg-gradient-to-r from-blue-800 to-indigo-900 rounded-3xl space-y-8 overflow-hidden`}>
                <ContactWithUs />
                <Grid className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180'/>
            </Section>
            <Section id={'visualisation'}>
                <Visualisation />
            </Section>
            <Footer/>
        </div>
    )
}

export default App
