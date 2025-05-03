import '../stylesheets/LoginBar.css';
import Table from 'react-bootstrap/Table';
import {getAllRequests, getUserName} from '../utilities/Supabase';
import { useEffect, useState } from 'react';


function RequestList({ criteria = {}}) {
    const { exclude_statuses, user_id } = criteria;
    const [requests, setRequests] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const requestsArray = await getAllRequests({ exclude_statuses: exclude_statuses, user_id: user_id})
            setRequests(requestsArray);
        }
        fetchData();
        //const interval = setInterval(fetchData, 1000); // every 1 second
        //return () => clearInterval(interval);
    }, [exclude_statuses, user_id]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); // or use .toLocaleDateString() for just the date
    };

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                <th>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Type</th>
                <th>Date Submitted</th>
                </tr>
            </thead>
            <tbody>
            {requests.map((request, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{request.name}</td>
                    <td>{request.status}</td>
                    <td>{request.type}</td>

                    <td>{formatDate(request.created_at)}</td>
                </tr>
            ))}
            </tbody>
    </Table>
    )
}

export default RequestList;