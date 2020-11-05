import React from 'react'
import { tether, TextInput, Button, Area, Heading, Icon, Modal, Grid, Column, Caption, View, Card } from '@triframe/designer'
import icons from './icons.json'


export const IconExplorer = tether(function* ({ props }) {

    const PAGE_LENGTH = 42

    const state = yield { showModal: false, currentPage: 0, searchTerms: '' }

    const searchResults = icons.filter(icon => state.searchTerms.trim().split(' ').some(term => icon.includes(term)))

    const numberOfPages = searchResults.length / PAGE_LENGTH

    const startingPoint = Math.max(0, state.currentPage - 3)

    const endPoint = Math.min(numberOfPages, Math.max(state.currentPage + 3, startingPoint + 6))

    const displayedIcons = searchResults.slice(state.currentPage * PAGE_LENGTH, (state.currentPage + 1) * PAGE_LENGTH)

    return (
        <Area>
            <Heading>Icons</Heading>
            <TextInput
                value={state.searchTerms}
                onChange={(newSearchTerms) => {
                    state.currentPage = 0;
                    state.searchTerms = newSearchTerms
                }}
            />
            <div>
                <Grid>
                    {displayedIcons.map(icon => (
                        <Column xs={2} alignX="center" >
                            <Card>
                                <Icon name={icon} style={{ fontSize: 25, textAlign: 'center' }} />
                                <Caption style={{ textAlign: 'center', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{icon}</Caption>
                            </Card>
                        </Column>
                    ))}
                </Grid>
            </div>
            <Area inline alignX="center">
                {loop({ from: startingPoint, to: endPoint }, number => (
                    <Button onPress={() => state.currentPage = number} mode={number == state.currentPage ? "contained" : "outline"} >
                        {`${number + 1}`}
                    </Button>
                ))}
            </Area>
        </Area>
    )

})

let loop = ({ from, to }, callback) => {
    let results = []
    for (let i = from; i < to; i++) results.push(callback(i))
    return results
}