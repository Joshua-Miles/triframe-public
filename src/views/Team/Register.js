import React from 'react'
import { tether, Area, List, Card, Heading, Section, TextInput, HelperText, Button, Paragraph, Grid, Column } from "@triframe/designer"
import { CurrentUser } from '../../contexts/CurrentUser'
import { when, otherwise } from '@triframe/confectioner'
import { VUser } from '../User'

export const Register = tether(function* ({ Api, redirect, useContext }) {

    const { User, Team } = Api

    const currentUser = yield useContext(CurrentUser)
    if (currentUser === null) return null

    const form = yield new Team({ name: '' })

    const search = yield { term: '' }

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

    const users = yield User.where({ teamId: null })

    const matchesSearch = user => [user.name].some(field => field.toLowerCase().includes(search.term.toLowerCase()))

    const searchResults = users.filter(user => matchesSearch(user))

    return (
        <Grid>
            <Column xs={12} md={6}>
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
            <Column xs={12} md={6}>
                <Card style={{ marginLeft: 20}}>
                    <Card.Content>
                        <Heading>Currently Awaiting a Team:</Heading>
                        <TextInput
                            placeholder="Search..."
                            value={search.term}
                            onChange={value => search.term = value}
                        />
                        {when(searchResults.length > 0, () => (
                            searchResults.map(user => (
                                <List.Item
                                    left={() => <List.Icon icon={() => <VUser.Avatar user={user} size={30} />} />}
                                    title={user.name}
                                />
                            ))
                        ), otherwise(() => (
                            <Section>
                                <Area alignX="center" alignY="center">
                                    <Heading>No users to display, check back later...</Heading>
                                </Area>
                            </Section>
                        )))}
                    </Card.Content>
                </Card>
            </Column>
        </Grid>
    )
})