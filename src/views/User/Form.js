import React from 'react'
import { tether, Section, Subheading, TextInput, Area, PasswordInput, FileInput, Avatar, List, Container, Heading, Button, HelperText, Image } from '@triframe/designer'
import { when } from '@triframe/confectioner'
import { VUser } from '.';

export const Form = tether(function* ({ Api, props }) {

    const { url } = Api;

    const { value: form, onSubmit } = props

    const error = yield { message: null }

    const { shouldShowErrorsFor, errorMessageFor, isValid, showAllErrors, hideAllErrors } = form.validation

    const handleSubmit = async () => {
        if (isValid) {
            try {
                await onSubmit({ name: form.name, email: form.email, password: form.password, profileUrl: form.profileUrl, confirmPassword: form.confirmPassword })
                hideAllErrors()
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
            <Section>
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
                <Subheading>Profile Image</Subheading>
                <Area inline>
                    <VUser.Avatar user={form} />
                    <FileInput
                        mode="text"
                        label="Profile Pic"
                        value={form.profileUrl}
                        onChange={value => form.profileUrl = value}
                    />
                </Area>
                <HelperText type="error" visible={shouldShowErrorsFor('profileUrl')}>
                    {errorMessageFor('profileUrl')}
                </HelperText>
            </Section>
            <Section>
                <TextInput
                    label="Email"
                    value={form.email}
                    onChange={value => form.email = value.toLowerCase()}
                />
                <HelperText type="error" visible={shouldShowErrorsFor('email')}>
                    {errorMessageFor('email')}
                </HelperText>
            </Section>
            {when(form.password !== undefined, () => (
                <>
                    <Section>
                        <PasswordInput
                            label="Password"
                            value={form.password}
                            onChange={value => form.password = value}
                        />
                        <HelperText type="error" visible={shouldShowErrorsFor('password')}>
                            {errorMessageFor('password')}
                        </HelperText>
                    </Section>
                    <Section>
                        <PasswordInput
                            label="Confirm Password"
                            value={form.confirmPassword}
                            onChange={value => form.confirmPassword = value}
                        />
                        <HelperText type="error" visible={shouldShowErrorsFor('confirmPassword')}>
                            {errorMessageFor('confirmPassword')}
                        </HelperText>
                    </Section>
                </>
            ))}
            <Area inline alignX="center">
                <Button onPress={handleSubmit}>
                    Submit
                </Button>
            </Area>
            <HelperText type="error" visible={error.message != null}>
                {error.message}
            </HelperText>
        </>
    )
})  