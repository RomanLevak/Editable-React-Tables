import '../styles/index.less'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import Table from './table.jsx'
import TablesMenu from './tables-menu.jsx'
import { loadLastTable } from './server-api'

class App extends React.Component
{
    constructor()
    {
        super()
        this.changeTable = this.changeTable.bind(this)
        this.state =
            {
                menu_open: false,
                loaded: false
            }
    }

    changeTable(table)
    {
        this.setState
            ({
                menu_open: true,
                table: table
            })
    }

    componentDidMount()
    {
        loadLastTable()
            .then(res =>
                this.setState
                    ({
                        table: res,
                        loaded: true
                    }))
    }

    render()
    {
        if (!this.state.loaded)
            return <span>loading...</span>

        return (
            <div autoFocus className="wrap">
                <header className="head">
                    <h1 className="title">{this.state.table.name}</h1>
                </header>
                <Table changeTable={this.changeTable}
                    table={this.state.table}
                />
                <TablesMenu changeTable={this.changeTable} hide={true} />
            </div>)
    }
}

class Router extends React.Component
{
    render()
    {
        return (
            < BrowserRouter >
                < Route path='/' >
                    <App />
                </Route >
            </BrowserRouter >)
    }
}

ReactDOM.render(< Router />, document.getElementById('main-wrapper'))