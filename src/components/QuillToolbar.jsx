import React from "react";

const QuillToolbar = () => {
  return (
    <div id="toolbar">
      <select className="ql-header" defaultValue="">
        <option value="" disabled>
          Header
        </option>
        <option value="1">H1</option>
        <option value="2">H2</option>
      </select>
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-clean" />
    </div>
  );
};

export default QuillToolbar;
