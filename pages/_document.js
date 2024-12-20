// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="ja">
            <Head>
                {/* Google Fontsのインポート */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="true"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <body className="bg-background-light text-text-light">
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
