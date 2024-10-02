import React, { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from 'react-toastify'
import { useGetUserDetailsQuery, useUpdateUserMutation } from '../../slices/userApiSlice'
import Message from '../../components/Message';


const UserEditScreen = () => {
    const {id:userId} = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState('false');
    
    const {data:user, isLoading, refetch, error} = useGetUserDetailsQuery(userId);
    const [updateUser,  {isLoading:loadingUpdate}] = useUpdateUserMutation();

    const navigate = useNavigate();

    useEffect(()=> {
        if(user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        };
    },[user])


    const submitHandler = async (e) => {
        e.preventDefault();

        try {
          await updateUser({
            userId,
            name,
            email,
            isAdmin
          }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
          toast.success('User updated');
          refetch();
          navigate('/admin/userList');
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      };

 

    return (
    <div>
      <Link to="/admin/userList" className='btn btn-light my-3'>Go Back</Link>
        <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader/> }
            {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger"></Message>
      ) : (
        <>
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='name'>
                <Form.Label>
                    Name
                </Form.Label>
                <Form.Control
                type='text'
                placeholder='Enter Name'
                value={name}
                onChange={(e)=> setName(e.target.value)}
                >

                </Form.Control>
            </Form.Group>

            <Form.Group controlId='price'>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter price'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Form.Control>
            </Form.Group>

             
            <Form.Group controlId='isAdmin' className='my-3'>
               
              <Form.Check
              type="checkbox"
              label="Is Admin"
              checked={isAdmin}
              onChange={(e)=> setIsAdmin(e.target.checked) }>

              </Form.Check>
            </Form.Group>

            <Button
            type='submit'
            variant='primary'
            className='my-2'
            >
              Update  
            </Button>
        </Form>
        </>
      )}
        </FormContainer>
    </div>
  )
}

export default UserEditScreen
