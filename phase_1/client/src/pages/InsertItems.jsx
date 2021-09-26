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

class InsertItems extends Component {
    constructor(props) {
        super(props)

        this.state = {
            name: '',
            quantity: '',
            price: '',
        }
    }

    handleChangeInputName = async event => {
        const name = event.target.value
        this.setState({ name })
    }

     handleChangeInputQuantity = async event => {
            const quantity = event.target.validity.valid
                ? event.target.value
                : this.state.quantity

            this.setState({ quantity })
     }

    handleChangeInputPrice = async event => {
        const price = event.target.validity.valid
            ? event.target.value
            : this.state.price

        this.setState({ price })
    }


    handleIncludeItem = async () => {
        const { name, quantity , price } = this.state
        const payload = { name, quantity, price  }

        await api.insertItem(payload).then(res => {
            window.location.href = '/items/list'
            this.setState({
                name: '',
                quantity: '',
                price: '',
            })

        })
    }

    render() {
        const { name, quantity, price } = this.state
        return (
            <Wrapper>
                <Title>Add Item</Title>

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
                    max="10000"
                    pattern="[0-9]+([,\.][0-9]+)?"
                    value={price}
                    onChange={this.handleChangeInputPrice}
                />



                <Button onClick={this.handleIncludeItem}>Add Item</Button>
                <CancelButton href={'/items/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default InsertItems