import React from 'react'
import { tether, Redirect, Container, Text, Caption, Grid, Column, List, Heading, Subheading, Badge, Checkbox, Area, ScrollView } from '@triframe/designer'
import { DecoratorDetails } from './DecoratorDetails'
import { ClassDetails } from './ClassDetails'
import { ComponentDetails } from './ComponentDetails'
import { MethodDetails } from './MethodDetails'
import { packages } from '../../documentation'
import { entities } from '../../documentation/draw'
import { TemplateTagDetails } from './TemplateTagDetails'
import { CliMethodDetails } from './CliMethodDetails'

export const ApiDocumentation = tether(function* ({ models, props, useContext, useRouter, redirect }) {

    const { Session } = models
    const { match } = yield useRouter()
    const { itemId } = match.params

    const itemComponents = {
        class: ClassDetails,
        method: MethodDetails,
        component: ComponentDetails,
        decorator: DecoratorDetails,
        templateTag: TemplateTagDetails,
        cliMethod: CliMethodDetails,
        group: () => null
    }

    let ItemComponent;
    let $item = null
    let groupId



    const packageIds = yield Session.getSelectedPackageIds()

    const selected = yield { groupId: parseInt(groupId) }

    if (itemId) {
        $item = entities[itemId]
        groupId = $item.datatype.name === 'group' ? $item.id : $item.group?.id
        ItemComponent = itemComponents[$item.datatype.name]
        if (!ItemComponent) return <Redirect to="/documentation" />
    }

    const selectedPackages = packages.filter($package => packageIds.includes($package.id))

    return (
        <>
            <Area inline style={{ padding: 20 }}>
                <Area alignX="right" inline>
                    {packages.map($package => (
                        <React.Fragment key={$package.id}>
                            <Area alignY="center">
                                <Caption>{$package.title}</Caption>
                            </Area>
                            <Checkbox
                                status={packageIds.includes($package.id) ? 'checked' : 'unchecked'}
                                onPress={() => Session.toggleSelectedPackageId($package.id)}
                            />
                            <Area alignY="center" style={{ paddingRight: 20 }}>
                                <Caption>|</Caption>
                            </Area>
                        </React.Fragment>
                    ))}
                </Area>
            </Area>
            <Grid style={{ display: 'flex', flex: 1 }}>
                <Column xs={3} style={{ height: '95%' }}>
                    {selectedPackages.length > 0
                        ? (
                            <ScrollView>
                                <List.AccordionGroup
                                    expandedId={selected.groupId}
                                    onAccordionPress={id => selected.groupId = selected.groupId === id ? null : id}
                                >
                                    {selectedPackages.map($package => (
                                        <>
                                            <Caption>{$package.title}</Caption>
                                            {$package.contents.map(value => (
                                                <DocItem
                                                    key={value.id}
                                                    value={value}
                                                    onSelect={(path) => redirect(`/documentation/${path}`)}
                                                    selectedItemId={itemId}
                                                />
                                            ))}
                                        </>
                                    ))}

                                </List.AccordionGroup>
                            </ScrollView>
                        )
                        : (
                            <Area alignX="center" alignY="center">
                                <Subheading>Nothing</Subheading>
                            </Area>
                        )
                    }
                </Column>
                <Column xs={9} style={{ height: '95%' }}>
                    <Container>
                        <div style={{ overflowX: 'scroll' }}>
                            {$item &&
                                <ItemComponent id={$item.id} />
                            }
                        </div>
                    </Container>
                </Column>
            </Grid>
        </>

    )
})



const DocItem = ({ value, ...props }) => {
    const itemTypes = {
        group: GroupItem,
        class: ClassItem,
        component: ComponentItem,
        method: MethodItem,
        decorator: DecoratorItem,
        object: ObjectItem,
        templateTag: TemplateTagItem,
        cliMethod: CliMethodItem
    }
    const ItemType = itemTypes[value.datatype.name]
    return <ItemType value={value} {...props} />
}

const GroupItem = ({ value, onSelect, selectedItemId }) => {
    return (
        <List.Accordion
            title={value.name}
            id={value.id}
        >
            {value.contents.map(value => (
                <DocItem key={value.id} value={value} onSelect={onSelect} selectedItemId={selectedItemId} />
            ))}
        </List.Accordion>
    )
}

const ClassItem = ({ value, onSelect, selectedItemId }) => (
    <List.Item
        color={value.id == selectedItemId ? 'rgb(98, 0, 238)' : ''}
        title={value.name}
        onPress={() => onSelect(value.id)}
        right={() => <Badge>Class</Badge>}
    />
)


const ObjectItem = ({ value, onSelect, selectedItemId }) => (
    <List.Item
        color={value.id == selectedItemId ? 'rgb(98, 0, 238)' : ''}
        title={value.name}
        onPress={() => onSelect(value.id)}
        right={() => <Badge>Object</Badge>}
    />
)

const ComponentItem = ({ value, onSelect, selectedItemId }) => (
    <List.Item
        color={value.id == selectedItemId ? 'rgb(98, 0, 238)' : ''}
        title={value.name}
        onPress={() => onSelect(value.id)}
        right={() => <Badge>Component</Badge>}
    />
)

const MethodItem = ({ value, onSelect, selectedItemId }) => (
    <List.Item
        color={value.id == selectedItemId ? 'rgb(98, 0, 238)' : ''}
        title={value.name}
        onPress={() => onSelect(value.id)}
        right={() => <Badge>Method</Badge>}
    />
)

const DecoratorItem = ({ value, onSelect, selectedItemId }) => (
    <List.Item
        color={value.id == selectedItemId ? 'rgb(98, 0, 238)' : ''}
        title={value.name}
        onPress={() => onSelect(value.id)}
        right={() => <Badge>Decorator</Badge>}
    />
)

const TemplateTagItem = ({ value, onSelect, selectedItemId }) => (
    <List.Item
        color={value.id == selectedItemId ? 'rgb(98, 0, 238)' : ''}
        title={value.name}
        onPress={() => onSelect(value.id)}
        right={() => <Badge>Template Tag</Badge>}
    />
)

const CliMethodItem = ({ value, onSelect, selectedItemId }) => (
    <List.Item
        color={value.id == selectedItemId ? 'rgb(98, 0, 238)' : ''}
        title={value.name}
        onPress={() => onSelect(value.id)}
        right={() => <Badge>CLI Method</Badge>}
    />
)