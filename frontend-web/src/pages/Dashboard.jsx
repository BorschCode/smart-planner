import Sidebar from '../layout/Sidebar';

export default function Dashboard({ children }) {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main style={{ padding: 24, flex: 1 }}>
                {children}
            </main>
        </div>
    );
}
