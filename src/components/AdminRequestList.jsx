import { useEffect, useState } from 'react';
import { getAllRequests, updateRequest, deleteRequest, sendEmail } from '../utilities/Supabase';
import Table from 'react-bootstrap/Table';
import EditableSelect from './EditableSelect';
import Button from 'react-bootstrap/Button';

function AdminRequestList() {
  const [requests, setRequests] = useState([]);
  
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

  async function removeRequest(requestId, fileUrl) {
    const data = await deleteRequest(requestId, fileUrl);
    setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
  }
  async function updateStatus(requestId, requestEmailAddress, newStatus) {
    let subject = "";
    let message = "";

    await updateRequest(requestId, 'status', newStatus);
    
    switch(newStatus) {
      case "In-Progress":
        subject = "Request in-progress."
        message = "<p>Your request is currently being processed. You will receive another email when it is complete.</p>"
        break;
      case "Ready for Pickup":
        subject = "Request is ready for pickup."
        message = "<p>Stop by Mr. Amith's room to pick up your request!</p>"
        break;
      default:
        subject = "Request Update";
        message = "<p>Your request status has changed.</p>";
    }

    // const result = await sendEmail({
    //   to: requestEmailAddress,
    //   subject: subject,
    //   html: message,
    // });
    
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
                        updateStatus(request.id, request.email_address, newStatus)
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
                    <td><Button variant="success" as="a" href={request.signed_link} download>Download</Button></td>
                    <td>{formatDate(request.created_at)}</td>
                    <td><Button variant="danger" onClick={() => removeRequest(request.id, request.file_url)}>Delete</Button></td>
                </tr>
            ))}
            </tbody>
    </Table>
  )
}

export default AdminRequestList;