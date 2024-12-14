// components/Layout.js
import React from 'react';

export default function Layout({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-background-light shadow p-4 flex items-center justify-between">
                <h1 className="text-xl font-bold text-mint">振り分けアプリ</h1>
                {/* ダークモードトグルボタンを削除 */}
            </header>
            <main className="flex-grow p-4 sm:p-8">
                {children}
            </main>
            <footer className="bg-background-light p-4 text-center text-sm text-text-secondary">
                © 2024 振り分けアプリ
            </footer>
        </div>
    )
}
