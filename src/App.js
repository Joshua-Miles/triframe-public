import React from 'react'
import { Provider, Heading, DefaultTheme } from '@triframe/designer'
import { Router } from './views/Router'

export default () => (
    <Provider theme={{
        ...DefaultTheme,
        fonts: {
            ...DefaultTheme.fonts,
            medium: {
                fontFamily: 'Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontWeight: '400',
            },
            regular: {
                fontFamily: 'Montserrat, "Helvetica Neue", Helvetica, Arial, sans-serif',
                fontWeight: '400',
            },
        },
        colors: {
            ...DefaultTheme.colors,
            primary: 'black',
            accent: 'black'
            //text: 'white'
        }
    }} url={process.env.NODE_ENV == 'production' ? `https://${window.location.host}` : "http://localhost:8080"}>
        <Router.Main />
    </Provider>
)