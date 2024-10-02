import React from 'react'
import { Button, Card, Col, Form, Image, ListGroup, Row } from 'react-bootstrap'
import { FaTrash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart } from '../slices/cartSlice'

const CartScreens = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
   const cart = useSelector((state) => state.cart);
   const {cartItems} = cart; 

   const addCartHandler  = async (product, qty)=> 
    {
        dispatch(addToCart({...product, qty}));
    }

    const removeFromCartHandler  = async (id)=> 
        {
            dispatch(removeFromCart(id));
        }

    return (
    <div>
        <Row>
            <Col md={8}>
            < h1 style={{marginBottom:'20px'}}
            > Shopping Cart               
            </h1>
            { cartItems.length === 0 ?
                (<Message>
                    Your cart is empty <Link to="/"></Link>
                </Message>
                ) :
                (
                    <ListGroup variant='flush'>
                        { cartItems.map((item)=>(
                        <ListGroup key={item._id}>
                            <Row>
                                <Col md={3} style={{marginBottom:'20px'}}>
                                    <Image src={item.image} alt={item.name} width={ 200}></Image>
                                </Col>

                                <Col md={3}>
                                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                                </Col>

                                <Col md={2}>
                                    {item.price}
                                </Col>

                                <Col md={2}>
                                <Form.Control as="select" value={item.qty} 
                                onChange={(e)=> addCartHandler (item, Number(e.target.value))}
                                    >
                                    {[...Array(item.countInStock).keys()].map((x)=> (
                                    <option key={x+1} value={x+1}>
                                        {x+1}
                                    </option>
                                    ) )}
                      </Form.Control>
                                </Col>
                                <Col md={2}>
                                <Button type='button' variant='light' onClick={()=>removeFromCartHandler(item._id)}>
                                    <FaTrash/>
                                </Button>
                                </Col>
                            </Row>        
                          </ListGroup>
                        ))}
                    </ListGroup>   
                )
            }
            </Col>

            <Col md={4} >
                <Card style={{padding:'10px'}}>
                    <ListGroup.Item variant='flush'>
                        <h2>Subtotal ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) </h2>
                    ${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <Button type='button' className='btn-block'
                        disabled= {cartItems.length === 0 }
                        >Proceed To Checkout</Button>
                    </ListGroup.Item>

                </Card>
            </Col>
        </Row>
    </div>

)
}

export default CartScreens
