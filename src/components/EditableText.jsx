import { useState } from "react";
import { Form, Button } from "react-bootstrap";

function EditableText({ initialValue, onSave }) {
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
          type="text"
          size="sm"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
      ) : (
        <span onClick={() => setIsEditing(true)} style={{ cursor: "pointer" }}>
          {value || <i className="text-muted">Click to edit</i>}
        </span>
      )}
    </span>
  );
}

export default EditableText;