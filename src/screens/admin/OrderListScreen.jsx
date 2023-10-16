import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import axios from "axios"
import {
  useGetOrdersQuery,

} from '../../slices/ordersApiSlice';

const OrderListScreen = () => {
  const { data: orders, isLoading, error,refetch } = useGetOrdersQuery();

  const handleDeliverClick = (orderId) => {
    axios.put("http://localhost:5000/api/orders/edit/"+orderId+"/deliver");
    refetch()

  };

  const handlePayClick = (orderId) => {
    axios.put("http://localhost:5000/api/orders/edit/"+orderId+"/pay");
    refetch()

  };

  return (
    <>
      <h1>Orders</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
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
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
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
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                  {!order.isPaid && (
                    <Button
                      variant='primary'
                      className='btn-sm'
                      onClick={() => handlePayClick(order._id)}
                    >
                      Mark as Paid
                    </Button>
                  )}
                  {!order.isDelivered && (
                    <Button
                      variant='success'
                      className='btn-sm'
                      onClick={() => handleDeliverClick(order._id)}
                    >
                      Mark as Delivered
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderListScreen;
