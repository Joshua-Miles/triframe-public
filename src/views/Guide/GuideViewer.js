import React from 'react'
import { tether, List, Container, Title } from "@triframe/designer";
import { guides } from "../../guides";


export const GuideViewer = tether(function* ({ useParams }) {

    const { id } = yield useParams()

    const Guide = guides[id - 1]

    return (
        Guide
            ? (
                <>
                    <Title>{Guide.title}</Title>
                    <Guide.Content />
                </>
            )
            : <GuideIndex />
    )

})

export const GuideIndex = tether(function ({ redirect }) {
    return (
        <>
            <Title>Guides</Title>
            {guides.map((guide, index) => (
                <List.Item
                    title={guide.title}
                    description={guide.description}
                    onPress={() => redirect(`/guides/${index + 1}`)}
                />
            ))}
        </>
    )
})