import React from 'react'
import { tether, PasswordInput, Container, Title, Button, Area, HelperText, Heading, Paragraph, Section } from '@triframe/designer'
import { when, otherwise } from '@triframe/confectioner'

export const ResetPassword = tether(function* ({ Api, useParams, redirect }) {

    const { PasswordResetRequest, User } = Api

    const { key } = yield useParams()

    const state = yield {
        error: null, 
        success: false
    }

    const updatedUser = yield new User({
        password: '',
        confirmPassword: ''
    })

    const { shouldShowErrorsFor, errorMessageFor, isValid, showAllErrors, hideAllErrors } = updatedUser.validation

    const reset = async () => {
        if (isValid === false) return showAllErrors()
        if (updatedUser.password === updatedUser.confirmPassword) {
            try {
                let success = await PasswordResetRequest.fullfill(key, updatedUser.password)
                if (success) {
                    state.success = true
                } else {
                    state.error = 'Something went wrong, please try again...'
                }
            } catch (err) {
                state.error = err.message
            }
        } else {
            state.error = 'Passwords do not match'
        }
    }

    return (
        <Container>
            <Title>Reset Password</Title>
            {when(state.success === false, () => (
                <>
                    <Section>
                        <PasswordInput
                            label="Password"
                            value={updatedUser.password}
                            onChange={input => updatedUser.password = input}
                        />
                        <HelperText type="error" visible={shouldShowErrorsFor('password')}>
                            {errorMessageFor('password')}
                        </HelperText>
                    </Section>
                    <Section>
                        <PasswordInput
                            label="Confirm Password"
                            value={updatedUser.confirmPassword}
                            onChange={input => updatedUser.confirmPassword = input}
                        />
                        <HelperText type="error" visible={shouldShowErrorsFor('confirmPassword')}>
                            {errorMessageFor('confirmPassword')}
                        </HelperText>
                    </Section>
                    <Area alignX="center">
                        <Button onPress={reset}>
                            Reset
                        </Button>
                    </Area>
                    <HelperText type="error" visible={state.error != null}>
                        {state.error}
                    </HelperText>
                </>
            ), otherwise(() => (
                <Area alignX="center" alignY="center">
                    <Heading style={{ color: "green" }}>Password Reset</Heading>
                    <Paragraph>Now you can log in with your new password.</Paragraph>
                    <Button mode="text" icon="arrow-right" onPress={() => redirect('/login')}>
                        Login
                    </Button>
                </Area>
            )))}
        </Container>
    )
})