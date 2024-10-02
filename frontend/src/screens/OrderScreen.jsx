import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
  Table
} from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useDeliverOrderMutation, useGetMyOrdersQuery, useGetOrderDetailsQuery, useGetPayPalClientIdQuery, usePayOrderMutation } from "../slices/ordersApiSlice";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";


const OrderScreen = () => {
  const { id: orderId } = useParams();
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  console.log("order details" + JSON.stringify(order));

  const [payOrder, {isLoading: loadingPay}] = usePayOrderMutation();
  const [{isPending}, payPalDispatch] = usePayPalScriptReducer();
  const {userInfo} =  useSelector((state)=> state.auth);
  const { data:paypal, isLoading:loadingPayPal, error:errorPayPal} = useGetPayPalClientIdQuery();
  const { data:orders, Loading, err } = useGetMyOrdersQuery();
  const [deliverOrder, {isLoading:loadingDeliver}] = useDeliverOrderMutation();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        payPalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        payPalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, payPalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  //TESTING ONLY! REMOVE BEFORE PRODUCTION
  async function onApproveTest() {
    await payOrder({ orderId, details: { payer: {} } });
    refetch();

    toast.success('Order is paid');
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }


  function onError(err) {
    toast.error(err.message);
  }


  const deliverOrderHandler = async()=> {
      try {
        await deliverOrder(orderId);
        refetch();
        toast.success('Order delivered');
      } catch (err) {
        toast.error(err.message);
      }
  }


  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger" />
  ) : (
    <div> 
      <h1>Order {order._id} </h1>
      <Row>
        <Col md={8}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name</strong>
                {order?.user?.name}
              </p>
              <p>
                <strong>Email</strong>
                {order.user.email}
              </p>

              <p>
                <strong>Address</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city} {' '},
                 {order.shippingAddress.postalCode},
                  {''}{order.shippingAddress.country}
              </p>
              <p>
                {order.isDelivered ? (
                    <Message variant="success">
                        Delivered on {order.deliveredAt}
                    </Message>
                ) :(
                    <Message variant="danger">
                    Not Delivered
                </Message> 
                ) }
              </p>


              <p>
                <h2>Payment Method</h2>
               <p>
                <strong>Method</strong>
                {order.paymentMethod}
               </p>

               {order.isPaid ? (
                    <Message variant="success">
                        Paid on {order.paidAt}
                    </Message>
                ) :(
                    <Message variant="danger">
                    Not Paid
                </Message> 
                ) }

              </p>
            </ListGroup.Item>


            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant='flush'>
                  {order.orderItems.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.image}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </Col>
                        <Col md={4}>
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>  

            
            </ListGroup>
         
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>

                    <ListGroup.Item>
                       <Row>
                           <Col>Items</Col>
                           <Col>
                            ${order.itemsPrice}
                           </Col> 
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                       <Row>
                           <Col>Shipping</Col>
                           <Col>
                            ${order.shippingPrice}
                           </Col> 
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                       <Row>
                           <Col>Tax</Col>
                           <Col>
                            ${order.taxPrice}
                           </Col> 
                        </Row>
                    </ListGroup.Item>

                    <ListGroup.Item>
                       <Row>
                           <Col>Total Price</Col>
                           <Col>
                            ${order.totalPrice}
                           </Col> 
                        </Row>
                    </ListGroup.Item>

                    {!order.isPaid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <div>
                   <Button
                        style={{ marginBottom: '10px' }}
                        onClick={onApproveTest}
                      >
                        Test Pay Order
                      </Button> 
                      

                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              )}

               { loadingDeliver && <Loader/>} 
               { userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup>
                      <Button type='button' className="btn btn-block" onClick={deliverOrderHandler}>
                        Mark As Delivered
                      </Button>
                  </ListGroup>
               ) }
                </ListGroup>
            </Card>
        </Col>
       
      </Row>
    </div>
  );
};

export default OrderScreen;
