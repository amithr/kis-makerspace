import '../stylesheets/LoginBar.css';
import Table from 'react-bootstrap/Table';
import {getAllRequests, getUserName} from '../utilities/Supabase';
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';


function RequestList({ criteria = {}}) {
    const { excludeStatuses, userId, shouldBeFiltered} = criteria;
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Don't make any calls to the backend if we don't have a user_id and the requests should be filtered
        if (!userId && shouldBeFiltered) return;
        async function fetchData() {
            // Start showing loading spinner
            setLoading(true);
            const requestsArray = await getAllRequests({ exclude_statuses: excludeStatuses, user_id: userId})
            setRequests(requestsArray);
            // Stop showing loading spinner
            setLoading(false);
        }
        fetchData();
        // const interval = setInterval(fetchData, 1000); // every 1 second
        // return () => clearInterval(interval);
    }, [excludeStatuses, userId]);

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString(); // or use .toLocaleDateString() for just the date
    };

    return loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Table bordered hover>
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
      );
}

export default RequestList;