import React from 'react'
import PropTypes from 'prop-types'
import { saveTable } from './server-api'
import { isItNumber } from './parse-number'


export default class Table extends React.Component
{
    constructor(props)
    {
        super()

        this.state =
            {
                name: props.table.name,
                headers: props.table.headers,
                data: props.table.data,
                sortby: null,
                descending: false,
                edit: null,  // {row: index, cell: index}
                edit_value: ''
            }
        this.data = Array.from(this.state.data)  //saving data to go back from sort
        this.deleted_stack = []  //contains a rows that was deleted for backup (ctrl + z)
        this.numbers_idx = []   //contains the column indexes where value is number (for sort and parsing)
        this.state.headers.map((h, i) =>
        {
            if (h.type === 'number')
                return this.numbers_idx.push(i)
            else
                return
        })

        this.sort = this.sort.bind(this)
        this.parseNumberInput = this.parseNumberInput.bind(this)
        this._showEditor = this._showEditor.bind(this)
        this._save = this._save.bind(this)
        this._getEmptyRow = this._getEmptyRow.bind(this)
        this._getCell = this._getCell.bind(this)
        this._deleteRow = this._deleteRow.bind(this)
        this.parseNumberInput = this.parseNumberInput.bind(this)
    }

    componentWillReceiveProps(nextprops)
    {
        if (this.state.edit)
            return

        this.numbers_idx = []   //contains the column indexes where value is number (for sort and parsing)
        this.state.headers.map((h, i) =>
        {
            if (h.type === 'number')
                return this.numbers_idx.push(i)
            else
                return
        })

        this.setState
            ({
                name: nextprops.table.name,
                headers: nextprops.table.headers,
                data: nextprops.table.data,
                sortby: null,
                descending: false
            })
    }

    sort(e)
    {
        if (this.state.edit !== null) return         //if some cell is edditing now

        if (e.target.innerHTML === ' Game') return  //this.column can't be edited

        let column = e.target.cellIndex;
        let data = Array.from(this.state.data)
        let descending = this.state.sortby === column &&    //if it was click on the column that was already sorted
            !this.state.descending;

        data.sort((a, b) =>
            descending
                ? (a[column] < b[column] ? 1 : -1)
                : (a[column] > b[column] ? 1 : -1)
        )

        descending ? e.target.classList.add('caret-down') : e.target.classList.add('caret-up')


        this.setState
            ({
                data: data, sortby: column,
                descending: descending
            })
    }

    _showEditor(e) 
    {
        let rowidx = parseInt(e.target.dataset.row)
        let cellidx = e.target.cellIndex
        let edit_value = ''

        if (this.state.data[rowidx])
            edit_value = this.state.data[rowidx][cellidx]

        this.setState
            ({
                edit:
                {
                    row: parseInt(e.target.dataset.row),
                    cell: e.target.cellIndex,
                },
                edit_value: edit_value
            })
    }

    _save(e)
    {
        e.preventDefault()
        let input = e.target.firstChild
        let data = this.state.data.slice()

        if (!data[this.state.edit.row]) //if it is last empty row
        {
            let new_arr = new Array(this.state.headers.length)
            for (let i = 0; i < new_arr.length; i++) 
            {
                new_arr[i] = ''
            }
            data.push(new_arr)
        }
        data[this.state.edit.row][this.state.edit.cell] = input.value

        this.setState
            ({
                edit: null,
                data: data
            })

        saveTable(this.state.name,
            {
                name: this.state.name,
                headers: this.state.headers,
                data: data
            })
    }

    _deleteRow(e)
    {
        let rowidx = parseInt(e.target.dataset.row)
        let data = this.state.data.slice()

        this.deleted_stack.push({ row: this.state.data[rowidx], rowidx })

        data = data.filter((value, i) =>
            i !== rowidx)

        this.data = data
        this.setState
            ({
                data: data
            })

        saveTable(this.state.name,
            {
                name: this.state.name,
                headers: this.state.headers,
                data: data
            })
    }

    //removes the possibility to defocus on input before saving
    _blur(e)
    {
        e.target.focus()
    }

    //returns a cell with value or input
    _getCell(rowidx, idx, empty_row = false)
    {
        let edit = this.state.edit
        let content = null
        let input =
            <form onSubmit={this._save}>
                <input data-row={rowidx}
                    ref={'edited_input'}
                    data-cell={idx}
                    autoFocus
                    onChange={this.parseNumberInput}
                    onBlur={this._blur}
                    className='table-input'
                    type="text"
                    value={this.state.edit_value}
                />
            </form>

        if (empty_row)  // if it's creating cells for an empty row

            if (edit && edit.row === rowidx && edit.cell === idx) //if this cell must be edited
                content = input
            else
                content = ''


        else if (!edit)
            content = this.state.data[rowidx][idx]
        else
            if (edit.row === rowidx && edit.cell === idx)
                content = input
            else
                content = this.state.data[rowidx][idx]

        let td =
            (<td key={idx}
                className='cell'
                data-row={rowidx}
            > {content}
            </td>)

        return td
    }

    _getEmptyRow()
    {
        let arr = []
        let last_rowidx = this.state.data.length

        for (let i = 0; i < this.state.headers.length; ++i)
        {
            arr.push(this._getCell(last_rowidx, i, true))
        }

        return arr
    }

    parseNumberInput(e)
    {
        let cell_idx = parseInt(e.target.dataset.cell)
        let value = e.target.value
        e.target.focus()

        if (!this.numbers_idx.includes(cell_idx) || value === '') //if type of this column isn't a number or value is empty
        {
            this.setState({ edit_value: value })

            return
        }

        if (!isItNumber(value)) return

        if (value && value[value.length - 1] === '.' && value.length > this.state.edit_value.length) //if user's inputed a   '.' it will add a selected '0'
        {
            this.setState({ edit_value: value + '0' }, () =>    
            {
                let input = this.refs.edited_input
                let length = input.value.length
                this.refs.edited_input.setSelectionRange(length - 1, length)
            })

            return
        }

        this.setState({ edit_value: value })
    }

    render()
    {
        return (
            <table id='main-table' onKeyDown={this.keyboardHandler} tabIndex="0">
                <thead onClick={this.sort}>
                    <tr className=" table-row table-row-head" >
                        {
                            this.state.headers.map((item, i) =>
                                <td key={i}
                                    className={'cell ' +
                                        (
                                            this.state.sortby === i ?
                                                this.state.descending ? 'caret-up' : 'caret-down'
                                                : ''
                                        )}
                                > {item.name}
                                </td >)
                        }
                    </tr>
                </thead>
                <tbody onDoubleClick={this._showEditor}>
                    {
                        this.state.data.map((row, rowidx) =>
                            <tr className='table-row' key={rowidx}>
                                {
                                    row.map((value, idx) =>
                                    {
                                        return this._getCell(rowidx, idx)
                                    })
                                }
                                <td className="delete-btn">
                                    <img onClick={this._deleteRow} data-row={rowidx} src="./images/minus-icon.png" />
                                </td>
                            </tr>
                        )}
                    <tr className='table-row'>
                        {this._getEmptyRow()}
                    </tr>
                </tbody>
            </table>)
    }
}

Table.propTypes =
    {
        name: PropTypes.string,
        headers: PropTypes.arrayOf(PropTypes.string),
        data: PropTypes.arrayOf(PropTypes.array)
    }