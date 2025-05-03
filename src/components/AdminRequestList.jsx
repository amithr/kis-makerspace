import { useEffect, useState } from 'react';
import { getAllRequests, updateRequest, deleteRequest, generateRequestDownloadLink } from '../utilities/Supabase';
import Table from 'react-bootstrap/Table';
import EditableText from './EditableText';
import EditableSelect from './EditableSelect';
import Button from 'react-bootstrap/Button';

function AdminRequestList() {
  const [requests, setRequests] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);
  
  useEffect(() => {
      async function fetchData() {
          const data = await getAllRequests();
          setRequests(data);
      }
      fetchData();
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // or use .toLocaleDateString() for just the date
  };

  async function removeRequest(id) {
    const data = await deleteRequest(id);
    setRequests(prevRequests => prevRequests.filter(request => request.id !== id));
  }

  return (
    <Table striped bordered hover>
            <thead>
                <tr>
                <th>#</th>
                <th>Name</th>
                <th>Status</th>
                <th>Type</th>
                <th>Download</th>
                <th>Date Submitted</th>
                </tr>
            </thead>
            <tbody>
            {requests.map((request, index) => (
                <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{request.name}</td>
                    <td>
                      <EditableSelect
                      initialValue={request.status}
                      options={["Received", "In-Progress", "Finished", "Ready for Pickup"]}
                      onSave={(newStatus) => {
                        updateRequest(request.id, 'status', newStatus);
                      }}
                      />
                    </td>
                    <td>
                      <EditableSelect
                        initialValue={request.type}
                        options={["3D Printer", "Laser Cutter"]}
                        onSave={(newType) => {
                          updateRequest(request.id, 'type', newType );
                        }}
                        />
                    </td>
                    <td>{formatDate(request.created_at)}</td>
                    <td><Button variant="success" as="a" href={request.signed_link} download>Download</Button></td>
                    <td><Button variant="danger" onClick={() => removeRequest(request.id)}>Delete</Button></td>
                </tr>
            ))}
            </tbody>
    </Table>
  )
}

export default AdminRequestList;