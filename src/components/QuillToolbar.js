import React from "react";
import { Quill } from "react-quill";

const QuillToolbar = () => {
  return (
    <div id="toolbar">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <select className="ql-color">
        <option value="red">Red</option>
        <option value="green">Green</option>
        <option value="blue">Blue</option>
        <option value="orange">Orange</option>
        <option value="violet">Violet</option>
        <option value="black">Black</option>
      </select>
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-link" />
      <button className="ql-image" />
    </div>
  );
};

export default QuillToolbar;
