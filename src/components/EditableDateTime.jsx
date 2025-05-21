import { useState } from "react";
import { Form } from "react-bootstrap";

function EditableDateTime({ initialValue, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    setIsEditing(false);
    onSave(value);
  };

  return (
    <span>
      {isEditing ? (
        <Form.Control
          type="datetime-local"
          size="sm"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      ) : (
        <span onClick={() => setIsEditing(true)} style={{ cursor: "pointer" }}>
          {value ? new Date(value).toLocaleString() : <i className="text-muted">Click to select date/time</i>}
        </span>
      )}
    </span>
  );
}

export default EditableDateTime;