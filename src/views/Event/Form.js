import React from 'react'
import { tether, TextInput, TextArea, Grid, Column, DateTimeInput, DateInput, Section, HelperText, Button, Area, Subheading } from '@triframe/designer'
import { when, otherwise, sleep } from '@triframe/confectioner'

export const EventForm = tether(function* ({ props, Api }) {
    const { User } = Api
    const { value: form, onSubmit } = props

    const error = yield { message: null }

    const { shouldShowErrorsFor, errorMessageFor, isValid, showAllErrors, hideAllErrors } = form.validation

    const handleSubmit = async () => {
        if (isValid) {
            try {
                await onSubmit({ name: form.name, description: form.description, startTime: form.startTime, endTime: form.endTime })
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
                <TextInput
                    label="Name"
                    value={form.name}
                    onChange={value => form.name = value}
                />
                <HelperText type="error" visible={shouldShowErrorsFor('name')}>
                    {errorMessageFor('name')}
                </HelperText>
            </Section>
            <Grid base={2}>
                <Column>
                    <DateTimeInput
                        label="Start Time"
                        value={form.startTime}
                        onChange={value => form.startTime = value}
                    />
                    <HelperText type="error" visible={shouldShowErrorsFor('startTime')}>
                        {errorMessageFor('startTime')}
                    </HelperText>
                </Column>
                <Column>
                    <DateTimeInput
                        label="End Time"
                        value={form.endTime}
                        onChange={value => form.endTime = value}
                    />
                    <HelperText type="error" visible={shouldShowErrorsFor('endTime')}>
                        {errorMessageFor('endTime')}
                    </HelperText>
                </Column>
            </Grid>
            <Section>
                <Subheading>Description</Subheading>
                <TextArea
                    placehold="Description"
                    value={form.description}
                    onChange={value => form.description = value}
                />
                <HelperText type="error" visible={shouldShowErrorsFor('description')}>
                    {errorMessageFor('description')}
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
        </>
    )
})