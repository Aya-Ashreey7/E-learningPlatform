import Navbar from '../components/Navbar/Navbar';

export default function Home() {
    return (
        <div>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-3xl font-bold">Welcome Home!</h1>
            </div>
        </div>
    );
}
