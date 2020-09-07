import React from 'react'
import { Switch, Route, Redirect } from '@triframe/designer'
import { VUser } from '../User'
import { Splash } from '../Splash'

export const Public = () => (
    <Switch>
        <Route path="/login" component={VUser.Login} />
        <Route path="/forgot-password" component={VUser.ForgotPassword} />
        <Route path="/reset-password/:key" component={VUser.ResetPassword} />
        <Route path="/register" component={VUser.Register} />
        <Route exact path="/" component={Splash} />
        <Route path="/" render={() => <Redirect to="/" /> } />
    </Switch>
)