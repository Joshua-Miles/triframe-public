import React, { createRef } from 'react'
import { tether, Card, Heading, ScrollView, Area, TextInput, Subheading, Paragraph, BubbleButton, Section, Caption } from '@triframe/designer'
import { VUser } from '../User'
import { when, otherwise } from '@triframe/confectioner'


const scrollBar = createRef()
const textArea = createRef()

export const Messages = tether(function* ({ props, Api, afterFirstRender, afterRender }) {
    const { Message, Team } = Api
    const { team } = props

    const paging = yield { limit: 10 }

    const messages = yield team.feed(paging.limit, `
        content,
        creationDate,
        sender {
            name, 
            profileUrl
        }
    `)

    const newMessage = yield new Message({
        content: ''
    })

    const sendMessage = async () => {
        await team.sendMessage(newMessage.content)
        newMessage.content = ''
    }


    const messageBox = yield { scroll: 0, height: null }

    afterRender(() => {
       if(scrollBar.current) scrollBar.current.scrollTo({ y: messageBox.height - messageBox.scroll, animated: false })
    })

    let handleScroll = ({ nativeEvent: e }) => {
        const { y } = e.contentOffset
        const { height } = e.contentSize
        if (height != messageBox.height) return // Can't accurately calculate scroll position if the height is inaccurate
        messageBox.scroll = height - y
        if (y === 0) paging.limit += 5
    }

    let handleSizeChange = (width, height) => {
        messageBox.height = height
    }

    let currentDay = null
    return (
        <Card elevation={2} style={{ height: '100%' }}>
            <Card.Content style={{ height: '95%' }}>
                <Heading>Messages</Heading>
                {when(messages.length > 0, () => (
                    <ScrollView ref={scrollBar} scrollEventThrottle={25} onScroll={handleScroll} onContentSizeChange={handleSizeChange} >
                        {messages.reverse().map(message => (
                            <Section key={message.id}>
                                <Card>
                                    <Card.Content>
                                        <Area inline>
                                            <Area>
                                                <VUser.Avatar user={message.sender} size={30} />
                                            </Area>
                                            <Area alignY="center" style={{ marginLeft: 10, flex: 1 }}>
                                                <Subheading>{message.sender.name}</Subheading>
                                                <Paragraph>{message.content}</Paragraph>
                                            </Area>
                                            <Area alignX="right">
                                                <Caption>
                                                    {when(message.creationDate.toFormat('MM/d/yy') != currentDay, () => {
                                                        currentDay = message.creationDate.toFormat('MM/d/yy')
                                                        return `${currentDay} `
                                                    })}
                                                    {message.creationDate.toFormat('hh:mm a')}
                                                </Caption>
                                            </Area>
                                        </Area>
                                    </Card.Content>
                                </Card>
                            </Section>
                        ))}
                    </ScrollView>
                ), otherwise(() => (
                    <Area alignX="center" alignY="center">
                        <Subheading>No Messages to Display</Subheading>
                    </Area>
                )))}
                <Section>
                    <Area inline >
                        <Card style={{ flex: 1 }}>
                            <Card.Content>
                                <TextInput
                                    multiline
                                    placeholder="New Message..."
                                    value={newMessage.content}
                                    ref={textArea}
                                    onChange={content => newMessage.content = content}
                                    onKeyPress={async e => {
                                        if (e.key == 'Enter') {
                                            console.log(textArea)
                                            e.preventDefault()
                                            await sendMessage()
                                            console.log(textArea)
                                            textArea.current.focus()
                                        }
                                    }}
                                    mode="outlined"
                                />
                            </Card.Content>
                        </Card>
                        <Area alignY="bottom">
                            <BubbleButton icon="send" onPress={sendMessage} />
                        </Area>
                    </Area>
                </Section>
            </Card.Content>
        </Card>
    )
})