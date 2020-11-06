import NextNprogress from 'nextjs-progressbar'
import {PageTransition} from 'next-page-transitions'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css'
import '@styles/globals.scss'
import '@styles/components/signin.scss'
import '@styles/components/Navbar.scss'
import '@styles/components/admin.scss'
import '@styles/components/FloatInput.scss'
import '@styles/components/footer.scss'

const TIMEOUT = 500

export default function MyApp({Component, pageProps}) {

    return (
        <>
            <NextNprogress
                color="#f00"
                height={3}
                className={"loading-indicator"}
            />
                <PageTransition
                    timeout={TIMEOUT}
                    classNames="page-transition"
                    loadingDelay={500}
                    loadingTimeout={{
                        enter: TIMEOUT,
                        exit: 0,
                    }}
                    loadingClassNames="loading-indicator"
                >
                    <Component {...pageProps} key={"app"}/>
                </PageTransition>
                <style jsx global>{`
        .page-transition-enter {
          opacity: 0;
          transform: translate3d(0, 20px, 0);
        }
        .page-transition-enter-active {
          opacity: 1;
          transform: translate3d(0, 0, 0);
          transition: opacity ${TIMEOUT}ms, transform ${TIMEOUT}ms;
        }
        .page-transition-exit {
          opacity: 1;
        }
        .page-transition-exit-active {
          opacity: 0;
          transition: opacity ${TIMEOUT}ms;
        }
        .loading-indicator-appear,
        .loading-indicator-enter {
          opacity: 0;
        }
        .loading-indicator-appear-active,
        .loading-indicator-enter-active {
          opacity: 1;
          transition: opacity ${TIMEOUT}ms;
        }
      `}</style>

        </>
    )
}
