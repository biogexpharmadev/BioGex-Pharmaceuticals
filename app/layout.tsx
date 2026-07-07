import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import AOSProvider from './components/AOSProvider'

export const metadata: Metadata = {
  title: 'BioGex Pharmaceuticals',
  description: 'BioGex Pharmaceuticals',
  generator: 'BioGex Pharmaceuticals',
  icons: {
    icon: '/logocrop.png',
    shortcut: '/logocrop.png',
    apple: '/logocrop.png',
  },
  other: {
    'facebook-domain-verification': '2izw4rcialvv49j65jrhdr4doluvxj',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AOSProvider />
        {children}
      </body>
    </html>
  )
}
