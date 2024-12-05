import React, { useState } from 'react';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';

const ViewAssignedTasks = () => {
  const [tasks] = useState([
    {
      TaskID: 'T123',
      AssignedBy: 'Admin John',
      TaskDescription: 'Complete the planting schedule by next week.',
      DueDate: '2024-11-30'
    },
    {
      TaskID: 'T124',
      AssignedBy: 'Vriksha Sevak Rahul',
      TaskDescription: 'Distribute fertilizers in Field 2.',
      DueDate: '2024-12-05'
    }
  ]);
  const [loading] = useState(false);
  const [error] = useState(null);

  const styles = {
    container: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    headerText: {
      color: '#3a3a3a',
      fontSize: '24px',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: '20px'
    },
    spinner: {
      color: '#3498db'
    },
    tableHeader: {
      backgroundColor: '#3498db',
      color: 'white'
    },
    tableCell: {
      padding: '12px',
      textAlign: 'center'
    },
    rowHover: {
      transition: 'background-color 0.3s ease'
    },
    rowHoverEffect: {
      backgroundColor: '#eaf2f8'
    }
  };

  return (
    <Container style={styles.container}>
      <h2 style={styles.headerText}>Assigned Tasks</h2>

      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status" style={styles.spinner}>
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr style={styles.tableHeader}>
              <th style={styles.tableCell}>Task ID</th>
              <th style={styles.tableCell}>Assigned By</th>
              <th style={styles.tableCell}>Task Description</th>
              <th style={styles.tableCell}>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.TaskID}
                style={styles.rowHover}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.rowHoverEffect.backgroundColor)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
              >
                <td style={styles.tableCell}>{task.TaskID}</td>
                <td style={styles.tableCell}>{task.AssignedBy}</td>
                <td style={styles.tableCell}>{task.TaskDescription}</td>
                <td style={styles.tableCell}>{new Date(task.DueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ViewAssignedTasks;
