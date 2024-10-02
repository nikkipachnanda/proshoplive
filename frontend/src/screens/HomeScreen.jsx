//import React, { useEffect, useState } from 'react';
import {Row, Col, Spinner} from 'react-bootstrap';
//import products from "../products";
import Product from '../components/Product';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../components/Paginate';
import ProductCraousel from '../components/ProductCraousel';
import Meta from '../components/Meta';
//import axios from 'axios';

const HomeScreen = () => {

  // const [products, setProducts] = useState([]);

  // useEffect(()=>
  //   {

  //     const fetchProducts = async ()=> 
  //       {
  //         const {data} = await axios.get('/api/products');
  //         setProducts(data)
  //       }

  //       fetchProducts();
        
  //   },[])
 
  const {pageNumber,keyword} = useParams();
  const { data, isLoading, error} = useGetProductsQuery({keyword, pageNumber});


  return (
    <>
    {!keyword ? <ProductCraousel></ProductCraousel> : ( <Link to="/" className="btn btn-light">Go Back</Link>)}
    { isLoading ? (
      <h2>
        <Loader/>
      </h2>
    ): error ? (
      <Message variant='danger'>{error?.data.message || error.error}</Message>
    ) : (
      <>
      <Row>
           <Meta title="Welcome to Proshop"/>
            <h1>Latest Products  </h1>
            {data.products?.map ((product)=> (
                <Col key={product._id}  sm={12} md={6} lg={4} xl= {3} >
                   <Product product={product}></Product>
                </Col> 
            ))}
        </Row>

        <Paginate pages={data.pages} page={data.page} keyword ={ keyword ? keyword :''}  >  </Paginate>
      </>
    )}
        
    </>
  )
}

export default HomeScreen
