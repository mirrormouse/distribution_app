// components/Layout.js
export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-brand">振り分けアプリ</h1>
            </header>
            <main className="flex-grow p-4 sm:p-8">
                {children}
            </main>
            <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
                © 2023 My App
            </footer>
        </div>
    )
}
