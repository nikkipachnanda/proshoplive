import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import products from "../products";
import { Row, Col, Image, ListGroup, Card, Button, Form, ListGroupItem } from "react-bootstrap";
import Rating from "../components/Rating";
import { useCreateReviewMutation, useGetProductDetailsQuery } from "../slices/productsApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import { toast } from "react-toastify";



//import axios from 'axios';

const ProductScreen = () => {
  // const [product, setProduct] = useState({});

  // const product = products.find((p)=> p._id === productId);

  // useEffect(()=>
  //     {

  //       const fetchProduct = async ()=>
  //         {
  //           const {data} = await axios.get(`/api/products/${productId}`);
  //           setProduct(data)
  //         }

  //         fetchProduct();

  //     },[])

  // console.log(products);

  const { id: productId } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment,setComment] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const {userInfo} = useSelector((state)=> state.auth);

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  console.log("data cart" + JSON.stringify(product));

  const addToCartHandler =()=> 
    {
      dispatch(addToCart({...product, qty}));
      navigate('/cart');
    }

    const submitHandler = async (e) => {
      e.preventDefault();
      console.log("test");
      try {
        await createReview({
          productId,
          rating,
          comment,
        }).unwrap();
        refetch();
        toast.success('Review created successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    };  


  console.log("data" + JSON.stringify(product));
  return (
    <div>
      <div> Products Screens</div>

      <Link className="btn btn-light my-3" to="/">
        {" "}
        Go Back
      </Link>

      {isLoading ? (
        <h2>
            <Loader/>
        </h2>
      ) : error ? (
        <Message variant='danger'>{error?.data.message || error.error}</Message>
      ) : (
        <>
          <Row>
            <Col md={5}>
              {" "}
              <Image src={product.image} alt={product.name} fluid></Image>{" "}
            </Col>
            <Col md={3}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>

              

                <ListGroup.Item>
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} reviews`}
                  />
                  <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                </ListGroup.Item>

                {
                product.countInStock > 0 && 
                (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                      <Form.Control as="select" value={qty} onChange={(e)=> setQty(Number(e.target.value))}>
                        {[...Array(product.countInStock).keys()].map((x)=> (
                          <option key={x+1} value={x+1}>
                            {x+1}
                          </option>
                          ) )}
                      </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}

                <ListGroup.Item> 
                <Button
                 className="btn-block"
                 type='button'
                 disabled={product.countInStock ===0} 
                 onClick={addToCartHandler}
                >
                  Add to Cart
                </Button>
              </ListGroup.Item>

              </ListGroup>
            </Col>
            <Col md={3}> </Col>
          </Row>
          <Row className="review">
                <Col md={6}>
                 <h2>Reviews</h2>
                 {product.reviews.length ===0 && <Message>No Reviews</Message>} 

                 <ListGroup variant="flush">
                    {product.reviews.map(review => (
                      <ListGroupItem key={review._id}>
                        <strong>{review.name}</strong>
                        <Rating value={review.rating}></Rating>
                        <p>{review.createdAt.substring(0, 10)}</p>
                        <p>{review.comment}</p>
                      </ListGroupItem>
                    ))

                    }
                    <ListGroup.Item>
                      <h2>Write a customer review</h2>
                      {loadingProductReview && <Loader/>}
                      {userInfo ? (
                        <Form onSubmit={submitHandler}>
                        <Form.Group className='my-2' controlId='rating'>
                          <Form.Label>Rating</Form.Label>
                          <Form.Control
                            as='select'
                            required
                            value={rating}
                            onChange={(e) => setRating(e.target.value)}
                          >
                            <option value=''>Select...</option>
                            <option value='1'>1 - Poor</option>
                            <option value='2'>2 - Fair</option>
                            <option value='3'>3 - Good</option>
                            <option value='4'>4 - Very Good</option>
                            <option value='5'>5 - Excellent</option>
                          </Form.Control>
                        </Form.Group>
                        <Form.Group className='my-2' controlId='comment'>
                          <Form.Label>Comment</Form.Label>
                          <Form.Control
                            as='textarea'
                            row='3'
                            required
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          ></Form.Control>
                        </Form.Group>
                        <Button
                          type='submit'
                          variant='primary'
                        >
                          Submit
                        </Button>
                      </Form>
                      ): (
                        <Message>
                          Please <Link to='/login'>sign in</Link> to write a review
                        </Message>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
          </Row>
        </>
      )}
    </div>
  );
};

export default ProductScreen;
