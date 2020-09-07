import React from 'react'
import { tether, Heading, Section, TextInput, HelperText, Button, Paragraph, Grid, Column } from "@triframe/designer"

export const Register = tether(function* ({ Api, redirect }) {

    const { Team } = Api

    const form = yield new Team({ name: '' })

    const error = yield { message: null }

    const { shouldShowErrorsFor, errorMessageFor, isValid, showAllErrors, hideAllErrors, allErrorMessages } = form.validation

    const handleSubmit = async () => {
        if (isValid) {
            try {
                await Team.register({ name: form.name })
                redirect('/team')
                error.message = null
            } catch (err) {
                error.message = err.message
            }
        } else {
            showAllErrors()
        }
    }

    return (
        <Grid>
            <Column xs={6}>
                <Heading>Register New Team</Heading>
                <Paragraph>Once registered, you will be able to invite other users to join your team.</Paragraph>
                <Paragraph>DO NOT register a new team if you intend to join an existing one.</Paragraph>
                <Section>
                    <TextInput
                        label="Name"
                        value={form.name}
                        onChange={value => form.name = value}
                    />
                    <HelperText type="error" visible={shouldShowErrorsFor('name')}>
                        {errorMessageFor('name')}
                    </HelperText>
                </Section>
                <Button onPress={handleSubmit}>
                    Register
                </Button>
                <HelperText type="error" visible={error.message !== null}>
                    {error.message}
                </HelperText>
            </Column>
        </Grid>
    )
})