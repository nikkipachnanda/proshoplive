import { Message } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Row, Table } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'
import { useProfileMutation } from '../slices/userApiSlice'
import { setCredentials } from '../slices/authSlice'
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice'
import { FaTimes } from 'react-icons/fa'
import { Link } from 'react-router-dom'

    
const ProfileScreen = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 


  const dispatch = useDispatch();
  const {userInfo} = useSelector((state)=> state.auth);

  const [updateProfile, {isLoading:laodingUpdateProfile}] = useProfileMutation();
  const { data:orders, isLoading, error } = useGetMyOrdersQuery();
    console.log("order data" + JSON.stringify(orders));
  useEffect(()=> {
    if(userInfo) {
        setName(userInfo.name);
        setEmail(userInfo.email)
    }
  },[userInfo, userInfo.name, userInfo.email]);
  


  const submitHandler = async (e)=> {
       e.preventDefault();
       console.log("submitHandler")
       if(password !=confirmPassword) {
         toast.error("Password do not match");
       }
       else {
        try {
            const res = await updateProfile({_id:userInfo._id,name,email, password}).unwrap();
            dispatch(setCredentials(res));
            toast.success('Profile updated successfully');
        }
        catch (err) {
                toast.error(err?.data?.message || err.error);
        }
       }
  };

  return (
    <div>
        <h2>Profile Screen</h2>
        <Row>
           <Col md={3}>
            <h4>User Profile</h4>
              <Form onSubmit={submitHandler}>
                <Form.Group controlId='name' className='my-2' >
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    type='name'
                    placeholder='Enter Name'
                    value={name}
                    onChange={(e)=> setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email' className='my-2' >
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    type='email'
                    placeholder='Enter Email'
                    value={email}
                    onChange={(e)=> setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                
                <Form.Group controlId='password' className='my-2' >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type='password'
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e)=> setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                 
                <Form.Group controlId='confirmPassword' className='my-2' >
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                    type='password'
                    placeholder='Confirm Password'
                    value={confirmPassword}
                    onChange={(e)=> setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className="my-2" >
                    Update 
                </Button> 
                { laodingUpdateProfile && <Loader/>}
             </Form>   
           </Col> 
           <Col md={9}>
        <h2>My Orders</h2>
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant='danger'>
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <Table striped hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    <Button
                      as={Link}
                      to={`/order/${order._id}`}
                      className='btn-sm'
                      variant='light'
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
        </Row>
      
    </div>
  )
}

export default ProfileScreen
