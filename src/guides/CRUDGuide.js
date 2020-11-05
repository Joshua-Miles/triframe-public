import React from 'react'
import { Heading, Subheading, Section, Caption, Paragraph, Card, List } from "@triframe/designer";
import { CopyBlock, dracula } from 'react-code-blocks';

function C({ children, style }) {
    return <span style={{ fontFamily: 'monospace', ...style }}>{children}</span>
}

function P({ children }) {
    return <Paragraph>{children}</Paragraph>
}

function CodeBlock({ children: code, title, ...props }) {
    let lines = code.split('\n')
    let minWhiteSpace = lines.reduce((minWhitespace, line) => Math.min(minWhitespace, line.search(/\S/) > -1 ? line.search(/\S|$/) : Infinity), Infinity)
    lines = lines.map(line => line.substr(minWhiteSpace))
    if (lines[0].length === 0) lines.shift()
    code = lines.join('\n')
    return (
        <Card elevation={3}>
            <Card.Content>
                <Caption>{title}</Caption>
                <CopyBlock
                    language="javascript" theme={dracula}
                    text={code}
                    {...props}
                />
            </Card.Content>
        </Card>
    )
}

function Asset({ name }) {
    return <img style={{ padding: '2%', width: '96%', objectFit: 'contain', borderStyle: 'solid', borderWidth: '0.5px', borderRadius: 10 }} src={require(`./assets/${name}`)} />
}

export function CRUDGuide() {
    return (
        <>
            <P>CRUD stands for Create, Read, Update, and Delete, the common actions involved in managing the data of an application.</P>
            <P>In this guide, we'll walk through the front-end and back-end steps involved in building an application capable of these actions with TriFrame.</P>
            <Section>
                <Heading>1. Run <C>npx create-triframe-app</C></Heading>
                <P>First, let's create a new project:</P>
                <CodeBlock title="terminal">
                    npx create-triframe-app triframe-crud-guide
                </CodeBlock>
            </Section>
            <Section>
                <Heading>2. Configure Database Environment Variable</Heading>
                <P>To connect to a database, we'll need to uncomment the first line of the <C>.env</C> file, and replace the placeholders for <C>username</C>, <C>password</C>, and <C>name</C> with appropriate values for your environment:</P>
                <CodeBlock title=".env">{`
                    DATABASE_URL=postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/YOUR_DATABASE_NAME
                    API_DEV_PORT=8080
                    APP_DEV_PORT=8080
                `}</CodeBlock>
            </Section>
            <Section>
                <Heading>2. Run <C>npm start</C></Heading>
                <P>Inside the newly create project folder, start the triframe project:</P>
                <CodeBlock title="terminal">{`
                    npm start
                `}</CodeBlock>
                <br />
                <P>This may take a minute, but should open a browser tab that looks something like this:</P>
                <Asset name="initial.png" />
            </Section>
            <Section>
                <Heading>3. Delete the Starter Code</Heading>
                <P>The starter code is a really useful tool to explore and understand intuitively some of the concepts behind TriFrame, but it will be easier for the purpose of this guide to work without it.</P>
                <P>Delete <C>src/views/MainPage.js</C>, and <C>src/models/Message.js</C></P>
            </Section>
            <Section>
                <Heading>4. Create a Model</Heading>
                <P>Our first step in implementing CRUD is to have a Model, a class to represent the data we will be creating, reading and deleting; in SQL terms, a table.</P>
                <P>In this guide, we'll name the model <C>FavoriteThing</C>, but encourage you to select a common noun of your own to help you in the process of translating the specific guidelines here to the more generally applicable concepts and tools that will help you to build robust applications in the future. Whenever we refer to <C>FavoriteThing</C>, simply use the name of your chosen common noun instead.</P>
                <P>Create a <C>FavoriteThing.js</C> file in the <C>models</C> folder. Then, build out the boilerplate of a TriFrame model:</P>
                <CodeBlock title="/models/FavoriteThing.js">{`
                    import { Resource } from '@triframe/core'
                    import { include, Model, string } from '@triframe/scribe'

                    export class FavoriteThing extends Resource {
                        @include(Model)

                        @string name = ""

                    }
                `}</CodeBlock>
                <br />
                <P><C>@string name = ""</C> tells TriFrame that <C>FavoriteThing</C>s have a <C>name</C>, and that the <C>name</C> should be a <C>string</C></P>
                <P>Extending <C>Resource</C> gives this class the state-syncing features of <C>@triframe/arbiter</C>, and <C>includ</C>ing the <C>Model</C> class gives it common CRUD related methods:</P>
                <div style={{ width: '75%' }}>
                    <List.Item
                        title=".create"
                        description="Creates a new FavoriteThing instance"
                        right={() => <C style={{ marginTop: 18 }}>{`FavoriteThing.create({ name: 'Hot Chocolate' })`}</C>}
                    />
                    <List.Item
                        title=".list"
                        description="Retrieves a list of FavoriteThing instances"
                        right={() => <C style={{ marginTop: 18 }}>FavoriteThing.list()</C>}
                    />
                    <List.Item
                        title=".read"
                        description="Retrieves a single FavoriteThing by id"
                        right={() => <C style={{ marginTop: 18 }}>FavoriteThing.read(1)</C>}
                    />
                    <List.Item
                        title=".where"
                        description="Retrieves a list of FavoriteThing instances"
                        right={() => <C style={{ marginTop: 18 }}>{`FavoriteThing.where({ name: 'Hot Chocolate' })`}</C>}
                    />
                    <List.Item
                        title=".search"
                        description="Retrieves a list of FavoriteThing instances"
                        right={() => <C style={{ marginTop: 18 }}>{`FavoriteThing.search({ name: 'Hot%' })`}</C>}
                    />
                    <List.Item
                        title="#delete"
                        description="Deletes a FavoriteThing instance"
                        right={() => <C style={{ marginTop: 18 }}>{`hotChocolate.delete()`}</C>}
                    />
                </div>
                <P>When you save the <C>FavoriteThing.js</C> file, you may notice some SQL in your terminal:</P>
                <Asset name="auto-migration.png" />
                <P>This indicates that a table has been made in the database to save the data for our FavoriteThing instances</P>
                <P>With the model created, our backend (server) is CRUD ready! Now we'll turn our attention the front end, and give our users the ability to interact with the model to create, retrieve, and update data.</P>
            </Section>
            <Section>
                <Heading>5. Create Files for Views</Heading>
                <P>We'll make three distinct views to display our <C>FavoriteThing</C>s </P>
                <div style={{ width: '75%' }}>
                    <List.Item
                        left={(props) => <List.Icon icon="format-list-bulleted" {...props} />}
                        title="FavoriteThingList"
                        description="Users will be able to: click a button to go to the AddFavoriteThing page, see a list of favorite things, click on a favorite thing to go to the EditFavoriteThing page, click on a button to delete a favorite thing"
                        right={() => <C>/</C>}
                    />
                    <List.Item
                        left={(props) => <List.Icon icon="plus" {...props} />}
                        title="CreateFavoriteThing"
                        description="Users will be able to: type in the name of a favorite thing, click a submit button to create a favorite thing object"
                        right={() => <C>/create</C>}
                    />
                    <List.Item
                        left={(props) => <List.Icon icon="pencil" {...props} />}
                        title="EditFavoriteThing"
                        description="Users will be able to: see the name of a favorite thing, and change it"
                        right={() => <C>/edit/:id</C>}
                    />
                </div>
                <P>Note: There is nothing magical about these component names. They do not have to contain the name of a model, they're simply good, descriptive names for what these components will do.</P>
                <P>First we'll create three files:</P>
                <P><C>src/views/FavoriteThingList.js</C></P>
                <P><C>src/views/CreateFavoriteThing.js</C></P>
                <P><C>src/views/EditFavoriteThing.js</C></P>
                <P>Then, we'll add the contents for each, one at a time:</P>
            </Section>
            <Section>
                <Heading>6. Create a view for the FavoriteThingList</Heading>
                <P>In <C>src/views/FavoriteThingList.js</C>, import <C>React</C> and <C>tether</C></P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether } from '@triframe/designer'

    
                `}</CodeBlock>
                <br />
                <P>Next, export a tethered component:</P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether } from '@triframe/designer'

                    export const FavoriteThingList = tether(function*(){

                    })
                `}</CodeBlock>
                <br />
                <P>Next, let's add a container and a header for the page:</P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether, Container, Heading } from '@triframe/designer'

                    export const FavoriteThingList = tether(function*(){
                        return (
                            <Container>
                                <Heading>Favorite Things</Heading>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <br />
                <P>Next, let's add a route for this view in <C>App.js</C>, by replacing <C>MainPage.js</C> with <C>FavoriteThingList</C>:</P>
                <CodeBlock title="src/App.js">{`
                   import React from 'react'
                   import { Provider, Route } from '@triframe/designer'
                   import { FavoriteThingList } from './views/FavoriteThingList'
                   
                   export default () => (
                       <Provider url={process.env.REACT_APP_BACKEND_URL}>
                           <Route exact path="/" component={FavoriteThingList} />
                       </Provider>
                   )
                `}</CodeBlock>
                <br />
                <P>At this point, you should be able to see "Favorite Things" in the browser.</P>
            </Section>
            <Section>
                <Heading>7. Create a view to CreateFavoriteThing</Heading>
                <P>In <C>./src/views/CreateFavoriteThing.js</C>, create another tethered component that returns a header.</P>
                <P>Next, let's add a route for the new view:</P>
                <CodeBlock title="src/App.js">{`
                   import React from 'react'
                   import { Provider, Route } from '@triframe/designer'
                   import { FavoriteThingList } from './views/FavoriteThingList'
                   import { CreateFavoriteThing } from './views/CreateFavoriteThing'

                   export default () => (
                       <Provider url={process.env.REACT_APP_BACKEND_URL}>
                           <Route exact path="/" component={FavoriteThingList} />
                           <Route exact path="/create" component={CreateFavoriteThing} />
                       </Provider>
                   )
                `}</CodeBlock>
                <br />
                <P>At this point, you should be able to go to the route "/create" in your browser and see the "Create Favorite Thing" header.</P>
            </Section>
            <Section>
                <Heading>8. Add a button to take users from the list view to the create view</Heading>
                <P>Lets start by adding a BubbleButton to the list view:</P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, BubbleButton, Area } from '@triframe/designer'

                    export const FavoriteThingList = tether(function*(){
                        return (
                            <Container>
                                <Heading>Favorite Things</Heading>
                                <Area inline alignX="right">
                                    <BubbleButton icon="plus"/>
                                </Area>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <P>Note: the <C>Area inline</C> keeps the <C>BubbleButton</C> from taking up the whole width of the page, and <C>alignX="right"</C> moves it to the right side of the view.</P>
                <P>Next, lets add an event listener to handle when the user presses the button:</P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, BubbleButton, Area } from '@triframe/designer'

                    export const FavoriteThingList = tether(function*({ redirect }){
                        return (
                            <Container>
                                <Heading>Favorite Things</Heading>
                                <Area inline alignX="right">
                                    <BubbleButton icon="plus" onPress={() => redirect('/create')} />
                                </Area>
                            </Container>
                        )
                    })
                `}</CodeBlock>
            </Section>
            <Section>
                <Heading>9. Add an input to the <C>CreateFavoriteThing</C> view</Heading>
                <P>First, import and render the TextInput:</P>
                <CodeBlock title="src/views/CreateFavoriteThing.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, TextInput } from '@triframe/designer'

                    export const CreateFavoriteThing = tether(function*(){
                        return (
                            <Container>
                                <Heading>Create Favorite Things</Heading>
                                <TextInput
                                    label="Name"
                                />
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <P>Next, we need to give TextInput a <C>stateful</C> value.</P>
                <P>We do this in TriFrame by creating <C>state</C> objects with the <C>yield</C> keyword:</P>
                <CodeBlock title="src/views/CreateFavoriteThing.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, TextInput } from '@triframe/designer'

                    export const CreateFavoriteThing = tether(function*(){
                        
                        const form = yield {
                            name: ''
                        }

                        return (
                            <Container>
                                <Heading>Create Favorite Things</Heading>
                                <TextInput
                                    label="Name"
                                    value={form.name} 
                                />
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <br/>
                <P>Lastly, add an event listener to handle when the <C>TextInput</C>'s value changes:</P>
                <CodeBlock title="src/views/CreateFavoriteThing.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, TextInput } from '@triframe/designer'

                    export const CreateFavoriteThing = tether(function*(){
                        
                        const form = yield {
                            name: ''
                        }

                        return (
                            <Container>
                                <Heading>Create Favorite Things</Heading>
                                <TextInput
                                    label="Name"
                                    value={form.name} 
                                    onChange={ value => form.name = value }
                                />
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <br/>
                <P>At this point, you should be able to type in the input, and see it's value change.</P>
            </Section>
            <Section>
                <Heading>10. Add a working submit button</Heading>
                <P>Next up, let's add a button for the user to create the <C>FavoriteThing</C>:</P>
                <CodeBlock title="src/views/CreateFavoriteThing.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, TextInput, Button } from '@triframe/designer'

                    export const CreateFavoriteThing = tether(function*(){
                        
                        const form = yield {
                            name: ''
                        }

                        return (
                            <Container>
                                <Heading>Create Favorite Things</Heading>
                                <TextInput
                                    label="Name"
                                    value={form.name} 
                                    onChange={ value => form.name = value }
                                />
                                <Button>
                                    Create
                                </Button>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <br/>
                <P>And an event listener for when the user presses the button:</P>
                <CodeBlock title="src/views/CreateFavoriteThing.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, TextInput, Button } from '@triframe/designer'

                    export const CreateFavoriteThing = tether(function*(){
                        
                        const form = yield {
                            name: ''
                        }

                        return (
                            <Container>
                                <Heading>Create Favorite Things</Heading>
                                <TextInput
                                    label="Name"
                                    value={form.name} 
                                    onChange={ value => form.name = value }
                                />
                                <Button onPress={ async () => {

                                }}>
                                    Create
                                </Button>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <P>We want this event listener to create a <C>FavoriteThing</C>, so we'll need to import the <C>FavoriteThing</C> model:</P>
                <CodeBlock title="src/views/CreateFavoriteThing.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, TextInput, Button } from '@triframe/designer'

                    export const CreateFavoriteThing = tether(function*({ Api }){

                        const { FavoriteThing } = Api
                        
                        const form = yield {
                            name: ''
                        }

                        return (
                            <Container>
                                <Heading>Create Favorite Things</Heading>
                                <TextInput
                                    label="Name"
                                    value={form.name} 
                                    onChange={ value => form.name = value }
                                />
                                <Button onPress={ async () => {

                                }}>
                                    Create
                                </Button>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <br/>
                <P>Next, we can use the <C>.create</C> <C>Model</C> method to create a <C>FavoriteThing</C> object:</P>
                <CodeBlock title="src/views/CreateFavoriteThing.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, TextInput, Button } from '@triframe/designer'

                    export const CreateFavoriteThing = tether(function*({ Api }){

                        const { FavoriteThing } = Api
                        
                        const form = yield {
                            name: ''
                        }

                        return (
                            <Container>
                                <Heading>Create Favorite Things</Heading>
                                <TextInput
                                    label="Name"
                                    value={form.name} 
                                    onChange={ value => form.name = value }
                                />
                                <Button onPress={ async () => {
                                    await FavoriteThing.create({ name: form.name })
                                }}>
                                    Create
                                </Button>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <br/>
                <P>Note: we are using <C>await</C> to wait for the create method to finish running. This method, like all <C>Model</C> methods, runs asynchronously because it involves client-server communication.</P>
                <P>Lastly, lets send the user back to the <C>FavoriteThingList</C> when they've finished creating a new <C>FavoriteThing</C>: </P>
                <CodeBlock title="src/views/CreateFavoriteThing.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, TextInput, Button } from '@triframe/designer'

                    export const CreateFavoriteThing = tether(function*({ Api, redirect }){

                        const { FavoriteThing } = Api
                        
                        const form = yield {
                            name: ''
                        }

                        return (
                            <Container>
                                <Heading>Create Favorite Things</Heading>
                                <TextInput
                                    label="Name"
                                    value={form.name} 
                                    onChange={ value => form.name = value }
                                />
                                <Button onPress={ async () => {
                                    await FavoriteThing.create({ name: form.name })
                                    redirect('/')
                                }}>
                                    Create
                                </Button>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <P>As a user, you should now be able to create a <C>FavoriteThing</C>, and be redirected to the <C>FavoriteThingList</C>, which is still mostly empty. We'll go ahead and build it out in this next section.</P>
            </Section>
            <Section>
                <Heading>11. Render a list of <C>FavoriteThing</C>s</Heading>
                <P>To display a list of <C>FavoriteThing</C> objects, we'll need to import the <C>FavoriteThing</C> model again:</P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, BubbleButton, Area } from '@triframe/designer'

                    export const FavoriteThingList = tether(function*({ Api, redirect }){

                        const  { FavoriteThing } = Api

                        return (
                            <Container>
                                <Heading>Favorite Things</Heading>
                                <Area inline alignX="right">
                                    <BubbleButton icon="plus" onPress={() => redirect('/create')} />
                                </Area>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <P>Then, we can get a list of objects using the <C>.list</C> method:</P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, BubbleButton, Area } from '@triframe/designer'

                    export const FavoriteThingList = tether(function*({ Api, redirect }){

                        const  { FavoriteThing } = Api

                        const things = yield FavoriteThing.list()

                        return (
                            <Container>
                                <Heading>Favorite Things</Heading>
                                <Area inline alignX="right">
                                    <BubbleButton icon="plus" onPress={() => redirect('/create')} />
                                </Area>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <br/>
                <P>Using <C>yield</C> is similar to using <C>await</C>, but in TriFrame, it also subscribes to updates on the requested data.</P>
                <P>Next, let's iterate over the list of <C>things</C>:</P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, BubbleButton, Area } from '@triframe/designer'

                    export const FavoriteThingList = tether(function*({ Api, redirect }){

                        const  { FavoriteThing } = Api

                        const things = yield FavoriteThing.list()

                        return (
                            <Container>
                                <Heading>Favorite Things</Heading>
                                {things.map( thing => (

                                ))}
                                <Area inline alignX="right">
                                    <BubbleButton icon="plus" onPress={() => redirect('/create')} />
                                </Area>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <br/>
                <P>We could use a lot of different types of elements to represent each <C>thing</C> (<C>Card</C>s, <C>li</C>s, etc.), but in this guide, we'll use <C>List.Item:</C></P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, BubbleButton, List } from '@triframe/designer'

                    export const FavoriteThingList = tether(function*({ Api, redirect }){

                        const  { FavoriteThing } = Api

                        const things = yield FavoriteThing.list()

                        return (
                            <Container>
                                <Heading>Favorite Things</Heading>
                                {things.map( thing => (
                                    <List.Item
                                        title={thing.name}
                                    />
                                ))}
                                <Area inline alignX="right">
                                    <BubbleButton icon="plus" onPress={() => redirect('/create')} />
                                </Area>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <P>As a user, you should now be able to see a list of the things you've created in the <C>FavoriteThingList</C> view.</P>
            </Section>
            <Section>
                <Heading>12. Create an <C>EditFavoriteThing</C> view</Heading>
                <P>export a tethered component with a header from <C>src/views/EditFavoriteThing.js</C></P>
                <CodeBlock  title="src/views/EditFavoriteThing.js">{`
                     import React from 'react'
                     import { tether, Container, Heading } from '@triframe/designer'
 
                     export const EditFavoriteThing = tether(function*(){
                         return (
                             <Container>
                                <Heading>Edit Thing:</Heading>
                             </Container>
                         )
                     })
                `}</CodeBlock>
                <P>In <C>./src/App.js</C>, add a route. This time, because our <C>EditFavoriteThing</C> view will display different data depending on which <C>thing</C>  has been selected, we'll also need a <C>parameter</C>.</P>
                <P>Note: there is nothing magic about how the parameter is named, the only thing that's important is that it's prefixed with a <C>:</C></P>
                <CodeBlock title="src/App.js">{`
                   import React from 'react'
                   import { Provider, Route } from '@triframe/designer'
                   import { FavoriteThingList } from './views/FavoriteThingList'
                   import { CreateFavoriteThing } from './views/CreateFavoriteThing'
                   import { EditFavoriteThing } from './views/EditFavoriteThing'


                   export default () => (
                       <Provider url={process.env.REACT_APP_BACKEND_URL}>
                           <Route exact path="/" component={FavoriteThingList} />
                           <Route exact path="/create" component={CreateFavoriteThing} />
                           <Route exact path="/edit/:id" component={EditFavoriteThing} />
                       </Provider>
                   )
                `}</CodeBlock>
                <br/>
                <P>Now, we just need to an event listener to send the user to <C>EditFavoriteThing</C> when they press a <C>thing</C> from the <C>FavoriteThingList</C>:</P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, BubbleButton, List } from '@triframe/designer'

                    export const FavoriteThingList = tether(function*({ Api, redirect }){

                        const  { FavoriteThing } = Api

                        const things = yield FavoriteThing.list()

                        return (
                            <Container>
                                <Heading>Favorite Things</Heading>
                                {things.map( thing => (
                                    <List.Item
                                        title={thing.name}
                                        onPress={() => redirect(\`/edit/\${thing.id}\`)}
                                    />
                                ))}
                                <Area inline alignX="right">
                                    <BubbleButton icon="plus" onPress={() => redirect('/create')} />
                                </Area>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <br />
                <P>Note: Because we are "using" (redirecting to) and not "defining" the route, we actually interpolate the id of a specific thing here, instead of using the <C>:id</C> token</P>
                <P>As a user, you should now be able to click on a <C>thing</C> in the <C>FavoriteThingList</C>, and be taken to the <C>EditFavoriteThing</C> view.</P>
            </Section>
            <Section>
                <Heading>12. Add a form to <C>EditFavoriteThing</C></Heading>
                <P>Now lets add a form so that the user can edit the name of a <C>thing</C> when in the <C>EditFavoriteThing</C> view.</P>
                <P>First, we'll need to get the id of the selected <C>thing</C> from the route params using <C>useParams</C>:</P>
                <CodeBlock title="src/views/EditFavoriteThing.js">{`
                     import React from 'react'
                     import { tether, Container, Heading } from '@triframe/designer'
 
                     export const EditFavoriteThing = tether(function*({ useParams }){

                        const { id } = yield useParams()

                        return (
                             <Container>
                                <Heading>Edit Thing:</Heading>
                             </Container>
                         )
                     })
                `}</CodeBlock>
                <P>Next, to retrieve the <C>FavoriteThing</C> object with using it's id, we'll need to import the <C>FavoriteThing</C> model...</P>
                <CodeBlock title="src/views/EditFavoriteThing.js">{`
                     import React from 'react'
                     import { tether, Container, Heading } from '@triframe/designer'
 
                     export const EditFavoriteThing = tether(function*({ Api, useParams }){

                        const { FavoriteThing } = Api

                        const { id } = yield useParams()

                        return (
                             <Container>
                                <Heading>Edit Thing:</Heading>
                             </Container>
                         )
                     })
                `}</CodeBlock>
                <br/>
                <P>...and then call the <C>.read</C> method:</P>
                <CodeBlock title="src/views/EditFavoriteThing.js">{`
                     import React from 'react'
                     import { tether, Container, Heading } from '@triframe/designer'
 
                     export const EditFavoriteThing = tether(function*({ Api, useParams }){

                        const { FavoriteThing } = Api

                        const { id } = yield useParams()

                        const thing = yield FavoriteThing.read(id)

                        return (
                             <Container>
                                <Heading>Edit Thing:</Heading>
                             </Container>
                         )
                     })
                `}</CodeBlock>
                <P>Finally, we can render another <C>TextInput</C>, using the retrieved <C>thing</C>'s name as the input's value:</P>
                <CodeBlock title="src/views/EditFavoriteThing.js">{`
                     import React from 'react'
                     import { tether, Container, Heading, TextInput } from '@triframe/designer'
 
                     export const EditFavoriteThing = tether(function*({ Api, useParams }){

                        const { FavoriteThing } = Api

                        const { id } = yield useParams()

                        const thing = yield FavoriteThing.read(id)

                        return (
                             <Container>
                                <Heading>Edit Thing:</Heading>
                                <TextInput
                                    label="Name"
                                    value={thing.name}
                                    onChange={value => thing.name = value}
                                />
                             </Container>
                         )
                     })
                `}</CodeBlock>
                <br/>
                <P>As a user, you should now be able change the name of a <C>thing</C> from the <C>EditFavoriteThing</C> page.</P>
                <P>Note: You may need to manually change the path in your browser to return to the <C>FavoriteThingList</C> view. You may want to add a button to the <C>EditFavoriteThing</C> component to make this navigation easier.</P>
                <P>Note: This will update the name of a <C>thing</C> automatically as the user types in the input- you may want to compare this component with the <C>CreateFavoriteThing</C> form, and use a combination of both to create an edit form with a submit button, if you prefer that behavior.</P>
            </Section>
            <Section>
                <Heading>13. Add a delete button to the <C>FavoriteThingList</C></Heading>
                <P>We can use the <C>right</C> prop on <C>List.Item</C> and the <C>ToggleButton</C> component to create a button for each <C>thing</C> in our <C>FavoriteThingList</C>:</P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, BubbleButton, List, ToggleButton } from '@triframe/designer'

                    export const FavoriteThingList = tether(function*({ Api, redirect }){

                        const  { FavoriteThing } = Api

                        const things = yield FavoriteThing.list()

                        return (
                            <Container>
                                <Heading>Favorite Things</Heading>
                                {things.map( thing => (
                                    <List.Item
                                        title={thing.name}
                                        onPress={() => redirect(\`/edit/\${thing.id}\`)}
                                        right={() => <ToggleButton icon="delete" />}
                                    />
                                ))}
                                <Area inline alignX="right">
                                    <BubbleButton icon="plus" onPress={() => redirect('/create')} />
                                </Area>
                            </Container>
                        )
                    })
                `}</CodeBlock>
                <P>Next, we can add an event listener that uses the <C>#delete</C> method to delete a <C>thing</C> when it's pressed:</P>
                <CodeBlock title="src/views/FavoriteThingList.js">{`
                    import React from 'react'
                    import { tether, Container, Heading, BubbleButton, List, ToggleButton } from '@triframe/designer'

                    export const FavoriteThingList = tether(function*({ Api, redirect }){

                        const  { FavoriteThing } = Api

                        const things = yield FavoriteThing.list()

                        return (
                            <Container>
                                <Heading>Favorite Things</Heading>
                                {things.map( thing => (
                                    <List.Item
                                        title={thing.name}
                                        onPress={() => redirect(\`/edit/\${thing.id}\`)}
                                        right={() => <ToggleButton onPress={() => thing.delete()} icon="delete" />}
                                    />
                                ))}
                                <Area inline alignX="right">
                                    <BubbleButton icon="plus" onPress={() => redirect('/create')} />
                                </Area>
                            </Container>
                        )
                    })
                `}</CodeBlock>
            </Section>
            <Section>
                <Heading>Summary</Heading>
                <P>We've now built out a tiny application that gives the user the ability to create, retrieve, update, and delete data.</P>
                <P>To build on this starting point, try adding more properties to your model, and more inputs to your form. Try using a <C>FileInput</C> to add an image of a favorite thing, or add a <C>DateInput</C> to manipulate a <C>datetime</C> property.</P>
            </Section>
        </>
    )
}