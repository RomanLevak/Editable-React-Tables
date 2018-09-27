import React, { Component } from 'react'
import '../styles/tables-menu.less'
import { loadTable } from './server-api'
import { createNew } from './server-api'

export default class TableMenu extends Component
{
    constructor(props)
    {
        super()
        this.state =
            {
                hide: props.hide,
                loaded: false,
                items: [],
                edit: false         //if input for creating new table opened
            }

        this.changeTable = props.changeTable
        this.switchMenu = this.switchMenu.bind(this)
        this.clickHandler = this.clickHandler.bind(this)
        this.showEditor = this.showEditor.bind(this)
        this.save = this.save.bind(this)
    }

    switchMenu()
    {
        this.setState({ hide: !this.state.hide })
    }

    clickHandler(e)
    {
        if (this.state.edit) return

        let tablename = e.target.dataset.name
        loadTable(tablename)
            .then(table => this.props.changeTable(table))
    }

    showEditor()
    {
        this.setState({ edit: true })
    }

    save(e)
    {
        e.preventDefault()
        let newTable = { name: e.target.firstChild.value }
        createNew(newTable)
            .then(() =>
            {
                let newItems = this.state.items.slice()
                this.setState({ items: newItems })
            })
    }

    componentDidMount()
    {
        fetch('http://localhost:2725/get/tableslist')
            .then(res =>
                res.text()
            )
            .then(result => 
            {
                result = JSON.parse(result)
                result = JSON.parse(result)
                let table_list = result.list
                this.setState({ loaded: true, items: table_list })
            })
    }

    render()
    {
        if (this.state.hide)
            return (
                <div className="menu-button" onClick={this.switchMenu}>
                    <img src="./images/menu-icon.svg" />
                </div>)

        if (!this.state.loaded) // if it's not hidden bun isn't loaded
            return (
                <div className="table-menu">
                    <div className="table-menu__head">
                        <span className="table-menu__head--title">Table List</span>
                        <div onClick={this.switchMenu} className="table-menu__head--btn">
                            <img src="./images/close-icon.png" />
                        </div>
                    </div>
                    <div className="table-menu__items">
                        <div className="load-icon">
                            <img src="./images/loading-icon.png" className="load-icon__img" />
                        </div>
                        <div className="table-menu__item add-btn">+</div>
                    </div>
                </div>)

        return (    //if it'll loaded and not hidden
            <div className="table-menu">
                <div className="table-menu__head">
                    <span className="table-menu__head--title">Table List</span>
                    <div onClick={this.switchMenu} className="table-menu__head--btn">
                        <img src="./images/close-icon.png" />
                    </div>
                </div>
                <div className="table-menu__items">
                    {this.state.items.map((table, i) =>
                        <div key={i} className="table-menu__item">
                            <div className="table-menu__item--img">
                                <img onClick={this.clickHandler} data-name={table}  //saves tablename to get on clicking 
                                    src="./images/table-icon.png" />
                            </ div>
                            <span className="table-menu__item--name">{table}</span>
                        </div>)}

                    {this.state.edit ?
                        <form onSubmit={this.save}>
                            <input autoFocus
                                onSubmit={this.save}
                                onBlur={this._blur}
                                className='table-input table-menu__input'
                                type="text"
                            />
                        </form>
                        : <div onClick={this.showEditor} className="table-menu__item add-btn">+</div>
                    }
                </div>
            </div>)
    }
}
