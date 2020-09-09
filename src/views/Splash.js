import React, { createRef } from 'react'
import { tether, Title, Container, Button, BubbleButton, Area, Heading, Section, Paragraph, Grid, Column, List } from '@triframe/designer'
import { Navigation } from './Navigation'
import { VEvent } from './Event'

export const Splash = tether(function* ({ redirect }) {

    let container = createRef()

    let page = yield { height: null }

    let navigation = yield { opacity: 0 }

    let scroll = () => container.current.scrollTo(window.innerHeight - 60)

    let handleScroll = (e) => {
        let maxScroll = window.innerHeight - 60
        let percentageScrolled = e.nativeEvent.contentOffset.y / maxScroll
        navigation.opacity = percentageScrolled
    }

    let handleContentSize = (x, y) => {
        page.height = y
    }

    return (
        <>
            <Navigation.Bar style={{ position: 'absolute', width: '100vw', opacity: navigation.opacity }} />
            <Container ref={container} onScroll={handleScroll} onContentSizeChange={handleContentSize} >
                <Area style={{ height: '100vh' }}>
                    <Area alignX="center" alignY="center">
                        <Area inline>
                            <Title>Δ TriFrame</Title>
                            <Heading>v1.0</Heading>
                            <br />
                        </Area>
                        <Area inline alignX="center">
                            <Button mode="outlined" onPress={() => redirect('/register')}>
                                Register
                        </Button>
                            <Button mode="outlined" onPress={() => redirect('/login')}>
                                Login
                        </Button>
                        </Area>
                        <Area inline alignX="center">
                            <BubbleButton icon="arrow-down" small onPress={scroll} />
                        </Area>
                    </Area>
                </Area>
                <Area style={{ minHeight: '100vh' }}>
                    <Section>
                        <Heading>About the Hackathon</Heading>
                        <Paragraph>
                            Bringing together a community of life-long learners, the TriFrame Hackathon invites alumni of The Flatiron School (and friends) to learn a new tool, build some cool apps, and share them in an exciting weekend event:
                        </Paragraph>
                        <List.Item
                            left={() => <List.Icon icon="account-group" />}
                            title="Collaborative"
                            description="Create or join a team to learn and build with other members of the community"
                        />
                        <List.Item
                            left={() => <List.Icon icon="web" />}
                            title="Remote"
                            description="Collaborate with a team of friends from the safety of your home"
                        />
                        <List.Item
                            left={() => <List.Icon icon="all-inclusive" />}
                            title="Comprehensive"
                            description="A series of workshops will cover everything from your first commit to deployment of your MVP."
                        />
                    </Section>
                    <Section>
                        <Heading>About the Framework</Heading>
                        <Paragraph>
                            TriFrame is unique framework for developing full-stack applications:
                        </Paragraph>
                        <List.Item
                            left={() => <List.Icon icon="language-javascript" />}
                            title="Full-Stack JavaScript"
                            description="Define a method once, then call it on the server and in the browser"
                        />
                        <List.Item
                            left={() => <List.Icon icon="sync" />}
                            title="Real-Time First"
                            description="Application state is synchronized across clients in real-time by default"
                        />
                        <List.Item
                            left={() => <List.Icon icon="react" />}
                            title="Cross Platform"
                            description="Use a robust library of React-Native Components to build apps for web and native"
                        />
                    </Section>
                    <Section>
                        <Grid>
                            <Column xs={12} md={6}>
                                <VEvent.List />
                            </Column>
                        </Grid>
                    </Section>
                </Area>
            </Container>
        </>
    )
})