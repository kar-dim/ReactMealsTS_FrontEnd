import Header from "./components/Header"
import AboutStyles from "./About.module.css"

//todo
const About = () => {
    return (
    <>
        <Header />
        <div id={AboutStyles.about_main}>
            <div id={AboutStyles.about_main_content}>
                <h1>Jimmys Foodzilla: An idea from 1980s!</h1>
                <p>All started in 1980. It was a rainy day in Athens, where Dimitris (aka Jimmy) tried Ramen for the first time! Then... it happened... (blah blah)</p>
            </div>
        </div>
    </>
    );
};

export default About;