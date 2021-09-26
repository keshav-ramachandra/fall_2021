import React, { Component } from 'react'
import api from '../api'

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

class UpdateItems extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            name: '',
            quantity: '',
            price: '',
        }
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

    handleChangeInputPrice = async event => {
        const price = event.target.validity.valid
            ? event.target.value
            : this.state.price

        this.setState({ price })
    }

   handleChangeInputQuantity = async event => {
        const quantity = event.target.validity.valid
            ? event.target.value
            : this.state.quantity

        this.setState({ quantity })
    }



    handleUpdateItem = async () => {
        const { id, name, price, quantity } = this.state
        const payload = { name, price, quantity }

        await api.updateItemById(id, payload).then(res => {
            //window.alert(`Item updated`)
            window.location.href = '/items/list'
            this.setState({
                name: '',
                price: '',
                quantity: '',
            })
        })
    }

    componentDidMount = async () => {
        const { id } = this.state
        const item = await api.getItemById(id)

        this.setState({
            name: item.data.data.name,
            price: item.data.data.price,
            quantity: item.data.data.quantity,
        })
    }

    render() {
        const { name, price, quantity } = this.state
        return (
            <Wrapper>
                <Title>Create Item</Title>

                <Label>Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />


               <Label>Quantity: </Label>
                <InputText
                    type="number"
                    step="1"
                    lang="en-US"
                    min="1"
                    max="100"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={quantity}
                    onChange={this.handleChangeInputQuantity}
                />

                <Label>Price: </Label>
                <InputText
                    type="number"
                    step="0.1"
                    lang="en-US"
                    min="0"
                    max="10"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={price}
                    onChange={this.handleChangeInputPrice}
                />



                <Button onClick={this.handleUpdateItem}>Update Item</Button>
                <CancelButton href={'/items/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default UpdateItems