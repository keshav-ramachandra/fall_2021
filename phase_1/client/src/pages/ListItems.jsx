import React, { Component } from 'react'
import ReactTable from 'react-table'
import api from '../api'

import styled from 'styled-components'

import 'react-table/react-table.css'

const Wrapper = styled.div`
    padding: 100px 40px 40px 40px;
`

const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

class UpdateItem extends Component {
    updateItem = event => {
        event.preventDefault()

        window.location.href = `/items/update/${this.props.id}`

    }

    render() {
        return <Update onClick={this.updateItem}>Update</Update>
    }
}

class DeleteItem extends Component {
    deleteItem = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do tou want to delete the item permanently?`,
            )
        ) {
            api.deleteItemById(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteItem}>Delete</Delete>
    }
}

class ListItems extends Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            columns: [],
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllItems().then(items => {
            this.setState({
                items: items.data.data,
                isLoading: false,
            })
        })
    }

    render() {
        const { items, isLoading } = this.state

        const columns = [
            {
                Header: 'Name',
                accessor: 'name',
                filterable: false,
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
            },
            {
                Header: 'Quantity',
                accessor: 'quantity',
                filterable: false,
                Cell: row => <div style={{ textAlign: "center" }}>{row.value}</div>
            },
            {
                Header: 'Price',
                accessor: 'price',
                filterable: false,
                 Cell: row => <div style={{ textAlign: "center" }}>$ {row.value}</div>

            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span style={{ textAlign: "center", width: "50px"  }}>
                            <DeleteItem id={props.original._id} />
                        </span>
                    )
                },
            },
            {
                Header: '',
                accessor: '',
                Cell: function(props) {
                    return (
                        <span style={{ textAlign: "center", width: "50px" }}>
                            <UpdateItem id={props.original._id} />
                        </span>
                    )
                },
            },
        ]

        let showTable = true
        if (!items.length) {
            showTable = false
        }

        return (
            <Wrapper>
                {showTable && (
                    <ReactTable
                        data={items}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={false}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default ListItems