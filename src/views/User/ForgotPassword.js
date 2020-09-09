import React from 'react'
import { tether, TextInput, Container, Title, Button, Area, HelperText, Heading, Paragraph, Grid, Column } from '@triframe/designer'
import { when, otherwise } from '@triframe/confectioner'

export const ForgotPassword = tether(function* ({ Api }) {

    const { PasswordResetRequest } = Api

    const state = yield {
        email: '',
        success: false,
        error: null
    }

    const sendRequest = async () => {
        try {
            let successful = await PasswordResetRequest.send(state.email)
            if (successful) {
                state.success = true
            } else {
                state.error = 'Something went wrong, please try again...'
            }
        } catch (err) {
            state.error = err.message
        }
    }

    const resetState = () => {
        state.email = ''
        state.success = false
        state.error = null
    }

    return (
        <Container>
            <Grid>
                <Column xs={12} md={6}>
                    <Title>Forgot Password</Title>
                    {when(state.success === false, () => (
                        <>
                            <TextInput
                                label="Email"
                                value={state.email}
                                onChange={input => state.email = input}
                            />
                            <Area alignX="center">
                                <Button onPress={sendRequest}>
                                    Reset
                                </Button>
                            </Area>
                            <HelperText type="error" visible={state.error != null}>
                                {state.error}
                            </HelperText>
                        </>
                    ), otherwise(() => (
                        <Area alignX="center" alignY="center">
                            <Heading style={{ color: "green" }}>Request Sent</Heading>
                            <Paragraph>Check your email for instructions to finish reseting your password.</Paragraph>
                            <Button mode="text" icon="arrow-left" onPress={resetState}>
                                Back
                    </Button>
                        </Area>
                    )))}
                </Column>
            </Grid>
        </Container>
    )
})