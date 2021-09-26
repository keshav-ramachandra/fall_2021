import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { ListItems, InsertItems, UpdateItems } from '../pages'

import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/items/list" exact component={ListItems} />
                <Route path="/items/create" exact component={InsertItems} />
                <Route
                    path="/items/update/:id"
                    exact
                    component={UpdateItems}
                />
            </Switch>
        </Router>
    )
}

export default App