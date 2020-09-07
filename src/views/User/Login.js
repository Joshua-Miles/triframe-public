import React from 'react'
import { tether, Area, Container, Section, TextInput, PasswordInput, HelperText, Button, Title, Grid, Column } from '@triframe/designer'
import { Navigation } from '../Navigation'

export const Login = tether(function* ({ Api, redirect }) {

    const { User } = Api

    const form = yield new User({ email: '', password: '' })

    const error = yield { message: '' }

    const { shouldShowErrorsFor, errorMessageFor, isValid, showAllErrors, hideAllErrors } = form.validation

    const handleSubmit = async () => {
        if (isValid) {
            try {
                await User.login({ email: form.email, password: form.password })
                hideAllErrors()
                form.email = ''
                form.password = ''
                error.message = null
            } catch (err) {
                error.message = err.message
            }
        } else {
            showAllErrors()
        }
    }

    return (
        <>
            <Navigation.Public />
            <Container>
                <Grid>
                    <Column xs={6}>
                        <Title>Login</Title>
                        <Section>
                            <TextInput
                                label="Email"
                                value={form.email}
                                onChange={newEmail => form.email = newEmail}
                            />
                            <HelperText type="error" visible={shouldShowErrorsFor('email')}>
                                {errorMessageFor('email')}
                            </HelperText>
                        </Section>
                        <Section>
                            <PasswordInput
                                label="Password"
                                value={form.password}
                                onChange={newPassword => form.password = newPassword}
                            />
                            <HelperText type="error" visible={shouldShowErrorsFor('password')}>
                                {errorMessageFor('password')}
                            </HelperText>
                        </Section>
                        <Area inline alignX="center">
                            <Button onPress={handleSubmit}>
                                Submit
                </Button>
                        </Area>
                        <HelperText type="error" visible={error.message != null}>
                            {error.message}
                        </HelperText>
                        <Button mode="text" onPress={() => redirect(`/forgot-password`)}>
                            Forgot Password
                </Button>
                    </Column>
                </Grid>
            </Container>
        </>
    )
})