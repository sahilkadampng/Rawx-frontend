import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Workflow from '../components/Workflow';
import Platforms from '../components/Platforms';
import Perspectives from '../components/Perspectives';
import Skills from '../components/Skills';
// import Donate from '../components/Donate';
import CTA from '../components/CTA';
import VisibilityNotice from '../components/VisibilityNotice';
import { FeatureGate, useFeatureFlag } from '../context/FeatureFlagContext';

export default function Home() {
    const homeVisible = useFeatureFlag('page.home');

    if (!homeVisible) {
        return (
            <VisibilityNotice
                title="Home"
                description="The home page is currently disabled by the site administrator. Try another section or return later."
                backHref="/"
                backLabel="Refresh home"
            />
        );
    }

    return (
        <>
            <Navbar />
            <main>
                <FeatureGate flagKey="content.home.hero"><Hero /></FeatureGate>
                <FeatureGate flagKey="content.home.workflow"><Workflow /></FeatureGate>
                <FeatureGate flagKey="content.home.platforms"><Platforms /></FeatureGate>
                <FeatureGate flagKey="content.home.perspectives"><Perspectives /></FeatureGate>
                <FeatureGate flagKey="content.home.skills"><Skills /></FeatureGate>
                <FeatureGate flagKey="content.home.cta"><CTA /></FeatureGate>
            </main>
            <Footer />
        </>
    );
}
