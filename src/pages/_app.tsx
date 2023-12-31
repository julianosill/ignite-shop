import type { AppProps } from 'next/app'
import Image from 'next/image'
import { Roboto } from 'next/font/google'

import logo from '../assets/ignite-logo.svg'
import { globalStyles } from '@/styles/global'
import { Container, Header } from '@/styles/pages/app'

const roboto = Roboto({
    weight: ['400', '700'],
    subsets: ['latin'],
})

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <style jsx global>{`
                html {
                    font-family: ${roboto.style.fontFamily};
                }
            `}</style>
            <Container>
                <Header>
                    <Image src={logo} alt="" />
                </Header>
                <Component {...pageProps} />
            </Container>
        </>
    )
}
