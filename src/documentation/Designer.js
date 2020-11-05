import { draw } from "./draw"
import { IconExplorer } from "../views/IconExplorer"

export const Designer = draw(({ a, any, warning, either, optional, jsx }) => (
    a.package({ title: 'Designer', name: '@triframe/designer' }, {
        
        Provider: a.component({
            url: a.string
                .describe('The url to an Arbiter backend serving an interface')
        })
            .describe('Should wrap the <App/>, providing models and routing utilities to any "tethered" components'),
        
        tether: a.function({
            tetheredComponent: a.function({
                props: a.object
                    .describe('Containing any props passed to the component'),
                Api: a.object
                    .describe('A object containing everything served by the connected Api'),
                redirect: a.function({ route: a.string })
                    .describe('A function to send the user to a different route'),
                useParams: a.function
                    .describe('Returns a Pipe that emits the current params from the route'),
                useContext: a.function({ context: a.function })
                    .describe('Accepts a generator function and turns it into a Pipe. Only one Pipe will be created per context function, and will be shared by all components that use that context')
                    .returns(a('Pipe').thatEmits(a.object))
            })
        })
            .returns(a.component),


        Navigation: a.group({

            Route: a.component({ path: a.string, component: a.component })
                .describe('Defines a route for a specific page/component within your application'),

            Appbar: a.component({
                children: jsx()
            })
                .describe('Used for the top bar of an application'),

            Drawer: a.component({
                open: a.boolean,
                onClose: a.function,
                render: a.component
                    .describe('Used to render the contents of the Drawer'),
                children: jsx()
                    .describe('This is the area the Drawer will open over (usually the entire App)')
            }),

            Redirect: a.component({
                to: a.string
                    .describe('The route to send the user to')
            })
                .describe('When rendered, a Redirect sends the user to a new route')

        }),


        Layout: a.group({

            Container: a.component({
                slim: a.optional.boolean
                    .describe('When true, the Container is rendered with no margin'),
                children: jsx()
            })
                .describe('A wrapper for a large block of content (usually a page) in an application. Will render it\'s children inside of a ScrollView, and apply margin (default 50px) to the left and right of it\'s content'),

            Area: a.component({
                alignX: a.optional.string
                    .describe('One of: left | right | center | justify'),
                alignY: a.optional.string
                    .describe('One of: top | bottom | center '),
                inline: a.optional.boolean
                    .describe('Causes contents to be displayed inline rather than vertically'),
                flex: a.optional.boolean
                    .describe('When true, causes the Area to fill the remaining space in the parent'),
                children: jsx()
            })
                .describe('A component used to align it\'s content within the parent element'),

            Section: a.component({
                children: jsx()
            })
                .describe('Renders\'s a View with standardized top and bottom margin to denote a change in content (margin defaults to 10px)'),

            Grid: a.component({
                base: a.optional.number
                    .describe('The number of spaces within the grid. Each of the grids columns will take up one or more of these spaces'),
                gutter: a.optional.number
                    .describe('The margin to apply to each column expressed as a percentage of the parent containers width'),
                children: jsx()
            })
                .describe('Creates a mobile-first grid view'),

            Column: a.component({
                xs: a.optional.number,
                sm: a.optional.number,
                md: a.optional.number,
                lg: a.optional.number,
                xl: a.optional.number,
                children: jsx()
            })
                .describe('A column within a Grid. Accepts props specifying the number of spaces to take up for a given screen size'),

            Divider: a.component
                .describe('For horizonal rule lines')
        }),

        Typography: a.group({
            Title: a.component({
                children: jsx()
            })
                .describe('For page titles'),

            Heading: a.component({
                children: jsx()
            })
                .describe('For section headings'),

            Subheading: a.component({
                children: jsx()
            })
                .describe('For sub-section headings'),

            Paragraph: a.component({
                children: jsx()
            })
                .describe('For blocks of text'),

            Caption: a.component({
                children: jsx()
            })
                .describe('For annotative text'),

            Text: a.component({
                children: jsx()
            })
                .describe('For style-free text'),

            Icon: a.component({
                name: a.string
                    .describe('The name of an icon from the material community icon set')
            })
                .annotate(IconExplorer)
        }),

        Popups: a.group({
            Modal: a.component({ visible: a.boolean, onPress: a.function, onDismiss: a.function, children: jsx() })
                .describe('A popup that will obstruct most of the page'),
            
            Menu: a.component({
                visible: a.boolean, 
                onPress: a.function,
                onDismiss: a.optional.function, 
                anchor: either(jsx(), a.object({ x: a.number, y: a.number})),
                children: jsx() 
            })
                .describe('Creates a pop-up menu (similar to the context menu that opens on right-click)'),
            
            "Menu.Item": a.component({ 
                title: a.optional.string, 
                icon: a.optional.string, 
                onPress: a.optional.function
            })
                .describe('An item to render inside of a <Menu/>'),

            Snackbar: a.component({ 
                visible: a.boolean,
                onDismiss: a.function,
                duration: a.number,
                action: a.object({
                    label: a.string,
                    onPress: a.function
                }),
                children: jsx()
            })
                .describe('A pop-up message (a toast message)')
        }),

        Buttons: a.group({
            
            Button: a.component({
                onPress: a.function,
                mode: a.optional.string
                    .describe('One of: contained | outlined | flat. Defaults to "contained"'),
                icon: a.optional.string,
                children: jsx()
            })
                .describe('Creates a basic button (as made popular by Android\'s UI)'),
           
            BubbleButton: a.component({
                icon: a.string,
                onPress: a.function,
                size: a.optional.string
                    .describe('One of  xs | md | lg. Defaults to "lg"'),
            })
                .describe('Creates a floating action button'),     
            
            ToggleButton: a.component({
                onPress: a.function,
                status: a.string
                    .describe('One of: checked | unchecked'),
                icon: a.string,
            })
                .describe('Creates a button which can be toggled between active and inactive (like Bold and Italic buttons in a text editor)')
        }),

        Material: a.group({
            Card: a.component({ elevation: a.optional.number, children: jsx() })
                .describe('Creates the appearance of a card, to group content on a page'),
            Chip: a.component({
                mode: a.optional.string
                    .describe('One of: flat | outlined. Defaults to "flat"'),
                icon: a.optional.string,
                avatar: a.optional.jsx(),
                selected: a.optional.boolean, 
                disabled: a.optional.boolean,
                onPress: a.optional.function,
                onLongPress: a.optional.function,
                onClose: a.optional.function,
                children: jsx()
            }),
            Badge: a.component({
                children: jsx()
            }),
            "Avatar.Image": a.component({
                source: a.string
            }), 
            "Avatar.Icon": a.component({
                icon: a.string
            }), 
            Surface: a.component({
                children: jsx()
            })
                .describe('A base material for other components'),
            "List.Item": a.component({
                left: a.optional.component,
                title: a.string,
                description: a.optional.string,
                onPress: a.optional.function,
                right: a.optional.component
            }),
            "List.Accordion": a.component({
                left: a.optional.component,
                title: a.string,
                description: a.optional.string,
                onPress: a.optional.function,
                id: either(a.optional.number, a.optional.string)
                    .describe('Only in conjunction with List.AccorionGroup'),
                children: jsx()
            })
                .describe('A dropdown to contain <List.Item />\'s '),
            "List.AccordionGroup": a.component({
                expandedId: a.number,
                onAccordionPress: a.function({ accordionId: either(a.number, a.string) })
            })
                .describe('Wraps several <List.Accordion/>\'s and ensures that only one is open at a time')
        }),

        Inputs: a.group({
            TextInput: a.component({
                label: a.string
                    .describe('A label the user sees to identify the input'),
                value: a.string,
                onChange: a.function({ value: a.string })
                    .describe('Invoked on each keystroke within the input'),
                mode: a.optional.string
                    .describe('One of: outlined | flat'),
            }),
            PasswordInput: a.component({
                value: a.string,
                onChange: a.function({ value: a.string })
                    .describe('Invoked on each keystroke within the input'),
                mode: a.optional.string
                    .describe('One of: outlined | flat'),
            }),
            DateInput: a.component({
                value: a.date,
                onChange: a.function({ value: a.date })
                    .describe('Invoked when a new date is selected'),
                mode: a.optional.string
                    .describe('One of: outlined | flat'),
            }),
            DateTimeInput: a.component({
                value: a.date,
                onChange: a.function({ value: a.date })
                    .describe('Invoked when a new date or time is selected'),
                mode: a.optional.string
                    .describe('One of: outlined | flat'),
            }),
            ToggleInput: a.component({
                value: a.boolean,
                onChange: a.function({ value: a.boolean })
                    .describe('Invoked when the toggle is clicked')
            }),
            FileInput: a.component({
                onChange: a.function({ fileUrl: a.string })
                    .describe('Invoked with a url to a file after one has been selected and uploaded')
            }),
            HelperText: a.component({
                type: a.optional.string
                    .describe('One of: info | error. Defaults to "info"'),
                visible: a.optional.boolean,
                children: jsx()
            }),
            TextField: a.component({
                value: a.string,
                onChangeText: a.function({ value: a.string })
                    .describe('Invoked on each keystroke within the input')
            }),
            ToggleSwitch: a.component({
                value: a.boolean,
                onPress: a.function
                    .describe('Invoked each time the radio button is clicked')
            }),
            RadioButton: a.component({
                status: a.string
                    .describe('One of checked | unchecked'),
                onPress: a.function
                    .describe('Invoked each time the radio button is clicked')
            }),
            Checkbox: a.component({
                status: a.string
                    .describe('One of checked | unchecked'),
                onPress: a.function
                    .describe('Invoked each time the radio button is clicked')
            }),

        }),
    })
))