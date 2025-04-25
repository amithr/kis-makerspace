import { useState } from "react";
import { Form } from "react-bootstrap";

function EditableSelect({ initialValue, options, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    setIsEditing(false);
    onSave(value);
  };

  return (
    <span>
      {isEditing ? (
        <Form.Select
          size="sm"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Form.Select>
      ) : (
        <span onClick={() => setIsEditing(true)} style={{ cursor: "pointer" }}>
          {value || <i className="text-muted">Click to select</i>}
        </span>
      )}
    </span>
  );
}

export default EditableSelect;